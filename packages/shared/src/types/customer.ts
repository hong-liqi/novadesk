export interface Customer {
  id: string;
  workspaceId: string;
  email: string;
  name: string | null;
  company?: string | null;
  createdAt: string;
  updatedAt: string;
}
