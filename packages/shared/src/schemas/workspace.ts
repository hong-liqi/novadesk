import { z } from 'zod';

export const workspaceSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type WorkspaceSchema = z.infer<typeof workspaceSchema>;

export const createWorkspaceSchema = workspaceSchema.pick({
  organizationId: true,
  name: true,
  slug: true,
});

export type CreateWorkspaceSchema = z.infer<typeof createWorkspaceSchema>;
