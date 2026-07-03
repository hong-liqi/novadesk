import { z } from 'zod';

export const redisConfigSchema = z.object({
  REDIS_URL: z.string().url().default('redis://localhost:6379'),
});

export type RedisConfig = z.infer<typeof redisConfigSchema>;
