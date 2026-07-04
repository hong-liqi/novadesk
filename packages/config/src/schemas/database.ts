import { z } from 'zod';

/** Aceita URLs postgres com senhas que contêm #, /, ? etc. (z.string().url() rejeita). */
export const postgresConnectionUrlSchema = z
  .string()
  .trim()
  .min(1)
  .refine((value) => /^postgres(?:ql)?:\/\/.+/i.test(value), {
    message: 'Must start with postgresql:// or postgres://',
  });

export const databaseEnvSchema = z.object({
  DATABASE_URL: postgresConnectionUrlSchema,
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
