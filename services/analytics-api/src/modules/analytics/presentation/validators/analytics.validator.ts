import { z } from 'zod';

export const workspaceQuerySchema = z.object({
  workspaceId: z.string().uuid(),
});

export const trendsQuerySchema = workspaceQuerySchema.extend({
  days: z.coerce.number().int().min(1).max(90).default(7),
});

export type WorkspaceQuery = z.infer<typeof workspaceQuerySchema>;
export type TrendsQuery = z.infer<typeof trendsQuerySchema>;
