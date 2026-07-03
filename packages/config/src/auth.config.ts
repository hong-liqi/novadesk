import { z } from 'zod';

export const authConfigSchema = z.object({
  JWT_PUBLIC_KEY: z.string().optional(),
  JWT_PRIVATE_KEY: z.string().optional(),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL: z.string().default('7d'),
});

export type AuthConfig = z.infer<typeof authConfigSchema>;
