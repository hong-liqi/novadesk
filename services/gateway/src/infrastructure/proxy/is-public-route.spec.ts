import { isPublicRoute } from './is-public-route';

describe('isPublicRoute', () => {
  it('marks jwks as public', () => {
    expect(isPublicRoute('/.well-known/jwks.json')).toBe(true);
  });

  it('marks auth login and register as public', () => {
    expect(isPublicRoute('/api/v1/auth/login')).toBe(true);
    expect(isPublicRoute('/api/v1/auth/register')).toBe(true);
    expect(isPublicRoute('/api/v1/auth/setup')).toBe(true);
  });

  it('marks gateway health and status as public', () => {
    expect(isPublicRoute('/api/v1/health')).toBe(true);
    expect(isPublicRoute('/api/v1/health/live')).toBe(true);
    expect(isPublicRoute('/api/v1/status')).toBe(true);
  });

  it('marks socket.io as public (JWT validated on chat service handshake)', () => {
    expect(isPublicRoute('/socket.io/')).toBe(true);
  });

  it('marks contact notification send as public', () => {
    expect(isPublicRoute('/api/v1/notifications/send')).toBe(true);
  });

  it('requires auth for protected proxy paths', () => {
    expect(isPublicRoute('/api/v1/auth/me')).toBe(false);
    expect(isPublicRoute('/api/v1/notifications')).toBe(false);
    expect(isPublicRoute('/api/v1/notifications/inbox')).toBe(false);
    expect(isPublicRoute('/api/v1/helpdesk/tickets')).toBe(false);
    expect(isPublicRoute('/api/v1/analytics/kpis')).toBe(false);
  });
});
