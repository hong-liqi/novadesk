import { customerSchema } from './customer';
import { organizationSchema } from './organization';
import { tenantSchema } from './tenant';
import { ticketSchema } from './ticket';
import { userSchema } from './user';
import { workspaceSchema } from './workspace';

describe('domain schemas', () => {
  it('accepts a valid ticket payload', () => {
    const result = ticketSchema.safeParse({
      id: '550e8400-e29b-41d4-a716-446655440000',
      workspaceId: '550e8400-e29b-41d4-a716-446655440001',
      title: 'Login issue',
      status: 'OPEN',
      priority: 'HIGH',
      createdAt: '2026-07-03T12:00:00.000Z',
      updatedAt: '2026-07-03T12:00:00.000Z',
    });

    expect(result.success).toBe(true);
  });

  it('accepts a valid user payload', () => {
    const result = userSchema.safeParse({
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'user@example.com',
      name: 'User',
      emailVerified: true,
      createdAt: '2026-07-03T12:00:00.000Z',
      updatedAt: '2026-07-03T12:00:00.000Z',
    });

    expect(result.success).toBe(true);
  });

  it('accepts a valid tenant payload', () => {
    const result = tenantSchema.safeParse({
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Acme',
      slug: 'acme',
      isActive: true,
      createdAt: '2026-07-03T12:00:00.000Z',
      updatedAt: '2026-07-03T12:00:00.000Z',
    });

    expect(result.success).toBe(true);
  });

  it('accepts a valid workspace payload', () => {
    const result = workspaceSchema.safeParse({
      id: '550e8400-e29b-41d4-a716-446655440000',
      organizationId: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Support',
      slug: 'support',
      isActive: true,
      createdAt: '2026-07-03T12:00:00.000Z',
      updatedAt: '2026-07-03T12:00:00.000Z',
    });

    expect(result.success).toBe(true);
  });

  it('accepts a valid organization payload', () => {
    const result = organizationSchema.safeParse({
      id: '550e8400-e29b-41d4-a716-446655440000',
      tenantId: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Acme Org',
      slug: 'acme-org',
      isActive: true,
      createdAt: '2026-07-03T12:00:00.000Z',
      updatedAt: '2026-07-03T12:00:00.000Z',
    });

    expect(result.success).toBe(true);
  });

  it('accepts a valid customer payload', () => {
    const result = customerSchema.safeParse({
      id: '550e8400-e29b-41d4-a716-446655440000',
      workspaceId: '550e8400-e29b-41d4-a716-446655440001',
      email: 'customer@example.com',
      name: 'Customer',
      createdAt: '2026-07-03T12:00:00.000Z',
      updatedAt: '2026-07-03T12:00:00.000Z',
    });

    expect(result.success).toBe(true);
  });
});
