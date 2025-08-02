import Redis from 'ioredis';
import { logger } from '../utils/logger';

export class RedisService {
  private static instance: RedisService;
  private client: Redis;
  private subscriber: Redis;
  private publisher: Redis;

  private constructor() {
    const redisConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0'),
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: false
    };

    // Main client for general operations
    this.client = new Redis(redisConfig);
    
    // Separate clients for pub/sub
    this.subscriber = new Redis(redisConfig);
    this.publisher = new Redis(redisConfig);

    // Set up event handlers
    this.setupEventHandlers();
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  private setupEventHandlers(): void {
    this.client.on('connect', () => {
      logger.info('Redis client connected');
    });

    this.client.on('error', (error) => {
      logger.error('Redis client error:', error);
    });

    this.client.on('close', () => {
      logger.warn('Redis client connection closed');
    });

    this.client.on('reconnecting', () => {
      logger.info('Redis client reconnecting...');
    });

    this.client.on('ready', () => {
      logger.info('Redis client ready');
    });
  }

  // Basic operations
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ...args: any[]): Promise<'OK'> {
    return this.client.set(key, value, ...args);
  }

  async del(...keys: string[]): Promise<number> {
    return this.client.del(...keys);
  }

  async exists(...keys: string[]): Promise<number> {
    return this.client.exists(...keys);
  }

  async expire(key: string, seconds: number): Promise<number> {
    return this.client.expire(key, seconds);
  }

  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  async decr(key: string): Promise<number> {
    return this.client.decr(key);
  }

  async incrby(key: string, increment: number): Promise<number> {
    return this.client.incrby(key, increment);
  }

  // Hash operations
  async hset(key: string, field: string, value: string): Promise<number> {
    return this.client.hset(key, field, value);
  }

  async hget(key: string, field: string): Promise<string | null> {
    return this.client.hget(key, field);
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    return this.client.hgetall(key);
  }

  async hdel(key: string, ...fields: string[]): Promise<number> {
    return this.client.hdel(key, ...fields);
  }

  async hincrby(key: string, field: string, increment: number): Promise<number> {
    return this.client.hincrby(key, field, increment);
  }

  // List operations
  async lpush(key: string, ...values: string[]): Promise<number> {
    return this.client.lpush(key, ...values);
  }

  async rpush(key: string, ...values: string[]): Promise<number> {
    return this.client.rpush(key, ...values);
  }

  async lpop(key: string): Promise<string | null> {
    return this.client.lpop(key);
  }

  async rpop(key: string): Promise<string | null> {
    return this.client.rpop(key);
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    return this.client.lrange(key, start, stop);
  }

  async llen(key: string): Promise<number> {
    return this.client.llen(key);
  }

  // Set operations
  async sadd(key: string, ...members: string[]): Promise<number> {
    return this.client.sadd(key, ...members);
  }

  async srem(key: string, ...members: string[]): Promise<number> {
    return this.client.srem(key, ...members);
  }

  async smembers(key: string): Promise<string[]> {
    return this.client.smembers(key);
  }

  async sismember(key: string, member: string): Promise<number> {
    return this.client.sismember(key, member);
  }

  async scard(key: string): Promise<number> {
    return this.client.scard(key);
  }

  // Sorted set operations
  async zadd(key: string, ...args: (string | number)[]): Promise<number> {
    return this.client.zadd(key, ...args);
  }

  async zrem(key: string, ...members: string[]): Promise<number> {
    return this.client.zrem(key, ...members);
  }

  async zrange(key: string, start: number, stop: number, withScores?: boolean): Promise<string[]> {
    if (withScores) {
      return this.client.zrange(key, start, stop, 'WITHSCORES');
    }
    return this.client.zrange(key, start, stop);
  }

  async zrevrange(key: string, start: number, stop: number, withScores?: boolean): Promise<string[]> {
    if (withScores) {
      return this.client.zrevrange(key, start, stop, 'WITHSCORES');
    }
    return this.client.zrevrange(key, start, stop);
  }

  async zcard(key: string): Promise<number> {
    return this.client.zcard(key);
  }

  async zscore(key: string, member: string): Promise<string | null> {
    return this.client.zscore(key, member);
  }

  // Pattern operations
  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }

  async scan(cursor: string, match?: string, count?: number): Promise<[string, string[]]> {
    const args: any[] = [cursor];
    if (match) {
      args.push('MATCH', match);
    }
    if (count) {
      args.push('COUNT', count);
    }
    return this.client.scan(...args);
  }

  // Pub/Sub operations
  async publish(channel: string, message: string): Promise<number> {
    return this.publisher.publish(channel, message);
  }

  async subscribe(channel: string, handler: (message: string) => void): Promise<void> {
    await this.subscriber.subscribe(channel);
    this.subscriber.on('message', (receivedChannel, message) => {
      if (receivedChannel === channel) {
        handler(message);
      }
    });
  }

  async unsubscribe(channel: string): Promise<void> {
    await this.subscriber.unsubscribe(channel);
  }

  // Transaction operations
  multi(): any {
    return this.client.multi();
  }

  // Pipeline operations
  pipeline(): any {
    return this.client.pipeline();
  }

  // Cache helpers
  async getJSON<T>(key: string): Promise<T | null> {
    const value = await this.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch (error) {
      logger.error(`Failed to parse JSON for key ${key}:`, error);
      return null;
    }
  }

  async setJSON(key: string, value: any, ttl?: number): Promise<'OK'> {
    const json = JSON.stringify(value);
    if (ttl) {
      return this.set(key, json, 'EX', ttl);
    }
    return this.set(key, json);
  }

  // Cache with function
  async cacheGet<T>(
    key: string,
    fn: () => Promise<T>,
    ttl: number = 300
  ): Promise<T> {
    const cached = await this.getJSON<T>(key);
    if (cached !== null) {
      return cached;
    }

    const result = await fn();
    await this.setJSON(key, result, ttl);
    return result;
  }

  // Clean up
  async disconnect(): Promise<void> {
    await Promise.all([
      this.client.quit(),
      this.subscriber.quit(),
      this.publisher.quit()
    ]);
    logger.info('Redis connections closed');
  }

  // Get raw client for advanced operations
  getClient(): Redis {
    return this.client;
  }
}