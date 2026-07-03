import { z } from 'zod';

export const baseConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  PORT: z.coerce.number().int().positive().default(3000),
  SERVICE_NAME: z.string().min(1),
});

export type BaseConfig = z.infer<typeof baseConfigSchema>;
