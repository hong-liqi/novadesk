import { z } from 'zod';

export const tenantSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type TenantSchema = z.infer<typeof tenantSchema>;

export const createTenantSchema = tenantSchema.pick({ name: true, slug: true });

export type CreateTenantSchema = z.infer<typeof createTenantSchema>;
