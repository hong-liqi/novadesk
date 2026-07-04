import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Role } from '@portfolio/shared';
import { JwtService } from '@infrastructure/auth/jwt.service';
import { RefreshTokenService } from '@infrastructure/auth/refresh-token.service';
import type { AuthTokensResponse, RefreshDto } from '../dto/auth.dto';
import { USER_REPOSITORY, type UserRepositoryPort } from '../ports/user.repository.port';

@Injectable()
export class RefreshUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepositoryPort,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async execute(dto: RefreshDto): Promise<AuthTokensResponse> {
    if (!dto.refreshToken) {
      throw new UnauthorizedException('Refresh token required');
    }

    const session = await this.refreshTokenService.rotate(dto.refreshToken);
    const profile = await this.users.findById(session.userId);

    const primary = profile?.memberships[0];
    const roles = primary
      ? ([primary.role] as Role[])
      : (profile?.memberships.map((entry) => entry.role) ?? ['user']);

    const accessToken = await this.jwtService.signAccessToken({
      sub: session.userId,
      email: profile?.email ?? '',
      roles,
      tenantId: primary?.tenantId,
    });

    return {
      accessToken,
      refreshToken: session.token,
      expiresIn: Math.floor(this.jwtService.getAccessTokenTtlMs() / 1000),
      tokenType: 'Bearer',
    };
  }
}
