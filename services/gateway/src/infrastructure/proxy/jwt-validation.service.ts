import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { buildAuthUser } from '@portfolio/auth';
import type { AuthUser, JwtPayload } from '@portfolio/auth';

@Injectable()
export class JwtValidationService {
  private jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

  constructor(private readonly configService: ConfigService) {}

  async validateToken(token: string): Promise<{ payload: JwtPayload; user: AuthUser }> {
    try {
      const { payload } = await jwtVerify(token, this.getJwks(), {
        issuer: this.configService.get<string>('JWT_ISSUER', 'portfolio-os-auth'),
        audience: this.configService.get<string>('JWT_AUDIENCE', 'portfolio-os'),
      });

      const jwtPayload = payload as unknown as JwtPayload;
      return {
        payload: jwtPayload,
        user: buildAuthUser(jwtPayload),
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private getJwks(): ReturnType<typeof createRemoteJWKSet> {
    if (!this.jwks) {
      const jwksUrl =
        this.configService.get<string>('AUTH_JWKS_URL') ??
        `${this.configService.get<string>('AUTH_SERVICE_URL', 'http://localhost:3001')}/.well-known/jwks.json`;
      this.jwks = createRemoteJWKSet(new URL(jwksUrl));
    }

    return this.jwks;
  }
}
