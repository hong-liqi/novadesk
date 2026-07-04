import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { RedisService } from '@infrastructure/redis/redis.service';
import { generateFamilyId, generateOpaqueToken, hashToken } from '../../shared/lib/hash-token';
import { parseDuration } from '../../shared/lib/parse-duration';

export interface RefreshTokenSession {
  token: string;
  userId: string;
  familyId: string;
  expiresAt: Date;
}

interface StoredRefreshToken {
  userId: string;
  familyId: string;
  expiresAt: string;
}

@Injectable()
export class RefreshTokenService {
  private readonly refreshTtlMs: number;

  constructor(
    private readonly redisService: RedisService,
    private readonly prisma: PrismaService,
    configService: ConfigService,
  ) {
    this.refreshTtlMs = parseDuration(configService.get<string>('REFRESH_TOKEN_TTL', '7d'));
  }

  async create(userId: string, familyId?: string): Promise<RefreshTokenSession> {
    const token = generateOpaqueToken();
    const resolvedFamilyId = familyId ?? generateFamilyId();
    const expiresAt = new Date(Date.now() + this.refreshTtlMs);
    const tokenHash = hashToken(token);

    await this.storeInRedis(tokenHash, {
      userId,
      familyId: resolvedFamilyId,
      expiresAt: expiresAt.toISOString(),
    });

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        familyId: resolvedFamilyId,
        expiresAt,
      },
    });

    return { token, userId, familyId: resolvedFamilyId, expiresAt };
  }

  async rotate(refreshToken: string): Promise<RefreshTokenSession> {
    const tokenHash = hashToken(refreshToken);
    const usedKey = this.usedKey(tokenHash);

    const wasUsed = await this.redisService.getClient().get(usedKey);
    if (wasUsed) {
      const familyId = await this.resolveFamilyId(tokenHash);
      if (familyId) {
        await this.revokeFamily(familyId);
      }
      throw new UnauthorizedException('Refresh token reuse detected');
    }

    const stored = await this.getFromRedis(tokenHash);
    if (!stored) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (new Date(stored.expiresAt) <= new Date()) {
      await this.revokeToken(tokenHash, stored.familyId);
      throw new UnauthorizedException('Refresh token expired');
    }

    await this.markUsed(tokenHash);
    await this.revokeToken(tokenHash, stored.familyId, false);

    return this.create(stored.userId, stored.familyId);
  }

  async revoke(refreshToken: string): Promise<void> {
    const tokenHash = hashToken(refreshToken);
    const stored = await this.getFromRedis(tokenHash);

    if (stored) {
      await this.revokeToken(tokenHash, stored.familyId);
      return;
    }

    const record = await this.prisma.refreshToken.findFirst({
      where: { tokenHash, revokedAt: null },
    });

    if (record) {
      await this.revokeToken(tokenHash, record.familyId);
    }
  }

  async revokeAllForUser(userId: string): Promise<void> {
    const tokens = await this.prisma.refreshToken.findMany({
      where: { userId, revokedAt: null },
    });

    await Promise.all(tokens.map((record) => this.revokeToken(record.tokenHash, record.familyId)));
  }

  private async revokeFamily(familyId: string): Promise<void> {
    const tokens = await this.prisma.refreshToken.findMany({
      where: { familyId, revokedAt: null },
    });

    await Promise.all(tokens.map((record) => this.revokeToken(record.tokenHash, record.familyId)));
  }

  private async revokeToken(tokenHash: string, familyId: string, markUsed = true): Promise<void> {
    await this.redisService.getClient().del(this.activeKey(tokenHash));

    if (markUsed) {
      await this.markUsed(tokenHash);
    }

    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, familyId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private async storeInRedis(tokenHash: string, data: StoredRefreshToken): Promise<void> {
    const ttlSeconds = Math.ceil(this.refreshTtlMs / 1000);
    await this.redisService
      .getClient()
      .set(this.activeKey(tokenHash), JSON.stringify(data), 'EX', ttlSeconds);
  }

  private async getFromRedis(tokenHash: string): Promise<StoredRefreshToken | null> {
    const raw = await this.redisService.getClient().get(this.activeKey(tokenHash));
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as StoredRefreshToken;
  }

  private async markUsed(tokenHash: string): Promise<void> {
    const ttlSeconds = Math.ceil(this.refreshTtlMs / 1000);
    await this.redisService.getClient().set(this.usedKey(tokenHash), '1', 'EX', ttlSeconds);
  }

  private async resolveFamilyId(tokenHash: string): Promise<string | null> {
    const record = await this.prisma.refreshToken.findFirst({
      where: { tokenHash },
      select: { familyId: true },
    });

    return record?.familyId ?? null;
  }

  private activeKey(tokenHash: string): string {
    return `refresh:${tokenHash}`;
  }

  private usedKey(tokenHash: string): string {
    return `refresh:used:${tokenHash}`;
  }
}
