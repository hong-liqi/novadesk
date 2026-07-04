import { z } from 'zod';

export const redisEnvSchema = z.object({
  REDIS_URL: z.string().url(),
  REDIS_PREFIX: z.string().min(1).default('novadesk'),
});

export type RedisEnv = z.infer<typeof redisEnvSchema>;
