import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from '../redis.service';
import { EmailService } from '../email.service';
import { logger } from '../../utils/logger';
import { AppError } from '../../utils/errors';

interface RegisterInput {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface LoginInput {
  emailOrUsername: string;
  password: string;
  deviceInfo?: any;
  ipAddress?: string;
}

interface TokenPayload {
  userId: string;
  email: string;
  username: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class AuthService {
  private prisma: PrismaClient;
  private redis: RedisService;
  private emailService: EmailService;

  constructor() {
    this.prisma = new PrismaClient();
    this.redis = RedisService.getInstance();
    this.emailService = new EmailService();
  }

  /**
   * Register a new user
   */
  async register(input: RegisterInput): Promise<{ user: User; tokens: AuthTokens }> {
    const { email, username, password, firstName, lastName } = input;

    // Validate inputs
    this.validateEmail(email);
    this.validateUsername(username);
    this.validatePassword(password);

    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        throw new AppError('Email already registered', 409);
      }
      throw new AppError('Username already taken', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS || '10'));

    // Create user with profile and settings
    const user = await this.prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        profile: {
          create: {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }
        },
        settings: {
          create: {}
        }
      },
      include: {
        profile: true,
        settings: true
      }
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Send welcome email
    await this.emailService.sendWelcomeEmail(user.email, user.firstName || user.username);

    // Send verification email
    await this.sendVerificationEmail(user);

    logger.info(`New user registered: ${user.email}`);

    return { user, tokens };
  }

  /**
   * Login user
   */
  async login(input: LoginInput): Promise<{ user: User; tokens: AuthTokens }> {
    const { emailOrUsername, password, deviceInfo, ipAddress } = input;

    // Find user by email or username
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername.toLowerCase() },
          { username: emailOrUsername.toLowerCase() }
        ],
        isActive: true
      },
      include: {
        profile: true,
        settings: true,
        subscription: true
      }
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Create session
    await this.createSession(user.id, tokens, deviceInfo, ipAddress);

    logger.info(`User logged in: ${user.email}`);

    return { user, tokens };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as TokenPayload;

      // Check if token exists in database
      const session = await this.prisma.session.findFirst({
        where: {
          refreshToken,
          userId: decoded.userId,
          expiresAt: { gt: new Date() }
        }
      });

      if (!session) {
        throw new AppError('Invalid refresh token', 401);
      }

      // Get user
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user || !user.isActive) {
        throw new AppError('User not found or inactive', 401);
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user);

      // Update session
      await this.prisma.session.update({
        where: { id: session.id },
        data: {
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          lastActivityAt: new Date()
        }
      });

      return tokens;
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  /**
   * Logout user
   */
  async logout(token: string): Promise<void> {
    // Find and delete session
    const session = await this.prisma.session.findFirst({
      where: { token }
    });

    if (session) {
      await this.prisma.session.delete({
        where: { id: session.id }
      });

      // Add token to blacklist in Redis
      await this.redis.set(
        `blacklist:${token}`,
        'true',
        'EX',
        60 * 60 * 24 // 24 hours
      );
    }

    logger.info('User logged out');
  }

  /**
   * Change password
   */
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    // Get user
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid current password', 401);
    }

    // Validate new password
    this.validatePassword(newPassword);

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      parseInt(process.env.BCRYPT_ROUNDS || '10')
    );

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    // Invalidate all sessions
    await this.prisma.session.deleteMany({
      where: { userId }
    });

    // Send notification email
    await this.emailService.sendPasswordChangedEmail(user.email);

    logger.info(`Password changed for user: ${user.email}`);
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      // Don't reveal if email exists
      return;
    }

    // Generate reset token
    const resetToken = uuidv4();
    const hashedToken = await bcrypt.hash(resetToken, 10);

    // Store token in Redis with 1 hour expiry
    await this.redis.set(
      `password-reset:${user.id}`,
      hashedToken,
      'EX',
      3600
    );

    // Send email
    await this.emailService.sendPasswordResetEmail(user.email, resetToken);

    logger.info(`Password reset email sent to: ${user.email}`);
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Find user by token
    const keys = await this.redis.keys('password-reset:*');
    let userId: string | null = null;

    for (const key of keys) {
      const hashedToken = await this.redis.get(key);
      if (hashedToken && await bcrypt.compare(token, hashedToken)) {
        userId = key.replace('password-reset:', '');
        break;
      }
    }

    if (!userId) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    // Get user
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Validate new password
    this.validatePassword(newPassword);

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      parseInt(process.env.BCRYPT_ROUNDS || '10')
    );

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    // Delete reset token
    await this.redis.del(`password-reset:${userId}`);

    // Invalidate all sessions
    await this.prisma.session.deleteMany({
      where: { userId }
    });

    // Send confirmation email
    await this.emailService.sendPasswordResetConfirmationEmail(user.email);

    logger.info(`Password reset for user: ${user.email}`);
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<void> {
    // Find user by token
    const keys = await this.redis.keys('email-verify:*');
    let userId: string | null = null;

    for (const key of keys) {
      const storedToken = await this.redis.get(key);
      if (storedToken === token) {
        userId = key.replace('email-verify:', '');
        break;
      }
    }

    if (!userId) {
      throw new AppError('Invalid or expired verification token', 400);
    }

    // Update user
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isEmailVerified: true,
        emailVerifiedAt: new Date()
      }
    });

    // Delete verification token
    await this.redis.del(`email-verify:${userId}`);

    logger.info(`Email verified for user ID: ${userId}`);
  }

  /**
   * Send verification email
   */
  async sendVerificationEmail(user: User): Promise<void> {
    // Generate verification token
    const verificationToken = uuidv4();

    // Store token in Redis with 24 hour expiry
    await this.redis.set(
      `email-verify:${user.id}`,
      verificationToken,
      'EX',
      86400
    );

    // Send email
    await this.emailService.sendVerificationEmail(user.email, verificationToken);
  }

  /**
   * Generate JWT tokens
   */
  private async generateTokens(user: User): Promise<AuthTokens> {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      username: user.username
    };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 900 // 15 minutes in seconds
    };
  }

  /**
   * Create user session
   */
  private async createSession(
    userId: string,
    tokens: AuthTokens,
    deviceInfo?: any,
    ipAddress?: string
  ): Promise<void> {
    await this.prisma.session.create({
      data: {
        userId,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        deviceInfo,
        ipAddress,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });
  }

  /**
   * Validate email format
   */
  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError('Invalid email format', 400);
    }
  }

  /**
   * Validate username format
   */
  private validateUsername(username: string): void {
    if (username.length < 3) {
      throw new AppError('Username must be at least 3 characters long', 400);
    }
    if (username.length > 30) {
      throw new AppError('Username must be less than 30 characters', 400);
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      throw new AppError('Username can only contain letters, numbers, underscores, and hyphens', 400);
    }
  }

  /**
   * Validate password strength
   */
  private validatePassword(password: string): void {
    if (password.length < 8) {
      throw new AppError('Password must be at least 8 characters long', 400);
    }
    if (!/(?=.*[a-z])/.test(password)) {
      throw new AppError('Password must contain at least one lowercase letter', 400);
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      throw new AppError('Password must contain at least one uppercase letter', 400);
    }
    if (!/(?=.*\d)/.test(password)) {
      throw new AppError('Password must contain at least one number', 400);
    }
  }
}