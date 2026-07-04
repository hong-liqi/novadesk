import { Module } from '@nestjs/common';
import { UserController } from './presentation/controllers/user.controller';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { USER_REPOSITORY } from './application/ports/user.repository.port';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}
