import { eventEnvelopeSchema } from './event-envelope';

describe('eventEnvelopeSchema', () => {
  it('accepts a valid payload envelope', () => {
    const result = eventEnvelopeSchema.safeParse({
      eventId: '550e8400-e29b-41d4-a716-446655440000',
      eventType: 'ticket.created',
      timestamp: '2026-07-03T12:00:00.000Z',
      source: 'helpdesk-api',
      tenantId: '550e8400-e29b-41d4-a716-446655440001',
      correlationId: '550e8400-e29b-41d4-a716-446655440002',
      payload: { id: 'ticket-1' },
    });

    expect(result.success).toBe(true);
  });
});
