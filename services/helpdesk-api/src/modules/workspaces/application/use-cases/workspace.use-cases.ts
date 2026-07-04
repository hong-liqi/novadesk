import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  WorkspaceResponseDto,
} from '../dto/workspace.dto';
import {
  WORKSPACE_REPOSITORY,
  type WorkspaceRepositoryPort,
} from '../ports/workspace.repository.port';
import type { WorkspaceEntity } from '../../domain/entities/workspace.entity';

@Injectable()
export class ListWorkspacesUseCase {
  constructor(
    @Inject(WORKSPACE_REPOSITORY)
    private readonly repository: WorkspaceRepositoryPort,
  ) {}

  async execute(userId?: string): Promise<WorkspaceResponseDto[]> {
    if (!userId) {
      throw new BadRequestException('X-User-Id header is required');
    }
    const items = await this.repository.findByUserId(userId);
    return items.map(mapWorkspace);
  }
}

@Injectable()
export class GetWorkspaceUseCase {
  constructor(
    @Inject(WORKSPACE_REPOSITORY)
    private readonly repository: WorkspaceRepositoryPort,
  ) {}

  async execute(id: string): Promise<WorkspaceResponseDto> {
    const workspace = await this.repository.findById(id);
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }
    return mapWorkspace(workspace);
  }
}

@Injectable()
export class CreateWorkspaceUseCase {
  constructor(
    @Inject(WORKSPACE_REPOSITORY)
    private readonly repository: WorkspaceRepositoryPort,
  ) {}

  async execute(dto: CreateWorkspaceDto): Promise<WorkspaceResponseDto> {
    const existing = await this.repository.findBySlug(dto.organizationId, dto.slug);
    if (existing) {
      throw new ConflictException('Workspace slug already exists in this organization');
    }
    const workspace = await this.repository.create(dto);
    return mapWorkspace(workspace);
  }
}

@Injectable()
export class UpdateWorkspaceUseCase {
  constructor(
    @Inject(WORKSPACE_REPOSITORY)
    private readonly repository: WorkspaceRepositoryPort,
  ) {}

  async execute(id: string, dto: UpdateWorkspaceDto): Promise<WorkspaceResponseDto> {
    const workspace = await this.repository.findById(id);
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }
    if (dto.slug && dto.slug !== workspace.slug) {
      const existing = await this.repository.findBySlug(workspace.organizationId, dto.slug);
      if (existing) {
        throw new ConflictException('Workspace slug already exists in this organization');
      }
    }
    const updated = await this.repository.update(id, dto);
    return mapWorkspace(updated);
  }
}

@Injectable()
export class DeleteWorkspaceUseCase {
  constructor(
    @Inject(WORKSPACE_REPOSITORY)
    private readonly repository: WorkspaceRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    const workspace = await this.repository.findById(id);
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }
    await this.repository.delete(id);
  }
}

function mapWorkspace(workspace: WorkspaceEntity): WorkspaceResponseDto {
  return {
    id: workspace.id,
    organizationId: workspace.organizationId,
    name: workspace.name,
    slug: workspace.slug,
    createdAt: workspace.createdAt.toISOString(),
    updatedAt: workspace.updatedAt.toISOString(),
  };
}
