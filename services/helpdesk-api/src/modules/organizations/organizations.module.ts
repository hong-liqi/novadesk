import { Module } from '@nestjs/common';
import { OrganizationController } from './presentation/controllers/organization.controller';
import { OrganizationRepository } from './infrastructure/persistence/organization.repository';
import { ORGANIZATION_REPOSITORY } from './application/ports/organization.repository.port';
import {
  CreateOrganizationUseCase,
  DeleteOrganizationUseCase,
  GetOrganizationUseCase,
  ListOrganizationsUseCase,
  UpdateOrganizationUseCase,
} from './application/use-cases/organization.use-cases';

@Module({
  controllers: [OrganizationController],
  providers: [
    ListOrganizationsUseCase,
    GetOrganizationUseCase,
    CreateOrganizationUseCase,
    UpdateOrganizationUseCase,
    DeleteOrganizationUseCase,
    {
      provide: ORGANIZATION_REPOSITORY,
      useClass: OrganizationRepository,
    },
  ],
  exports: [ORGANIZATION_REPOSITORY],
})
export class OrganizationsModule {}
