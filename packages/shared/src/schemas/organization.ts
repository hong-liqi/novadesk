import { z } from 'zod';

export const organizationSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type OrganizationSchema = z.infer<typeof organizationSchema>;

export const createOrganizationSchema = organizationSchema.pick({
  tenantId: true,
  name: true,
  slug: true,
});

export type CreateOrganizationSchema = z.infer<typeof createOrganizationSchema>;
