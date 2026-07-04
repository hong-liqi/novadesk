import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common';
import type { Role } from '@portfolio/shared';
import { AuditService } from '@infrastructure/auth/audit.service';
import { JwtService } from '@infrastructure/auth/jwt.service';
import { PasswordService } from '@infrastructure/auth/password.service';
import { RefreshTokenService } from '@infrastructure/auth/refresh-token.service';
import { validatePassword } from '../../../../shared/lib/validate-password';
import type { AuthTokensResponse, RegisterDto } from '../dto/auth.dto';
import { USER_REPOSITORY, type UserRepositoryPort } from '../ports/user.repository.port';

export interface RequestMeta {
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepositoryPort,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly auditService: AuditService,
  ) {}

  async execute(dto: RegisterDto, meta: RequestMeta = {}): Promise<AuthTokensResponse> {
    try {
      validatePassword(dto.password);
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'Invalid password');
    }

    if (await this.users.emailExists(dto.email)) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await this.passwordService.hash(dto.password);
    const user = await this.users.create({
      email: dto.email.toLowerCase(),
      passwordHash,
      name: dto.name,
      tenantId: undefined,
      role: 'user',
    });

    const primaryTenant = user.memberships[0];
    const roles = primaryTenant ? [primaryTenant.role] : (['user'] as Role[]);

    const accessToken = await this.jwtService.signAccessToken({
      sub: user.id,
      email: user.email,
      roles,
      tenantId: primaryTenant?.tenantId,
    });

    const refresh = await this.refreshTokenService.create(user.id);

    await this.auditService.log('auth.register', 'user', user.id, {
      userId: user.id,
      tenantId: primaryTenant?.tenantId,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      metadata: { email: user.email },
    });

    return {
      accessToken,
      refreshToken: refresh.token,
      expiresIn: Math.floor(this.jwtService.getAccessTokenTtlMs() / 1000),
      tokenType: 'Bearer',
    };
  }
}
