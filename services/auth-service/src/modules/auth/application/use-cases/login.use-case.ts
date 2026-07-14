import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Role } from '@novadesk/shared';
import { AuditService } from '@infrastructure/auth/audit.service';
import { JwtService } from '@infrastructure/auth/jwt.service';
import { PasswordService } from '@infrastructure/auth/password.service';
import { RefreshTokenService } from '@infrastructure/auth/refresh-token.service';
import type { AuthTokensResponse, LoginDto } from '../dto/auth.dto';
import { USER_REPOSITORY, type UserRepositoryPort } from '../ports/user.repository.port';
import type { RequestMeta } from './register.use-case';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepositoryPort,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly auditService: AuditService,
  ) {}

  async execute(dto: LoginDto, meta: RequestMeta = {}): Promise<AuthTokensResponse> {
    const user = await this.users.findByEmail(dto.email.toLowerCase());

    if (!user?.isActive) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const valid = await this.passwordService.verify(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const profile = await this.users.findById(user.id);
    if (!profile) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const membership = dto.tenantId
      ? profile.memberships.find((entry) => entry.tenantId === dto.tenantId)
      : profile.memberships[0];

    const roles = membership
      ? ([membership.role] as Role[])
      : profile.memberships.map((entry) => entry.role);

    const accessToken = await this.jwtService.signAccessToken({
      sub: user.id,
      email: user.email,
      roles: roles.length > 0 ? roles : (['user'] as Role[]),
      tenantId: membership?.tenantId,
    });

    const refresh = await this.refreshTokenService.create(user.id);

    await this.auditService.log('auth.login', 'user', user.id, {
      userId: user.id,
      tenantId: membership?.tenantId,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return {
      accessToken,
      refreshToken: refresh.token,
      expiresIn: Math.floor(this.jwtService.getAccessTokenTtlMs() / 1000),
      tokenType: 'Bearer',
    };
  }
}
