import { Injectable, Logger } from '@nestjs/common';
import { ThrottlerStorage } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

interface ThrottlerStorageRecord {
  totalHits: number;
  timeToExpire: number;
  isBlocked: boolean;
  timeToBlockExpire: number;
}

@Injectable()
export class RedisThrottlerStorageService implements ThrottlerStorage {
  private redis: Redis | null = null;
  private readonly logger = new Logger(RedisThrottlerStorageService.name);
  private readonly inMemoryStorage = new Map<string, { hits: number; resetTime: number }>();

  constructor(private configService: ConfigService) {
    this.initializeRedis();
  }

  private initializeRedis() {
    try {
      const redisHost = this.configService.get('redis.host');
      const redisPort = this.configService.get('redis.port');
      
      if (!redisHost) {
        this.logger.warn('Redis host not configured, falling back to in-memory storage');
        return;
      }

      this.redis = new Redis({
        host: redisHost,
        port: redisPort,
        password: this.configService.get('redis.password'),
        maxRetriesPerRequest: 3,
        lazyConnect: true,
      });

      this.redis.on('error', (error) => {
        this.logger.error('Redis connection error, falling back to in-memory storage:', error.message);
        this.redis = null;
      });

      this.redis.on('connect', () => {
        this.logger.log('Redis connected successfully');
      });

    } catch (error) {
      this.logger.error('Failed to initialize Redis, using in-memory storage:', error.message);
      this.redis = null;
    }
  }

  async increment(
    key: string, 
    ttl: number, 
    limit: number, 
    blockDuration: number, 
    throttlerName: string
  ): Promise<ThrottlerStorageRecord> {
    if (this.redis) {
      try {
        const multi = this.redis.multi();
        multi.incr(key);
        multi.expire(key, Math.ceil(ttl / 1000)); // Convert ms to seconds for Redis
        const results = await multi.exec();
        
        if (!results || !results[0]) {
          throw new Error('Redis operation failed');
        }
        
        const totalHits = results[0][1] as number;
        const timeToExpire = await this.redis.ttl(key);
        const isBlocked = totalHits > limit;
        
        let timeToBlockExpire = 0;
        if (isBlocked && blockDuration > 0) {
          const blockKey = `${key}:block`;
          await this.redis.setex(blockKey, Math.ceil(blockDuration / 1000), '1');
          timeToBlockExpire = await this.redis.ttl(blockKey);
        }
        
        return { 
          totalHits, 
          timeToExpire: timeToExpire > 0 ? timeToExpire : 0, 
          isBlocked,
          timeToBlockExpire: timeToBlockExpire > 0 ? timeToBlockExpire : 0
        };
      } catch (error) {
        this.logger.error('Redis operation failed, falling back to in-memory storage:', error.message);
        this.redis = null;
        return this.incrementInMemory(key, ttl, limit, blockDuration);
      }
    }
    
    return this.incrementInMemory(key, ttl, limit, blockDuration);
  }

  private incrementInMemory(
    key: string, 
    ttl: number, 
    limit: number, 
    blockDuration: number
  ): ThrottlerStorageRecord {
    const now = Date.now();
    const resetTime = now + ttl;
    
    const existing = this.inMemoryStorage.get(key);
    
    if (!existing || now > existing.resetTime) {
      this.inMemoryStorage.set(key, { hits: 1, resetTime });
      return {
        totalHits: 1,
        timeToExpire: Math.ceil(ttl / 1000),
        isBlocked: false,
        timeToBlockExpire: 0
      };
    }
    
    existing.hits++;
    this.inMemoryStorage.set(key, existing);
    
    const isBlocked = existing.hits > limit;
    const timeToExpire = Math.ceil((existing.resetTime - now) / 1000);
    
    return {
      totalHits: existing.hits,
      timeToExpire: Math.max(0, timeToExpire),
      isBlocked,
      timeToBlockExpire: isBlocked ? Math.max(0, timeToExpire) : 0
    };
  }
}
