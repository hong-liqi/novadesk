import { Module } from '@nestjs/common';
import { AuthSessionController } from './presentation/controllers/auth-session.controller';
import { AuthSessionRepository } from './infrastructure/persistence/auth-session.repository';
import { AUTHSESSION_REPOSITORY } from './application/ports/auth-session.repository.port';

@Module({
  controllers: [AuthSessionController],
  providers: [
    {
      provide: AUTHSESSION_REPOSITORY,
      useClass: AuthSessionRepository,
    },
  ],
  exports: [AUTHSESSION_REPOSITORY],
})
export class AuthModule {}
