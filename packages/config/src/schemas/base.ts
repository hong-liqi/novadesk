import { z } from 'zod';

export const nodeEnvValues = ['development', 'test', 'staging', 'production'] as const;

export const baseEnvSchema = z.object({
  NODE_ENV: z.enum(nodeEnvValues).default('development'),
  APP_NAME: z.string().min(1).default('novadesk'),
  SERVICE_NAME: z.string().min(1).optional(),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  LOG_PRETTY: z
    .union([z.string(), z.boolean()])
    .optional()
    .transform((value) => {
      if (value === undefined) return false;
      if (typeof value === 'boolean') return value;
      return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
    }),
});

export type BaseEnv = z.infer<typeof baseEnvSchema>;
