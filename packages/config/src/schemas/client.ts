import { z } from 'zod';

export const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_NAME: z.string().min(1).optional(),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;
