import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { authMiddleware } from './middleware/auth';

// Import routes
import authRoutes from './routes/auth.routes';
import notesRoutes from './routes/notes.routes';
import aiRoutes from './routes/ai.routes';
import filesRoutes from './routes/files.routes';
import collaborationRoutes from './routes/collaboration.routes';
import generatorRoutes from './routes/generator.routes';

// Import services
import { DatabaseService } from './services/database.service';
import { RedisService } from './services/redis.service';
import { SocketService } from './services/socket.service';
import { logger } from './utils/logger';

class Server {
  private app: Express;
  private httpServer: any;
  private io: Server;
  private port: number;

  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new Server(this.httpServer, {
      cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true
      }
    });
    this.port = parseInt(process.env.PORT || '3001');
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await DatabaseService.connect();
      logger.info('Database connected successfully');
    } catch (error) {
      logger.error('Database connection failed:', error);
      process.exit(1);
    }
  }

  private async initializeRedis(): Promise<void> {
    try {
      await RedisService.connect();
      logger.info('Redis connected successfully');
    } catch (error) {
      logger.error('Redis connection failed:', error);
      process.exit(1);
    }
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "wss:", "https:"]
        }
      }
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));

    // Compression
    this.app.use(compression());

    // Body parsing
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
      message: 'Too many requests from this IP, please try again later.'
    });
    this.app.use('/api/', limiter);

    // Request logging
    this.app.use(requestLogger);

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
      });
    });
  }

  private setupRoutes(): void {
    const apiPrefix = `/api/${process.env.API_VERSION || 'v1'}`;

    // Public routes
    this.app.use(`${apiPrefix}/auth`, authRoutes);

    // Protected routes
    this.app.use(`${apiPrefix}/notes`, authMiddleware, notesRoutes);
    this.app.use(`${apiPrefix}/ai`, authMiddleware, aiRoutes);
    this.app.use(`${apiPrefix}/files`, authMiddleware, filesRoutes);
    this.app.use(`${apiPrefix}/collaboration`, authMiddleware, collaborationRoutes);
    this.app.use(`${apiPrefix}/generator`, authMiddleware, generatorRoutes);

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource does not exist'
      });
    });

    // Error handling middleware (must be last)
    this.app.use(errorHandler);
  }

  private setupSocketIO(): void {
    SocketService.initialize(this.io);
    logger.info('Socket.IO initialized');
  }

  private setupGracefulShutdown(): void {
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);
      
      // Stop accepting new connections
      this.httpServer.close(() => {
        logger.info('HTTP server closed');
      });

      // Close database connections
      await DatabaseService.disconnect();
      logger.info('Database disconnected');

      // Close Redis connection
      await RedisService.disconnect();
      logger.info('Redis disconnected');

      // Exit process
      process.exit(0);
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });
  }

  public async start(): Promise<void> {
    try {
      // Initialize services
      await this.initializeDatabase();
      await this.initializeRedis();

      // Setup Express
      this.setupMiddleware();
      this.setupRoutes();

      // Setup Socket.IO
      this.setupSocketIO();

      // Setup graceful shutdown
      this.setupGracefulShutdown();

      // Start server
      this.httpServer.listen(this.port, () => {
        logger.info(`🚀 Server running on http://localhost:${this.port}`);
        logger.info(`📝 API Documentation: http://localhost:${this.port}/api-docs`);
        logger.info(`🌍 Environment: ${process.env.NODE_ENV}`);
      });
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

// Start the server
const server = new Server();
server.start();