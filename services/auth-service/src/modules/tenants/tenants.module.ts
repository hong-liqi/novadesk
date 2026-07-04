import { Module } from '@nestjs/common';
import { TENANT_REPOSITORY } from './application/ports/tenant.repository.port';
import {
  CreateTenantUseCase,
  DeleteTenantUseCase,
  GetTenantUseCase,
  ListTenantsUseCase,
  UpdateTenantUseCase,
} from './application/use-cases/tenant.use-cases';
import { TenantRepository } from './infrastructure/persistence/tenant.repository';
import { TenantsController } from './presentation/controllers/tenants.controller';

@Module({
  controllers: [TenantsController],
  providers: [
    ListTenantsUseCase,
    GetTenantUseCase,
    CreateTenantUseCase,
    UpdateTenantUseCase,
    DeleteTenantUseCase,
    {
      provide: TENANT_REPOSITORY,
      useClass: TenantRepository,
    },
  ],
  exports: [TENANT_REPOSITORY],
})
export class TenantsModule {}
