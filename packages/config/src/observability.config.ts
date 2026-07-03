import { z } from 'zod';

export const observabilityConfigSchema = z.object({
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().optional(),
  SENTRY_DSN: z.string().url().optional(),
});

export type ObservabilityConfig = z.infer<typeof observabilityConfigSchema>;
