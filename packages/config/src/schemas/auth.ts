import { z } from 'zod';

export const authEnvSchema = z.object({
  JWT_ISSUER: z.string().min(1).default('novadesk-auth'),
  JWT_AUDIENCE: z.string().min(1).default('novadesk'),
  JWT_PRIVATE_KEY: z.string().min(1).optional(),
  JWT_PUBLIC_KEY: z.string().min(1).optional(),
  JWT_KID: z.string().min(1).optional(),
  AUTH_JWKS_URL: z.string().url().optional(),
  ACCESS_TOKEN_TTL: z.string().min(1).default('15m'),
  REFRESH_TOKEN_TTL: z.string().min(1).default('7d'),
});

export type AuthEnv = z.infer<typeof authEnvSchema>;
