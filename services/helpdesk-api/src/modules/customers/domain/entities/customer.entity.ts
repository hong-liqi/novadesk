export interface CustomerEntity {
  id: string;
  workspaceId: string;
  name: string;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
}
