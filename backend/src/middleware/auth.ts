import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { RedisService } from '../services/redis.service';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    username: string;
  };
  session?: any;
}

const prisma = new PrismaClient();
const redis = RedisService.getInstance();

/**
 * Verify JWT token and attach user to request
 */
export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Check if token is blacklisted
    const isBlacklisted = await redis.get(`blacklist:${token}`);
    if (isBlacklisted) {
      throw new AppError('Token has been revoked', 401);
    }

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new AppError('Token has expired', 401);
      }
      throw new AppError('Invalid token', 401);
    }

    // Check if session exists
    const session = await prisma.session.findFirst({
      where: {
        token,
        userId: decoded.userId,
        expiresAt: { gt: new Date() }
      }
    });

    if (!session) {
      throw new AppError('Session not found or expired', 401);
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        isActive: true,
        isEmailVerified: true
      }
    });

    if (!user || !user.isActive) {
      throw new AppError('User not found or inactive', 401);
    }

    // Update session last activity
    await prisma.session.update({
      where: { id: session.id },
      data: { lastActivityAt: new Date() }
    });

    // Attach user to request
    req.user = {
      userId: user.id,
      email: user.email,
      username: user.username
    };
    req.session = session;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        error: error.message
      });
    } else {
      logger.error('Auth middleware error:', error);
      res.status(500).json({
        error: 'Authentication failed'
      });
    }
  }
};

/**
 * Optional auth middleware - doesn't fail if no token
 */
export const optionalAuthMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);

    // Check if token is blacklisted
    const isBlacklisted = await redis.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return next();
    }

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return next();
    }

    // Check if session exists
    const session = await prisma.session.findFirst({
      where: {
        token,
        userId: decoded.userId,
        expiresAt: { gt: new Date() }
      }
    });

    if (!session) {
      return next();
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        isActive: true
      }
    });

    if (user && user.isActive) {
      req.user = {
        userId: user.id,
        email: user.email,
        username: user.username
      };
      req.session = session;
    }

    next();
  } catch (error) {
    logger.error('Optional auth middleware error:', error);
    next();
  }
};

/**
 * Require email verification
 */
export const requireEmailVerification = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { isEmailVerified: true }
    });

    if (!user || !user.isEmailVerified) {
      throw new AppError('Email verification required', 403);
    }

    next();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        error: error.message
      });
    } else {
      res.status(500).json({
        error: 'Verification check failed'
      });
    }
  }
};

/**
 * Check user permissions for a resource
 */
export const checkPermission = (resource: string, action: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      // Get user with subscription
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        include: {
          subscription: true
        }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Check subscription-based permissions
      const hasPermission = await checkResourcePermission(
        user,
        resource,
        action
      );

      if (!hasPermission) {
        throw new AppError('Insufficient permissions', 403);
      }

      next();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          error: error.message
        });
      } else {
        res.status(500).json({
          error: 'Permission check failed'
        });
      }
    }
  };
};

/**
 * Rate limiting by user
 */
export const userRateLimit = (limit: number, window: number) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        return next();
      }

      const key = `rate-limit:${req.user.userId}:${req.path}`;
      const current = await redis.incr(key);

      if (current === 1) {
        await redis.expire(key, window);
      }

      if (current > limit) {
        throw new AppError(`Rate limit exceeded. Try again in ${window} seconds.`, 429);
      }

      res.setHeader('X-RateLimit-Limit', limit.toString());
      res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - current).toString());
      res.setHeader('X-RateLimit-Reset', new Date(Date.now() + window * 1000).toISOString());

      next();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          error: error.message
        });
      } else {
        next();
      }
    }
  };
};

/**
 * Helper: Check resource permissions based on subscription
 */
async function checkResourcePermission(
  user: any,
  resource: string,
  action: string
): Promise<boolean> {
  // Define permission rules based on subscription plans
  const permissions: Record<string, Record<string, string[]>> = {
    FREE: {
      notes: ['create', 'read', 'update', 'delete'],
      ai: ['basic'],
      files: ['upload:small'],
      collaboration: []
    },
    BASIC: {
      notes: ['create', 'read', 'update', 'delete', 'share'],
      ai: ['basic', 'summary', 'keywords'],
      files: ['upload:medium'],
      collaboration: ['view']
    },
    PRO: {
      notes: ['create', 'read', 'update', 'delete', 'share', 'export'],
      ai: ['all'],
      files: ['upload:large'],
      collaboration: ['view', 'edit']
    },
    ENTERPRISE: {
      notes: ['all'],
      ai: ['all'],
      files: ['all'],
      collaboration: ['all']
    }
  };

  const plan = user.subscription?.plan || 'FREE';
  const planPermissions = permissions[plan];

  if (!planPermissions) {
    return false;
  }

  const resourcePermissions = planPermissions[resource];
  if (!resourcePermissions) {
    return false;
  }

  return resourcePermissions.includes(action) || resourcePermissions.includes('all');
}