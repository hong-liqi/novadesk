import type { Role } from '../constants/roles';

export interface User {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  roles?: Role[];
  tenantId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserTenantMembership {
  id: string;
  name: string;
  slug: string;
  role: string;
}
