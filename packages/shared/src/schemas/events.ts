import { z } from 'zod';

export const eventEnvelopeSchema = z.object({
  eventId: z.string().uuid(),
  eventType: z.string(),
  timestamp: z.string().datetime(),
  source: z.string(),
  tenantId: z.string().uuid().optional(),
  payload: z.record(z.unknown()),
  correlationId: z.string().uuid().optional(),
});

export type EventEnvelope = z.infer<typeof eventEnvelopeSchema>;
