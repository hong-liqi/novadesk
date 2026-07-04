import { Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicator, type HealthIndicatorResult } from '@nestjs/terminus';
import Redis from 'ioredis';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  async isHealthy(key: string, redisUrl?: string): Promise<HealthIndicatorResult> {
    if (!redisUrl) {
      return this.getStatus(key, true, { message: 'REDIS_URL not configured' });
    }

    const redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      connectTimeout: 3000,
      lazyConnect: true,
    });

    try {
      await redis.connect();
      await redis.ping();
      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError(
        'Redis check failed',
        this.getStatus(key, false, { error: String(error) }),
      );
    } finally {
      redis.disconnect();
    }
  }
}
