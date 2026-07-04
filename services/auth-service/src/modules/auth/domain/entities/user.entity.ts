import type { Role } from '@portfolio/shared';

export interface UserEntity {
  id: string;
  email: string;
  name: string | null;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithMemberships extends UserEntity {
  memberships: {
    tenantId: string;
    tenantName: string;
    tenantSlug: string;
    role: Role;
  }[];
}
