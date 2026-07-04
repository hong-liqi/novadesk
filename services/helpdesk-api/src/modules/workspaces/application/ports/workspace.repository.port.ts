import type { WorkspaceEntity } from '../../domain/entities/workspace.entity';

export const WORKSPACE_REPOSITORY = Symbol('WORKSPACE_REPOSITORY');

export interface CreateWorkspaceInput {
  organizationId: string;
  name: string;
  slug: string;
}

export interface UpdateWorkspaceInput {
  name?: string;
  slug?: string;
}

export interface WorkspaceRepositoryPort {
  findByUserId(userId: string): Promise<WorkspaceEntity[]>;
  findById(id: string): Promise<WorkspaceEntity | null>;
  findBySlug(organizationId: string, slug: string): Promise<WorkspaceEntity | null>;
  create(input: CreateWorkspaceInput): Promise<WorkspaceEntity>;
  update(id: string, input: UpdateWorkspaceInput): Promise<WorkspaceEntity>;
  delete(id: string): Promise<void>;
}
