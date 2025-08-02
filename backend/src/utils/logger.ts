import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  })
);

// Create Winston logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'atlas-core-sid' },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production' ? logFormat : consoleFormat
    }),
    
    // File transport for all logs
    new winston.transports.File({
      filename: path.join(logsDir, 'app.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 5
    }),
    
    // File transport for errors
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5
    })
  ],
  
  // Handle exceptions and rejections
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log')
    })
  ],
  
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log')
    })
  ]
});

// Add request ID to logs
export const addRequestId = (requestId: string) => {
  return logger.child({ requestId });
};

// Log levels:
// error: 0
// warn: 1
// info: 2
// http: 3
// verbose: 4
// debug: 5
// silly: 6

// Convenience methods
export const logError = (error: Error, context?: any) => {
  logger.error({
    message: error.message,
    stack: error.stack,
    ...context
  });
};

export const logWarning = (message: string, context?: any) => {
  logger.warn({
    message,
    ...context
  });
};

export const logInfo = (message: string, context?: any) => {
  logger.info({
    message,
    ...context
  });
};

export const logDebug = (message: string, context?: any) => {
  logger.debug({
    message,
    ...context
  });
};

export const logHttp = (req: any, res: any, responseTime: number) => {
  logger.http({
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    responseTime: `${responseTime}ms`,
    userAgent: req.headers['user-agent'],
    ip: req.ip || req.connection.remoteAddress,
    userId: req.user?.userId
  });
};