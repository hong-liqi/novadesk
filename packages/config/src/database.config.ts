import { z } from 'zod';

export const databaseConfigSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
});

export type DatabaseConfig = z.infer<typeof databaseConfigSchema>;
