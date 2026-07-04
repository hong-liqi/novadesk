import type { Role } from '@portfolio/shared';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: Role[];
  permissions?: string[];
  tenantId?: string;
  scope?: string[];
  aud?: string | string[];
  iss?: string;
  iat: number;
  exp: number;
  jti: string;
}

export interface AuthUser {
  id: string;
  email: string;
  roles: Role[];
  permissions?: string[];
  tenantId?: string;
}

export interface AuthStrategyConfig {
  issuer: string;
  audience: string;
  jwksUrl?: string;
  accessTokenTtl?: string;
  refreshTokenTtl?: string;
}

export interface RefreshTokenRecord {
  tokenId: string;
  userId: string;
  fingerprint?: string;
  expiresAt: string;
  revokedAt?: string;
}

export interface AuthRequest {
  headers: Record<string, string | string[] | undefined>;
  user?: AuthUser;
}
