import { z } from 'zod';

export const observabilityEnvSchema = z.object({
  OTEL_SERVICE_NAME: z.string().min(1).optional(),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().optional(),
  SENTRY_DSN: z.string().min(1).optional(),
});

export type ObservabilityEnv = z.infer<typeof observabilityEnvSchema>;
