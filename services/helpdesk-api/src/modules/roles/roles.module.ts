import { Module } from '@nestjs/common';
import { RoleController } from './presentation/controllers/role.controller';
import { RoleRepository } from './infrastructure/persistence/role.repository';
import { ROLE_REPOSITORY } from './application/ports/role.repository.port';

@Module({
  controllers: [RoleController],
  providers: [
    {
      provide: ROLE_REPOSITORY,
      useClass: RoleRepository,
    },
  ],
  exports: [ROLE_REPOSITORY],
})
export class RolesModule {}
