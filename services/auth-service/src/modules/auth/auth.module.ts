import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '@novadesk/auth';
import { AuthServicesModule } from '@infrastructure/auth/auth-services.module';
import { USER_REPOSITORY } from './application/ports/user.repository.port';
import { GetMeUseCase } from './application/use-cases/get-me.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { RefreshUseCase } from './application/use-cases/refresh.use-case';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { AuthController } from './presentation/controllers/auth.controller';
import { LocalJwtAuthGuard } from './presentation/guards/local-jwt-auth.guard';

@Module({
  imports: [AuthServicesModule],
  controllers: [AuthController],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    RefreshUseCase,
    LogoutUseCase,
    GetMeUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: APP_GUARD,
      useClass: LocalJwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class AuthModule {}
