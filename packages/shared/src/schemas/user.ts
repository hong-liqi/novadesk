import { z } from 'zod';
import { ROLE_LIST } from '../constants/roles';

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().nullable(),
  emailVerified: z.boolean(),
  roles: z.array(z.enum(ROLE_LIST as [string, ...string[]])).optional(),
  tenantId: z.string().uuid().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type UserSchema = z.infer<typeof userSchema>;

export const userTenantMembershipSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  role: z.string().min(1),
});

export type UserTenantMembershipSchema = z.infer<typeof userTenantMembershipSchema>;
