import OpenAI from 'openai';
import { PrismaClient, AIFeature, AIStatus } from '@prisma/client';
import { RedisService } from '../redis.service';
import { logger } from '../../utils/logger';
import { AppError } from '../../utils/errors';
import Tesseract from 'tesseract.js';
import * as tf from '@tensorflow/tfjs-node';
import natural from 'natural';

interface AIResponse<T> {
  result: T;
  tokens: number;
  cost: number;
  duration: number;
}

interface TextAnalysis {
  summary: string;
  keywords: string[];
  sentiment: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
  };
  entities: Array<{
    text: string;
    type: string;
  }>;
  categories: string[];
  language: string;
  readability: {
    score: number;
    level: string;
  };
}

interface TranscriptionResult {
  text: string;
  confidence: number;
  language: string;
  duration: number;
}

interface OCRResult {
  text: string;
  confidence: number;
  language: string;
  blocks: Array<{
    text: string;
    confidence: number;
    bounds: any;
  }>;
}

export class AIService {
  private openai: OpenAI;
  private prisma: PrismaClient;
  private redis: RedisService;
  private tokenizer: any;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORGANIZATION
    });
    this.prisma = new PrismaClient();
    this.redis = RedisService.getInstance();
    this.tokenizer = new natural.WordTokenizer();
  }

  /**
   * Analyze text comprehensively
   */
  async analyzeText(userId: string, text: string): Promise<AIResponse<TextAnalysis>> {
    const startTime = Date.now();
    const cacheKey = `ai:text-analysis:${this.hashText(text)}`;

    // Check cache
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    try {
      // Prepare the prompt
      const prompt = `Analyze the following text comprehensively. Provide:
1. A concise summary (max 150 words)
2. Extract 5-10 key keywords/phrases
3. Determine the sentiment (positive, negative, neutral) with a score from -1 to 1
4. Identify named entities (people, places, organizations, dates)
5. Categorize the text into relevant topics
6. Detect the language
7. Assess readability level (elementary, intermediate, advanced)

Text: """
${text}
"""

Respond in JSON format.`;

      // Call OpenAI
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert text analyst. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      const tokens = completion.usage?.total_tokens || 0;
      const cost = this.calculateCost(tokens, 'gpt-4-turbo-preview');
      const duration = Date.now() - startTime;

      const analysis: TextAnalysis = {
        summary: result.summary,
        keywords: result.keywords,
        sentiment: {
          score: result.sentiment.score,
          label: result.sentiment.label
        },
        entities: result.entities,
        categories: result.categories,
        language: result.language,
        readability: {
          score: result.readability.score,
          level: result.readability.level
        }
      };

      const response: AIResponse<TextAnalysis> = {
        result: analysis,
        tokens,
        cost,
        duration
      };

      // Cache result
      await this.redis.set(cacheKey, JSON.stringify(response), 'EX', 3600); // 1 hour

      // Track usage
      await this.trackUsage(userId, AIFeature.TEXT_ANALYSIS, tokens, cost, duration, AIStatus.SUCCESS);

      return response;
    } catch (error: any) {
      logger.error('Text analysis failed:', error);
      await this.trackUsage(userId, AIFeature.TEXT_ANALYSIS, 0, 0, Date.now() - startTime, AIStatus.FAILED, error.message);
      throw new AppError('Text analysis failed', 500);
    }
  }

  /**
   * Generate text summary
   */
  async generateSummary(text: string, maxLength: number = 150): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a professional summarizer. Create concise summaries that capture the main points. Maximum ${maxLength} words.`
          },
          {
            role: 'user',
            content: `Summarize the following text:\n\n${text}`
          }
        ],
        temperature: 0.3,
        max_tokens: 300
      });

      return completion.choices[0].message.content || '';
    } catch (error) {
      logger.error('Summary generation failed:', error);
      throw new AppError('Summary generation failed', 500);
    }
  }

  /**
   * Extract keywords from text
   */
  async extractKeywords(text: string): Promise<string[]> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Extract 5-10 important keywords or key phrases from the text. Return as a JSON array.'
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 100,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(completion.choices[0].message.content || '{"keywords":[]}');
      return result.keywords || [];
    } catch (error) {
      logger.error('Keyword extraction failed:', error);
      
      // Fallback to local NLP
      return this.extractKeywordsLocal(text);
    }
  }

  /**
   * Analyze sentiment
   */
  async analyzeSentiment(text: string): Promise<{ score: number; label: string }> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Analyze the sentiment of the text. Return a score from -1 (very negative) to 1 (very positive) and a label (positive/negative/neutral). Respond in JSON format.'
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 50,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(completion.choices[0].message.content || '{"score":0,"label":"neutral"}');
      return result;
    } catch (error) {
      logger.error('Sentiment analysis failed:', error);
      
      // Fallback to local sentiment analysis
      const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
      const tokenized = this.tokenizer.tokenize(text);
      const score = analyzer.getSentiment(tokenized);
      
      return {
        score: Math.max(-1, Math.min(1, score / 5)), // Normalize to -1 to 1
        label: score > 0.2 ? 'positive' : score < -0.2 ? 'negative' : 'neutral'
      };
    }
  }

  /**
   * Translate text
   */
  async translateText(
    userId: string,
    text: string,
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<AIResponse<string>> {
    const startTime = Date.now();

    try {
      const prompt = sourceLanguage
        ? `Translate the following text from ${sourceLanguage} to ${targetLanguage}:\n\n${text}`
        : `Translate the following text to ${targetLanguage}:\n\n${text}`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional translator. Provide accurate and natural translations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      });

      const translation = completion.choices[0].message.content || '';
      const tokens = completion.usage?.total_tokens || 0;
      const cost = this.calculateCost(tokens, 'gpt-3.5-turbo');
      const duration = Date.now() - startTime;

      await this.trackUsage(userId, AIFeature.TRANSLATION, tokens, cost, duration, AIStatus.SUCCESS);

      return {
        result: translation,
        tokens,
        cost,
        duration
      };
    } catch (error: any) {
      logger.error('Translation failed:', error);
      await this.trackUsage(userId, AIFeature.TRANSLATION, 0, 0, Date.now() - startTime, AIStatus.FAILED, error.message);
      throw new AppError('Translation failed', 500);
    }
  }

  /**
   * Check grammar and suggest corrections
   */
  async checkGrammar(
    userId: string,
    text: string
  ): Promise<AIResponse<Array<{ error: string; suggestion: string; position: number }>>> {
    const startTime = Date.now();

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a grammar expert. Identify grammar errors and provide corrections. Return as JSON array with error, suggestion, and approximate position.'
          },
          {
            role: 'user',
            content: `Check the grammar of this text:\n\n${text}`
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(completion.choices[0].message.content || '{"corrections":[]}');
      const tokens = completion.usage?.total_tokens || 0;
      const cost = this.calculateCost(tokens, 'gpt-3.5-turbo');
      const duration = Date.now() - startTime;

      await this.trackUsage(userId, AIFeature.GRAMMAR_CHECK, tokens, cost, duration, AIStatus.SUCCESS);

      return {
        result: result.corrections || [],
        tokens,
        cost,
        duration
      };
    } catch (error: any) {
      logger.error('Grammar check failed:', error);
      await this.trackUsage(userId, AIFeature.GRAMMAR_CHECK, 0, 0, Date.now() - startTime, AIStatus.FAILED, error.message);
      throw new AppError('Grammar check failed', 500);
    }
  }

  /**
   * Generate content based on prompt
   */
  async generateContent(
    userId: string,
    prompt: string,
    type: 'creative' | 'technical' | 'business' = 'creative',
    maxLength: number = 500
  ): Promise<AIResponse<string>> {
    const startTime = Date.now();

    try {
      const systemPrompts = {
        creative: 'You are a creative writer. Generate engaging and imaginative content.',
        technical: 'You are a technical writer. Generate clear, accurate, and well-structured technical content.',
        business: 'You are a business writer. Generate professional and concise business content.'
      };

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: systemPrompts[type]
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: type === 'creative' ? 0.8 : 0.5,
        max_tokens: maxLength
      });

      const content = completion.choices[0].message.content || '';
      const tokens = completion.usage?.total_tokens || 0;
      const cost = this.calculateCost(tokens, 'gpt-4');
      const duration = Date.now() - startTime;

      await this.trackUsage(userId, AIFeature.CONTENT_GENERATION, tokens, cost, duration, AIStatus.SUCCESS);

      return {
        result: content,
        tokens,
        cost,
        duration
      };
    } catch (error: any) {
      logger.error('Content generation failed:', error);
      await this.trackUsage(userId, AIFeature.CONTENT_GENERATION, 0, 0, Date.now() - startTime, AIStatus.FAILED, error.message);
      throw new AppError('Content generation failed', 500);
    }
  }

  /**
   * Transcribe audio to text
   */
  async transcribeAudio(
    userId: string,
    audioBuffer: Buffer,
    language?: string
  ): Promise<AIResponse<TranscriptionResult>> {
    const startTime = Date.now();

    try {
      // Create a File object from buffer
      const file = new File([audioBuffer], 'audio.webm', { type: 'audio/webm' });

      const transcription = await this.openai.audio.transcriptions.create({
        file,
        model: 'whisper-1',
        language: language || 'en',
        response_format: 'verbose_json'
      });

      const result: TranscriptionResult = {
        text: transcription.text,
        confidence: 0.95, // Whisper doesn't provide confidence scores
        language: transcription.language || language || 'en',
        duration: transcription.duration || 0
      };

      // Estimate tokens (rough approximation)
      const tokens = Math.ceil(transcription.text.split(' ').length * 1.3);
      const cost = this.calculateCost(tokens, 'whisper');
      const duration = Date.now() - startTime;

      await this.trackUsage(userId, AIFeature.VOICE_TRANSCRIPTION, tokens, cost, duration, AIStatus.SUCCESS);

      return {
        result,
        tokens,
        cost,
        duration
      };
    } catch (error: any) {
      logger.error('Audio transcription failed:', error);
      await this.trackUsage(userId, AIFeature.VOICE_TRANSCRIPTION, 0, 0, Date.now() - startTime, AIStatus.FAILED, error.message);
      throw new AppError('Audio transcription failed', 500);
    }
  }

  /**
   * Perform OCR on handwritten text
   */
  async performOCR(
    userId: string,
    imageBuffer: Buffer,
    language: string = 'eng'
  ): Promise<AIResponse<OCRResult>> {
    const startTime = Date.now();

    try {
      // Use Tesseract for OCR
      const result = await Tesseract.recognize(imageBuffer, language, {
        logger: (m) => logger.debug(m)
      });

      const ocrResult: OCRResult = {
        text: result.data.text,
        confidence: result.data.confidence,
        language,
        blocks: result.data.blocks.map(block => ({
          text: block.text,
          confidence: block.confidence,
          bounds: block.bbox
        }))
      };

      // Estimate cost based on image processing
      const cost = 0.001; // Fixed cost per image
      const duration = Date.now() - startTime;

      await this.trackUsage(userId, AIFeature.HANDWRITING_OCR, 0, cost, duration, AIStatus.SUCCESS);

      return {
        result: ocrResult,
        tokens: 0,
        cost,
        duration
      };
    } catch (error: any) {
      logger.error('OCR failed:', error);
      await this.trackUsage(userId, AIFeature.HANDWRITING_OCR, 0, 0, Date.now() - startTime, AIStatus.FAILED, error.message);
      throw new AppError('OCR processing failed', 500);
    }
  }

  /**
   * Smart search using embeddings
   */
  async smartSearch(
    userId: string,
    query: string,
    documents: Array<{ id: string; content: string }>
  ): Promise<AIResponse<Array<{ id: string; score: number; highlight: string }>>> {
    const startTime = Date.now();

    try {
      // Generate embedding for query
      const queryEmbedding = await this.openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: query
      });

      const queryVector = queryEmbedding.data[0].embedding;

      // Generate embeddings for documents (in production, these should be pre-computed)
      const documentEmbeddings = await Promise.all(
        documents.map(async (doc) => {
          const embedding = await this.openai.embeddings.create({
            model: 'text-embedding-ada-002',
            input: doc.content
          });
          return {
            id: doc.id,
            content: doc.content,
            vector: embedding.data[0].embedding
          };
        })
      );

      // Calculate cosine similarity
      const results = documentEmbeddings.map(doc => ({
        id: doc.id,
        score: this.cosineSimilarity(queryVector, doc.vector),
        highlight: this.extractHighlight(doc.content, query)
      }));

      // Sort by relevance
      results.sort((a, b) => b.score - a.score);

      const tokens = queryEmbedding.usage.total_tokens + 
        documentEmbeddings.reduce((sum, _) => sum + 100, 0); // Estimate
      const cost = this.calculateCost(tokens, 'embedding');
      const duration = Date.now() - startTime;

      await this.trackUsage(userId, AIFeature.SMART_SEARCH, tokens, cost, duration, AIStatus.SUCCESS);

      return {
        result: results.slice(0, 10), // Top 10 results
        tokens,
        cost,
        duration
      };
    } catch (error: any) {
      logger.error('Smart search failed:', error);
      await this.trackUsage(userId, AIFeature.SMART_SEARCH, 0, 0, Date.now() - startTime, AIStatus.FAILED, error.message);
      throw new AppError('Smart search failed', 500);
    }
  }

  /**
   * Get user's AI usage statistics
   */
  async getUserUsageStats(userId: string, days: number = 30): Promise<{
    totalTokens: number;
    totalCost: number;
    byFeature: Record<string, { count: number; tokens: number; cost: number }>;
    dailyUsage: Array<{ date: string; tokens: number; cost: number }>;
  }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const usage = await this.prisma.aIUsage.findMany({
      where: {
        userId,
        createdAt: { gte: startDate }
      },
      orderBy: { createdAt: 'asc' }
    });

    const stats = {
      totalTokens: 0,
      totalCost: 0,
      byFeature: {} as Record<string, { count: number; tokens: number; cost: number }>,
      dailyUsage: [] as Array<{ date: string; tokens: number; cost: number }>
    };

    const dailyMap = new Map<string, { tokens: number; cost: number }>();

    usage.forEach(record => {
      stats.totalTokens += record.tokens;
      stats.totalCost += record.cost;

      // By feature
      if (!stats.byFeature[record.feature]) {
        stats.byFeature[record.feature] = { count: 0, tokens: 0, cost: 0 };
      }
      stats.byFeature[record.feature].count++;
      stats.byFeature[record.feature].tokens += record.tokens;
      stats.byFeature[record.feature].cost += record.cost;

      // Daily usage
      const date = record.createdAt.toISOString().split('T')[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { tokens: 0, cost: 0 });
      }
      const daily = dailyMap.get(date)!;
      daily.tokens += record.tokens;
      daily.cost += record.cost;
    });

    // Convert daily map to array
    stats.dailyUsage = Array.from(dailyMap.entries()).map(([date, data]) => ({
      date,
      ...data
    }));

    return stats;
  }

  /**
   * Helper: Calculate cost based on tokens and model
   */
  private calculateCost(tokens: number, model: string): number {
    const rates: Record<string, number> = {
      'gpt-4': 0.03,               // $0.03 per 1K tokens
      'gpt-4-turbo-preview': 0.01, // $0.01 per 1K tokens
      'gpt-3.5-turbo': 0.002,      // $0.002 per 1K tokens
      'embedding': 0.0001,          // $0.0001 per 1K tokens
      'whisper': 0.006              // $0.006 per minute
    };

    const rate = rates[model] || 0.002;
    return (tokens / 1000) * rate;
  }

  /**
   * Helper: Track AI usage
   */
  private async trackUsage(
    userId: string,
    feature: AIFeature,
    tokens: number,
    cost: number,
    duration: number,
    status: AIStatus,
    error?: string
  ): Promise<void> {
    try {
      await this.prisma.aIUsage.create({
        data: {
          userId,
          feature,
          tokens,
          cost,
          model: 'openai',
          requestData: {},
          responseData: {},
          duration,
          status,
          error
        }
      });
    } catch (err) {
      logger.error('Failed to track AI usage:', err);
    }
  }

  /**
   * Helper: Hash text for caching
   */
  private hashText(text: string): string {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(text).digest('hex');
  }

  /**
   * Helper: Calculate cosine similarity
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Helper: Extract highlight around query terms
   */
  private extractHighlight(content: string, query: string, contextLength: number = 150): string {
    const queryTerms = query.toLowerCase().split(/\s+/);
    const contentLower = content.toLowerCase();
    
    let bestPosition = 0;
    let maxMatches = 0;

    // Find position with most query terms
    for (let i = 0; i < content.length - contextLength; i++) {
      const window = contentLower.substring(i, i + contextLength);
      const matches = queryTerms.filter(term => window.includes(term)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestPosition = i;
      }
    }

    // Extract highlight
    const start = Math.max(0, bestPosition - 50);
    const end = Math.min(content.length, bestPosition + contextLength + 50);
    let highlight = content.substring(start, end);

    if (start > 0) highlight = '...' + highlight;
    if (end < content.length) highlight = highlight + '...';

    return highlight;
  }

  /**
   * Helper: Extract keywords locally using NLP
   */
  private extractKeywordsLocal(text: string): string[] {
    const tfidf = new natural.TfIdf();
    tfidf.addDocument(text);

    const keywords: Array<{ term: string; score: number }> = [];
    tfidf.listTerms(0).forEach((item: any) => {
      if (item.term.length > 3 && !this.isStopWord(item.term)) {
        keywords.push({ term: item.term, score: item.tfidf });
      }
    });

    // Sort by score and return top 10
    return keywords
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(k => k.term);
  }

  /**
   * Helper: Check if word is a stop word
   */
  private isStopWord(word: string): boolean {
    const stopWords = [
      'the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'as', 
      'are', 'been', 'by', 'for', 'from', 'has', 'had', 'have', 
      'in', 'of', 'or', 'that', 'to', 'was', 'were', 'will', 'with'
    ];
    return stopWords.includes(word.toLowerCase());
  }
}