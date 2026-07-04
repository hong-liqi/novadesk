import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { buildAuthUser, verifyAccessToken } from '@portfolio/auth';
import type { AuthUser, JwtPayload } from '@portfolio/auth';

@Injectable()
export class JwtValidationService {
  constructor(private readonly configService: ConfigService) {}

  async validateToken(token: string): Promise<{ payload: JwtPayload; user: AuthUser }> {
    try {
      const payload = await verifyAccessToken(token, {
        issuer: this.configService.get<string>('JWT_ISSUER', 'portfolio-os-auth'),
        audience: this.configService.get<string>('JWT_AUDIENCE', 'portfolio-os'),
        jwksUrl: this.getJwksUrl(),
      });

      return {
        payload,
        user: buildAuthUser(payload),
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private getJwksUrl(): string {
    return (
      this.configService.get<string>('AUTH_JWKS_URL') ??
      `${this.configService.get<string>('AUTH_SERVICE_URL', 'http://localhost:3001')}/.well-known/jwks.json`
    );
  }
}
