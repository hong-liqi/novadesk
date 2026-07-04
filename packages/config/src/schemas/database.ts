import { z } from 'zod';

export const databaseEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  DATABASE_POOL_SIZE: z.coerce.number().int().positive().max(50).default(10),
  DATABASE_SSL: z
    .union([z.string(), z.boolean()])
    .optional()
    .transform((value) => {
      if (value === undefined) return false;
      if (typeof value === 'boolean') return value;
      return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
    }),
});

export type DatabaseEnv = z.infer<typeof databaseEnvSchema>;
