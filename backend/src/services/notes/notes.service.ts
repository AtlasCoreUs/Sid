import { PrismaClient, Note, Privacy, Prisma } from '@prisma/client';
import { ElasticsearchService } from '../elasticsearch.service';
import { RedisService } from '../redis.service';
import { AIService } from '../ai/ai.service';
import { ActivityService } from '../activity.service';
import { AppError } from '../../utils/errors';
import { logger } from '../../utils/logger';
import sanitizeHtml from 'sanitize-html';
import { marked } from 'marked';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

interface CreateNoteInput {
  title: string;
  content: string;
  folderId?: string;
  tags?: string[];
  privacy?: Privacy;
  password?: string;
  icon?: string;
  color?: string;
  coverImage?: string;
}

interface UpdateNoteInput {
  title?: string;
  content?: string;
  folderId?: string | null;
  tags?: string[];
  privacy?: Privacy;
  password?: string | null;
  icon?: string | null;
  color?: string | null;
  coverImage?: string | null;
  isPinned?: boolean;
  isArchived?: boolean;
}

interface SearchOptions {
  query: string;
  userId: string;
  tags?: string[];
  folderId?: string;
  privacy?: Privacy;
  isArchived?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'relevance' | 'created' | 'updated' | 'title';
  sortOrder?: 'asc' | 'desc';
}

interface NoteWithRelations extends Note {
  tags: Array<{ tag: { id: string; name: string; color: string | null } }>;
  folder: { id: string; name: string } | null;
  _count?: {
    versions: number;
    attachments: number;
    shares: number;
    collaborations: number;
  };
}

export class NotesService {
  private prisma: PrismaClient;
  private elasticsearch: ElasticsearchService;
  private redis: RedisService;
  private ai: AIService;
  private activity: ActivityService;

  constructor() {
    this.prisma = new PrismaClient();
    this.elasticsearch = ElasticsearchService.getInstance();
    this.redis = RedisService.getInstance();
    this.ai = new AIService();
    this.activity = new ActivityService();
  }

  /**
   * Create a new note
   */
  async createNote(userId: string, input: CreateNoteInput): Promise<NoteWithRelations> {
    const { title, content, folderId, tags, privacy, password, ...metadata } = input;

    // Validate folder ownership
    if (folderId) {
      const folder = await this.prisma.folder.findFirst({
        where: { id: folderId, userId }
      });
      if (!folder) {
        throw new AppError('Folder not found or access denied', 404);
      }
    }

    // Process content
    const processedContent = this.processContent(content);
    const wordCount = this.calculateWordCount(content);
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed

    // Hash password if provided
    let hashedPassword: string | undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Start transaction
    const note = await this.prisma.$transaction(async (tx) => {
      // Create note
      const newNote = await tx.note.create({
        data: {
          userId,
          title,
          content,
          contentHtml: processedContent.html,
          contentMarkdown: processedContent.markdown,
          excerpt: this.generateExcerpt(content),
          folderId,
          privacy: privacy || Privacy.PRIVATE,
          password: hashedPassword,
          wordCount,
          readingTime,
          ...metadata
        },
        include: {
          folder: true,
          tags: {
            include: {
              tag: true
            }
          },
          _count: {
            select: {
              versions: true,
              attachments: true,
              shares: true,
              collaborations: true
            }
          }
        }
      });

      // Create tags if provided
      if (tags && tags.length > 0) {
        await this.createOrUpdateTags(tx, userId, newNote.id, tags);
      }

      // Create initial version
      await tx.noteVersion.create({
        data: {
          noteId: newNote.id,
          title,
          content,
          versionNumber: 1,
          changedBy: userId,
          changesSummary: 'Initial version'
        }
      });

      return newNote;
    });

    // Index in Elasticsearch
    await this.indexNote(note);

    // Clear cache
    await this.clearUserNotesCache(userId);

    // Track activity
    await this.activity.track({
      userId,
      noteId: note.id,
      action: 'NOTE_CREATED',
      details: { title: note.title }
    });

    // Process with AI in background
    this.processNoteWithAI(note.id, content).catch(err => 
      logger.error('AI processing failed:', err)
    );

    logger.info(`Note created: ${note.id} by user: ${userId}`);

    return note;
  }

  /**
   * Update an existing note
   */
  async updateNote(
    userId: string,
    noteId: string,
    input: UpdateNoteInput
  ): Promise<NoteWithRelations> {
    // Get existing note
    const existingNote = await this.prisma.note.findFirst({
      where: {
        id: noteId,
        userId,
        isDeleted: false
      }
    });

    if (!existingNote) {
      throw new AppError('Note not found or access denied', 404);
    }

    // Validate folder ownership if changing folder
    if (input.folderId !== undefined) {
      if (input.folderId) {
        const folder = await this.prisma.folder.findFirst({
          where: { id: input.folderId, userId }
        });
        if (!folder) {
          throw new AppError('Folder not found or access denied', 404);
        }
      }
    }

    // Process content if updated
    let processedContent: any = {};
    let wordCount = existingNote.wordCount;
    let readingTime = existingNote.readingTime;

    if (input.content) {
      processedContent = this.processContent(input.content);
      wordCount = this.calculateWordCount(input.content);
      readingTime = Math.ceil(wordCount / 200);
    }

    // Hash password if provided
    let hashedPassword: string | null | undefined;
    if (input.password !== undefined) {
      hashedPassword = input.password ? await bcrypt.hash(input.password, 10) : null;
    }

    // Start transaction
    const updatedNote = await this.prisma.$transaction(async (tx) => {
      // Get current version number
      const latestVersion = await tx.noteVersion.findFirst({
        where: { noteId },
        orderBy: { versionNumber: 'desc' }
      });

      const newVersionNumber = (latestVersion?.versionNumber || 0) + 1;

      // Update note
      const note = await tx.note.update({
        where: { id: noteId },
        data: {
          title: input.title,
          content: input.content,
          contentHtml: input.content ? processedContent.html : undefined,
          contentMarkdown: input.content ? processedContent.markdown : undefined,
          excerpt: input.content ? this.generateExcerpt(input.content) : undefined,
          folderId: input.folderId,
          privacy: input.privacy,
          password: hashedPassword,
          wordCount,
          readingTime,
          icon: input.icon,
          color: input.color,
          coverImage: input.coverImage,
          isPinned: input.isPinned,
          isArchived: input.isArchived,
          lastEditedAt: new Date()
        },
        include: {
          folder: true,
          tags: {
            include: {
              tag: true
            }
          },
          _count: {
            select: {
              versions: true,
              attachments: true,
              shares: true,
              collaborations: true
            }
          }
        }
      });

      // Create version if content changed
      if (input.content && input.content !== existingNote.content) {
        await tx.noteVersion.create({
          data: {
            noteId,
            title: note.title,
            content: note.content,
            versionNumber: newVersionNumber,
            changedBy: userId,
            changesSummary: this.generateChangeSummary(existingNote, input)
          }
        });
      }

      // Update tags if provided
      if (input.tags) {
        // Remove existing tags
        await tx.noteTag.deleteMany({
          where: { noteId }
        });
        // Add new tags
        await this.createOrUpdateTags(tx, userId, noteId, input.tags);
      }

      return note;
    });

    // Update in Elasticsearch
    await this.indexNote(updatedNote);

    // Clear cache
    await this.clearUserNotesCache(userId);
    await this.redis.del(`note:${noteId}`);

    // Track activity
    await this.activity.track({
      userId,
      noteId,
      action: 'NOTE_UPDATED',
      details: { changes: Object.keys(input) }
    });

    // Process with AI if content changed
    if (input.content) {
      this.processNoteWithAI(noteId, input.content).catch(err => 
        logger.error('AI processing failed:', err)
      );
    }

    logger.info(`Note updated: ${noteId} by user: ${userId}`);

    return updatedNote;
  }

  /**
   * Get a single note
   */
  async getNote(
    userId: string,
    noteId: string,
    password?: string
  ): Promise<NoteWithRelations> {
    // Try cache first
    const cached = await this.redis.get(`note:${noteId}`);
    if (cached) {
      const note = JSON.parse(cached);
      if (note.userId === userId || note.privacy === Privacy.PUBLIC) {
        return note;
      }
    }

    // Get from database
    const note = await this.prisma.note.findFirst({
      where: {
        id: noteId,
        isDeleted: false,
        OR: [
          { userId },
          { privacy: Privacy.PUBLIC },
          { 
            collaborations: {
              some: { userId }
            }
          },
          {
            shares: {
              some: {
                isActive: true,
                OR: [
                  { expiresAt: null },
                  { expiresAt: { gt: new Date() } }
                ]
              }
            }
          }
        ]
      },
      include: {
        folder: true,
        tags: {
          include: {
            tag: true
          }
        },
        _count: {
          select: {
            versions: true,
            attachments: true,
            shares: true,
            collaborations: true
          }
        }
      }
    });

    if (!note) {
      throw new AppError('Note not found or access denied', 404);
    }

    // Check password if required
    if (note.password && note.userId !== userId) {
      if (!password) {
        throw new AppError('Password required', 401);
      }
      const isValid = await bcrypt.compare(password, note.password);
      if (!isValid) {
        throw new AppError('Invalid password', 401);
      }
    }

    // Increment view count if not owner
    if (note.userId !== userId) {
      await this.prisma.note.update({
        where: { id: noteId },
        data: { viewCount: { increment: 1 } }
      });
    }

    // Cache the note
    await this.redis.set(
      `note:${noteId}`,
      JSON.stringify(note),
      'EX',
      300 // 5 minutes
    );

    // Track activity
    await this.activity.track({
      userId,
      noteId,
      action: 'NOTE_VIEWED'
    });

    return note;
  }

  /**
   * Get user's notes with pagination
   */
  async getUserNotes(
    userId: string,
    options: {
      folderId?: string;
      tags?: string[];
      isArchived?: boolean;
      isPinned?: boolean;
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<{ notes: NoteWithRelations[]; total: number }> {
    const {
      folderId,
      tags,
      isArchived = false,
      isPinned,
      search,
      sortBy = 'updatedAt',
      sortOrder = 'desc',
      limit = 20,
      offset = 0
    } = options;

    // Build where clause
    const where: Prisma.NoteWhereInput = {
      userId,
      isDeleted: false,
      isArchived,
      ...(folderId && { folderId }),
      ...(isPinned !== undefined && { isPinned }),
      ...(tags && tags.length > 0 && {
        tags: {
          some: {
            tag: {
              name: { in: tags }
            }
          }
        }
      }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    // Execute query
    const [notes, total] = await this.prisma.$transaction([
      this.prisma.note.findMany({
        where,
        include: {
          folder: true,
          tags: {
            include: {
              tag: true
            }
          },
          _count: {
            select: {
              versions: true,
              attachments: true,
              shares: true,
              collaborations: true
            }
          }
        },
        orderBy: { [sortBy]: sortOrder },
        take: limit,
        skip: offset
      }),
      this.prisma.note.count({ where })
    ]);

    return { notes, total };
  }

  /**
   * Search notes using Elasticsearch
   */
  async searchNotes(options: SearchOptions): Promise<{
    notes: NoteWithRelations[];
    total: number;
    aggregations?: any;
  }> {
    const {
      query,
      userId,
      tags,
      folderId,
      privacy,
      isArchived = false,
      limit = 20,
      offset = 0,
      sortBy = 'relevance',
      sortOrder = 'desc'
    } = options;

    // Build Elasticsearch query
    const must: any[] = [
      { term: { userId } },
      { term: { isDeleted: false } },
      { term: { isArchived } }
    ];

    if (folderId) {
      must.push({ term: { folderId } });
    }

    if (privacy) {
      must.push({ term: { privacy } });
    }

    if (tags && tags.length > 0) {
      must.push({
        terms: { 'tags.name': tags }
      });
    }

    const should: any[] = [
      {
        multi_match: {
          query,
          fields: ['title^3', 'content', 'tags.name^2'],
          type: 'best_fields',
          fuzziness: 'AUTO'
        }
      }
    ];

    // Search in Elasticsearch
    const searchResult = await this.elasticsearch.search({
      index: 'notes',
      body: {
        query: {
          bool: {
            must,
            should,
            minimum_should_match: 1
          }
        },
        highlight: {
          fields: {
            title: {},
            content: {
              fragment_size: 150,
              number_of_fragments: 3
            }
          }
        },
        aggs: {
          tags: {
            terms: {
              field: 'tags.name',
              size: 10
            }
          },
          folders: {
            terms: {
              field: 'folder.name',
              size: 10
            }
          }
        },
        from: offset,
        size: limit,
        ...(sortBy === 'relevance' ? {} : {
          sort: [{ [sortBy]: sortOrder }]
        })
      }
    });

    // Get note IDs from search results
    const noteIds = searchResult.hits.hits.map((hit: any) => hit._id);

    // Fetch full note data from database
    const notes = await this.prisma.note.findMany({
      where: {
        id: { in: noteIds }
      },
      include: {
        folder: true,
        tags: {
          include: {
            tag: true
          }
        },
        _count: {
          select: {
            versions: true,
            attachments: true,
            shares: true,
            collaborations: true
          }
        }
      }
    });

    // Sort notes to match search result order
    const sortedNotes = noteIds.map(id => 
      notes.find(note => note.id === id)!
    ).filter(Boolean);

    return {
      notes: sortedNotes,
      total: searchResult.hits.total.value,
      aggregations: searchResult.aggregations
    };
  }

  /**
   * Delete a note (soft delete)
   */
  async deleteNote(userId: string, noteId: string): Promise<void> {
    const note = await this.prisma.note.findFirst({
      where: {
        id: noteId,
        userId,
        isDeleted: false
      }
    });

    if (!note) {
      throw new AppError('Note not found or access denied', 404);
    }

    // Soft delete
    await this.prisma.note.update({
      where: { id: noteId },
      data: {
        isDeleted: true,
        deletedAt: new Date()
      }
    });

    // Remove from Elasticsearch
    await this.elasticsearch.delete({
      index: 'notes',
      id: noteId
    });

    // Clear cache
    await this.clearUserNotesCache(userId);
    await this.redis.del(`note:${noteId}`);

    // Track activity
    await this.activity.track({
      userId,
      noteId,
      action: 'NOTE_DELETED'
    });

    logger.info(`Note deleted: ${noteId} by user: ${userId}`);
  }

  /**
   * Restore a deleted note
   */
  async restoreNote(userId: string, noteId: string): Promise<NoteWithRelations> {
    const note = await this.prisma.note.findFirst({
      where: {
        id: noteId,
        userId,
        isDeleted: true
      }
    });

    if (!note) {
      throw new AppError('Deleted note not found or access denied', 404);
    }

    // Restore note
    const restoredNote = await this.prisma.note.update({
      where: { id: noteId },
      data: {
        isDeleted: false,
        deletedAt: null
      },
      include: {
        folder: true,
        tags: {
          include: {
            tag: true
          }
        },
        _count: {
          select: {
            versions: true,
            attachments: true,
            shares: true,
            collaborations: true
          }
        }
      }
    });

    // Re-index in Elasticsearch
    await this.indexNote(restoredNote);

    // Clear cache
    await this.clearUserNotesCache(userId);

    logger.info(`Note restored: ${noteId} by user: ${userId}`);

    return restoredNote;
  }

  /**
   * Permanently delete a note
   */
  async permanentlyDeleteNote(userId: string, noteId: string): Promise<void> {
    const note = await this.prisma.note.findFirst({
      where: {
        id: noteId,
        userId,
        isDeleted: true
      }
    });

    if (!note) {
      throw new AppError('Deleted note not found or access denied', 404);
    }

    // Delete note and all related data
    await this.prisma.note.delete({
      where: { id: noteId }
    });

    logger.info(`Note permanently deleted: ${noteId} by user: ${userId}`);
  }

  /**
   * Get note versions
   */
  async getNoteVersions(userId: string, noteId: string): Promise<any[]> {
    // Verify access
    await this.getNote(userId, noteId);

    const versions = await this.prisma.noteVersion.findMany({
      where: { noteId },
      orderBy: { versionNumber: 'desc' }
    });

    return versions;
  }

  /**
   * Restore a specific version
   */
  async restoreVersion(
    userId: string,
    noteId: string,
    versionNumber: number
  ): Promise<NoteWithRelations> {
    // Verify access
    const note = await this.getNote(userId, noteId);

    if (note.userId !== userId) {
      throw new AppError('Only note owner can restore versions', 403);
    }

    // Get the version
    const version = await this.prisma.noteVersion.findUnique({
      where: {
        noteId_versionNumber: { noteId, versionNumber }
      }
    });

    if (!version) {
      throw new AppError('Version not found', 404);
    }

    // Restore the version
    return this.updateNote(userId, noteId, {
      title: version.title,
      content: version.content
    });
  }

  /**
   * Duplicate a note
   */
  async duplicateNote(userId: string, noteId: string): Promise<NoteWithRelations> {
    const originalNote = await this.getNote(userId, noteId);

    // Create copy
    const duplicatedNote = await this.createNote(userId, {
      title: `${originalNote.title} (Copy)`,
      content: originalNote.content,
      folderId: originalNote.folderId || undefined,
      privacy: Privacy.PRIVATE,
      icon: originalNote.icon || undefined,
      color: originalNote.color || undefined
    });

    // Copy tags
    const tags = originalNote.tags.map(t => t.tag.name);
    if (tags.length > 0) {
      await this.updateNote(userId, duplicatedNote.id, { tags });
    }

    logger.info(`Note duplicated: ${noteId} -> ${duplicatedNote.id}`);

    return duplicatedNote;
  }

  /**
   * Helper: Process content (sanitize HTML, convert Markdown)
   */
  private processContent(content: string): {
    html: string;
    markdown: string;
  } {
    // Convert Markdown to HTML
    const html = marked.parse(content) as string;

    // Sanitize HTML
    const sanitized = sanitizeHtml(html, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3']),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ['src', 'alt', 'title', 'width', 'height']
      }
    });

    return {
      html: sanitized,
      markdown: content
    };
  }

  /**
   * Helper: Generate excerpt from content
   */
  private generateExcerpt(content: string, length: number = 200): string {
    const plainText = content
      .replace(/[#*`_~\[\]()]/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    if (plainText.length <= length) {
      return plainText;
    }

    return plainText.substring(0, length).trim() + '...';
  }

  /**
   * Helper: Calculate word count
   */
  private calculateWordCount(content: string): number {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Helper: Generate change summary
   */
  private generateChangeSummary(
    oldNote: Note,
    changes: UpdateNoteInput
  ): string {
    const changedFields: string[] = [];

    if (changes.title && changes.title !== oldNote.title) {
      changedFields.push('title');
    }
    if (changes.content && changes.content !== oldNote.content) {
      changedFields.push('content');
    }
    if (changes.folderId !== undefined && changes.folderId !== oldNote.folderId) {
      changedFields.push('folder');
    }
    if (changes.privacy && changes.privacy !== oldNote.privacy) {
      changedFields.push('privacy');
    }

    return `Updated ${changedFields.join(', ')}`;
  }

  /**
   * Helper: Create or update tags
   */
  private async createOrUpdateTags(
    tx: any,
    userId: string,
    noteId: string,
    tagNames: string[]
  ): Promise<void> {
    for (const tagName of tagNames) {
      // Create tag if it doesn't exist
      const tag = await tx.tag.upsert({
        where: {
          userId_name: { userId, name: tagName.toLowerCase() }
        },
        create: {
          userId,
          name: tagName.toLowerCase(),
          color: this.generateTagColor()
        },
        update: {}
      });

      // Link tag to note
      await tx.noteTag.create({
        data: {
          noteId,
          tagId: tag.id
        }
      });
    }
  }

  /**
   * Helper: Generate random tag color
   */
  private generateTagColor(): string {
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * Helper: Index note in Elasticsearch
   */
  private async indexNote(note: NoteWithRelations): Promise<void> {
    try {
      await this.elasticsearch.index({
        index: 'notes',
        id: note.id,
        body: {
          userId: note.userId,
          title: note.title,
          content: note.content,
          excerpt: note.excerpt,
          folderId: note.folderId,
          folder: note.folder ? {
            id: note.folder.id,
            name: note.folder.name
          } : null,
          tags: note.tags.map(t => ({
            id: t.tag.id,
            name: t.tag.name
          })),
          privacy: note.privacy,
          isPinned: note.isPinned,
          isArchived: note.isArchived,
          isDeleted: note.isDeleted,
          wordCount: note.wordCount,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt
        }
      });
    } catch (error) {
      logger.error('Failed to index note:', error);
    }
  }

  /**
   * Helper: Process note with AI
   */
  private async processNoteWithAI(noteId: string, content: string): Promise<void> {
    try {
      // Extract keywords
      const keywords = await this.ai.extractKeywords(content);
      
      // Generate summary
      const summary = await this.ai.generateSummary(content);
      
      // Analyze sentiment
      const sentiment = await this.ai.analyzeSentiment(content);

      // Store analysis
      await this.prisma.aIAnalysis.createMany({
        data: [
          {
            noteId,
            type: 'KEYWORDS',
            result: { keywords },
            processingTime: 0
          },
          {
            noteId,
            type: 'SUMMARY',
            result: { summary },
            processingTime: 0
          },
          {
            noteId,
            type: 'SENTIMENT',
            result: sentiment,
            processingTime: 0
          }
        ]
      });
    } catch (error) {
      logger.error('AI processing failed:', error);
    }
  }

  /**
   * Helper: Clear user notes cache
   */
  private async clearUserNotesCache(userId: string): Promise<void> {
    const keys = await this.redis.keys(`user-notes:${userId}:*`);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}