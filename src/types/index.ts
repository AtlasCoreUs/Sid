export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  isArchived?: boolean;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  reminder?: Date;
  isLocked?: boolean;
  password?: string;
  tables?: string[][];
  formattedContent?: string;
  wordCount?: number;
  characterCount?: number;
  readingTime?: number;
  links?: NoteLink[];
  attachments?: Attachment[];
  collaborators?: Collaborator[];
  version?: number;
  isTemplate?: boolean;
  templateCategory?: string;
  aiGenerated?: boolean;
  sentiment?: 'positive' | 'negative' | 'neutral';
  language?: string;
  seoKeywords?: string[];
  customFields?: Record<string, unknown>;
}

export interface NoteLink {
  id: string;
  targetNoteId: string;
  targetNoteTitle: string;
  linkType: 'bidirectional' | 'unidirectional';
  createdAt: Date;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'video' | 'audio' | 'archive';
  size: number;
  url: string;
  uploadedAt: Date;
  thumbnailUrl?: string;
}

export interface Collaborator {
  id: string;
  email: string;
  name: string;
  role: 'viewer' | 'editor' | 'admin';
  joinedAt: Date;
  lastActive?: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
  parentId?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  usageCount: number;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: Date;
  lastActive: Date;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'auto';
  language: string;
  fontSize: number;
  sidebarWidth: number;
  autoSave: boolean;
  autoSaveInterval: number;
  notifications: boolean;
  keyboardShortcuts: Record<string, string>;
  defaultCategory: string;
  defaultTemplate?: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: Collaborator[];
  settings: WorkspaceSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceSettings {
  allowPublicSharing: boolean;
  requireApproval: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
  retentionPolicy: number;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
}

export interface SearchResult {
  note: Note;
  relevance: number;
  matchedFields: string[];
  snippet: string;
}

export interface ExportOptions {
  format: 'txt' | 'md' | 'json' | 'pdf' | 'docx' | 'html';
  includeMetadata: boolean;
  includeAttachments: boolean;
  includeLinks: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  categories?: string[];
  tags?: string[];
}

export interface AIAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  keywords: string[];
  summary: string;
  readingTime: number;
  complexity: 'easy' | 'medium' | 'hard';
  suggestions: string[];
  language: string;
}

export interface Analytics {
  totalNotes: number;
  totalWords: number;
  totalCharacters: number;
  averageNotesPerDay: number;
  mostUsedCategories: Array<{ category: string; count: number }>;
  mostUsedTags: Array<{ tag: string; count: number }>;
  productivityScore: number;
  writingStreak: number;
  lastActivity: Date;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  action?: {
    label: string;
    url: string;
  };
  createdAt: Date;
  read: boolean;
}

export interface KeyboardShortcut {
  key: string;
  description: string;
  action: string;
  category: string;
}

export interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  enabled: boolean;
  settings: Record<string, unknown>;
  permissions: string[];
}

export interface Backup {
  id: string;
  name: string;
  size: number;
  createdAt: Date;
  type: 'manual' | 'automatic';
  status: 'completed' | 'failed' | 'in_progress';
  downloadUrl?: string;
}

export interface SyncStatus {
  lastSync: Date;
  status: 'synced' | 'pending' | 'conflict' | 'error';
  pendingChanges: number;
  errorMessage?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

export interface ModalState {
  isOpen: boolean;
  type: string;
  data?: unknown;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}