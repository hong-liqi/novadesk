import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SignJWT, exportJWK, jwtVerify, type JWK, type KeyLike } from 'jose';
import { createPrivateKey, createPublicKey } from 'node:crypto';
import { randomUUID } from 'node:crypto';
import type { JwtPayload } from '@portfolio/auth';
import type { Role } from '@portfolio/shared';
import { normalizePemKey } from '../../shared/lib/normalize-key';
import { parseDuration } from '../../shared/lib/parse-duration';

export interface AccessTokenClaims {
  sub: string;
  email: string;
  roles: Role[];
  tenantId?: string;
  permissions?: string[];
  scope?: string[];
}

@Injectable()
export class JwtService implements OnModuleInit {
  private privateKey!: KeyLike;
  private publicKey!: KeyLike;
  private kid!: string;
  private issuer!: string;
  private audience!: string;
  private accessTokenTtlMs!: number;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    const privateKeyPem = this.configService.get<string>('JWT_PRIVATE_KEY');
    const publicKeyPem = this.configService.get<string>('JWT_PUBLIC_KEY');

    if (!privateKeyPem || !publicKeyPem) {
      throw new Error('JWT_PRIVATE_KEY and JWT_PUBLIC_KEY must be configured');
    }

    this.privateKey = createPrivateKey(normalizePemKey(privateKeyPem));
    this.publicKey = createPublicKey(normalizePemKey(publicKeyPem));
    this.kid = this.configService.get<string>('JWT_KID', 'portfolio-auth-dev-1');
    this.issuer = this.configService.get<string>('JWT_ISSUER', 'portfolio-os-auth');
    this.audience = this.configService.get<string>('JWT_AUDIENCE', 'portfolio-os');
    this.accessTokenTtlMs = parseDuration(
      this.configService.get<string>('ACCESS_TOKEN_TTL', '15m'),
    );
  }

  async signAccessToken(claims: AccessTokenClaims): Promise<string> {
    const jti = randomUUID();
    const now = Math.floor(Date.now() / 1000);
    const exp = now + Math.floor(this.accessTokenTtlMs / 1000);

    return new SignJWT({
      email: claims.email,
      roles: claims.roles,
      tenantId: claims.tenantId,
      permissions: claims.permissions,
      scope: claims.scope,
    })
      .setProtectedHeader({ alg: 'RS256', kid: this.kid })
      .setSubject(claims.sub)
      .setIssuer(this.issuer)
      .setAudience(this.audience)
      .setIssuedAt(now)
      .setExpirationTime(exp)
      .setJti(jti)
      .sign(this.privateKey);
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    const { payload } = await jwtVerify(token, this.publicKey, {
      issuer: this.issuer,
      audience: this.audience,
    });

    return {
      sub: payload.sub ?? '',
      email: typeof payload.email === 'string' ? payload.email : '',
      roles: Array.isArray(payload.roles) ? (payload.roles as Role[]) : [],
      permissions: payload.permissions as string[] | undefined,
      tenantId: payload.tenantId as string | undefined,
      scope: payload.scope as string[] | undefined,
      iss: payload.iss,
      aud: payload.aud,
      iat: payload.iat ?? 0,
      exp: payload.exp ?? 0,
      jti: payload.jti ?? '',
    };
  }

  async getJwks(): Promise<{ keys: JWK[] }> {
    const jwk = await exportJWK(this.publicKey);
    return {
      keys: [
        {
          ...jwk,
          kid: this.kid,
          use: 'sig',
          alg: 'RS256',
        },
      ],
    };
  }

  getAccessTokenTtlMs(): number {
    return this.accessTokenTtlMs;
  }
}
