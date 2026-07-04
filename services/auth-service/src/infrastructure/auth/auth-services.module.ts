import { Global, Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtService } from './jwt.service';
import { PasswordService } from './password.service';
import { RefreshTokenService } from './refresh-token.service';

@Global()
@Module({
  providers: [PasswordService, JwtService, RefreshTokenService, AuditService],
  exports: [PasswordService, JwtService, RefreshTokenService, AuditService],
})
export class AuthServicesModule {}
