import { z } from 'zod';

export const gatewayEnvSchema = z.object({
  AUTH_SERVICE_URL: z.string().url().default('http://localhost:3001'),
  NOTIFICATION_SERVICE_URL: z.string().url().default('http://localhost:3002'),
  HELPDESK_SERVICE_URL: z.string().url().default('http://localhost:3003'),
  ANALYTICS_SERVICE_URL: z.string().url().default('http://localhost:3004'),
  REALTIME_CHAT_SERVICE_URL: z.string().url().default('http://localhost:3005'),
  THROTTLE_TTL: z.coerce.number().int().positive().default(60_000),
  THROTTLE_LIMIT: z.coerce.number().int().positive().default(100),
  PROXY_TIMEOUT_MS: z.coerce.number().int().positive().default(10_000),
});

export type GatewayEnv = z.infer<typeof gatewayEnvSchema>;
