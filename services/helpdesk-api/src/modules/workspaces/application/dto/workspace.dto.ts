export interface CreateWorkspaceDto {
  organizationId: string;
  name: string;
  slug: string;
}

export interface UpdateWorkspaceDto {
  name?: string;
  slug?: string;
}

export interface WorkspaceResponseDto {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}
