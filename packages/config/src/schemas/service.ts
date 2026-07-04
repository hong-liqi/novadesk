import { z } from 'zod';
import { authEnvSchema } from './auth';
import { baseEnvSchema } from './base';
import { clientEnvSchema } from './client';
import { databaseEnvSchema } from './database';
import { observabilityEnvSchema } from './observability';
import { redisEnvSchema } from './redis';
import { commaSeparatedList } from '../create-config';

export const serviceEnvSchema = baseEnvSchema
  .merge(databaseEnvSchema)
  .merge(redisEnvSchema)
  .merge(authEnvSchema)
  .merge(observabilityEnvSchema)
  .merge(clientEnvSchema)
  .extend({
    CORS_ORIGINS: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((value) => {
        if (Array.isArray(value)) {
          return value;
        }

        return commaSeparatedList(value) ?? [];
      }),
    ENABLE_REQUEST_LOGGING: z
      .union([z.string(), z.boolean()])
      .optional()
      .transform((value) => {
        if (value === undefined) return true;
        if (typeof value === 'boolean') return value;
        return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
      }),
  });

export type ServiceEnv = z.infer<typeof serviceEnvSchema>;
