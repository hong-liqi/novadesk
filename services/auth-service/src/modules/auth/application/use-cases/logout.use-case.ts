import { Injectable } from '@nestjs/common';
import type { AuthUser } from '@novadesk/auth';
import { AuditService } from '@infrastructure/auth/audit.service';
import { RefreshTokenService } from '@infrastructure/auth/refresh-token.service';
import type { LogoutDto } from '../dto/auth.dto';
import type { RequestMeta } from './register.use-case';

@Injectable()
export class LogoutUseCase {
  constructor(
    private readonly refreshTokenService: RefreshTokenService,
    private readonly auditService: AuditService,
  ) {}

  async execute(user: AuthUser | undefined, dto: LogoutDto, meta: RequestMeta = {}): Promise<void> {
    if (dto.refreshToken) {
      await this.refreshTokenService.revoke(dto.refreshToken);
    } else if (user) {
      await this.refreshTokenService.revokeAllForUser(user.id);
    }

    if (user) {
      await this.auditService.log('auth.logout', 'user', user.id, {
        userId: user.id,
        tenantId: user.tenantId,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      });
    }
  }
}
