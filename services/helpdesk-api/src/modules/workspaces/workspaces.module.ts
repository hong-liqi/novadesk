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

@Module({
  controllers: [WorkspaceController],
  providers: [
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
