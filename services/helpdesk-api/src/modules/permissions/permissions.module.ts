import { Module } from '@nestjs/common';
import { PermissionController } from './presentation/controllers/permission.controller';
import { PermissionRepository } from './infrastructure/persistence/permission.repository';
import { PERMISSION_REPOSITORY } from './application/ports/permission.repository.port';

@Module({
  controllers: [PermissionController],
  providers: [
    {
      provide: PERMISSION_REPOSITORY,
      useClass: PermissionRepository,
    },
  ],
  exports: [PERMISSION_REPOSITORY],
})
export class PermissionsModule {}
