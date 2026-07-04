import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { NextFunction, Request, Response } from 'express';

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

@Injectable()
export class GatewayThrottlerMiddleware implements NestMiddleware {
  private readonly buckets = new Map<string, RateLimitBucket>();
  private readonly ttlMs: number;
  private readonly limit: number;

  constructor(private readonly configService: ConfigService) {
    this.ttlMs = this.configService.get<number>('THROTTLE_TTL', 60_000);
    this.limit = this.configService.get<number>('THROTTLE_LIMIT', 100);
  }

  use(request: Request, response: Response, next: NextFunction): void {
    const key = this.resolveKey(request);
    const now = Date.now();
    const bucket = this.buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      this.buckets.set(key, {
        count: 1,
        resetAt: now + this.ttlMs,
      });
      this.setRateLimitHeaders(response, this.limit - 1, now + this.ttlMs);
      next();
      return;
    }

    if (bucket.count >= this.limit) {
      this.setRateLimitHeaders(response, 0, bucket.resetAt);
      response.status(429).json({
        statusCode: 429,
        message: 'Too Many Requests',
      });
      return;
    }

    bucket.count += 1;
    this.setRateLimitHeaders(response, this.limit - bucket.count, bucket.resetAt);
    next();
  }

  private resolveKey(request: Request): string {
    const forwarded = request.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.length > 0) {
      return forwarded.split(',')[0]?.trim() ?? request.ip ?? 'unknown';
    }

    return request.ip ?? 'unknown';
  }

  private setRateLimitHeaders(response: Response, remaining: number, resetAt: number): void {
    response.setHeader('X-RateLimit-Limit', String(this.limit));
    response.setHeader('X-RateLimit-Remaining', String(Math.max(remaining, 0)));
    response.setHeader('X-RateLimit-Reset', String(Math.ceil(resetAt / 1000)));
  }
}
