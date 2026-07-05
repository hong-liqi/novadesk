import { Module } from '@nestjs/common';
import { WorkspaceController } from './presentation/controllers/workspace.controller';
import { WorkspaceRepository } from './infrastructure/persistence/workspace.repository';
import { WORKSPACE_REPOSITORY } from './application/ports/workspace.repository.port';
import {
  CreateWorkspaceUseCase,
  DeleteWorkspaceUseCase,
  GetWorkspaceUseCase,
  ListWorkspacesUseCase,
  UpdateWorkspaceUseCase,
} from './application/use-cases/workspace.use-cases';
import { ProvisionTenantWorkspaceUseCase } from './application/use-cases/provision-tenant-workspace.use-case';

@Module({
  controllers: [WorkspaceController],
  providers: [
    ProvisionTenantWorkspaceUseCase,
    ListWorkspacesUseCase,
    GetWorkspaceUseCase,
    CreateWorkspaceUseCase,
    UpdateWorkspaceUseCase,
    DeleteWorkspaceUseCase,
    {
      provide: WORKSPACE_REPOSITORY,
      useClass: WorkspaceRepository,
    },
  ],
  exports: [WORKSPACE_REPOSITORY],
})
export class WorkspacesModule {}
