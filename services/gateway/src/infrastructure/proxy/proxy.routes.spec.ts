import { buildProxyRoutes, matchProxyRoute } from './proxy.routes';

describe('proxy routes', () => {
  const routes = buildProxyRoutes({
    authServiceUrl: 'http://localhost:3001',
    notificationServiceUrl: 'http://localhost:3002',
    helpdeskServiceUrl: 'http://localhost:3003',
    analyticsServiceUrl: 'http://localhost:3004',
    realtimeChatServiceUrl: 'http://localhost:3005',
  });

  it('routes auth paths to auth service', () => {
    const route = matchProxyRoute(routes, '/api/v1/auth/login');
    expect(route?.name).toBe('auth');
    expect(route?.target).toBe('http://localhost:3001');
  });

  it('routes tenant admin paths to auth service', () => {
    const route = matchProxyRoute(routes, '/api/v1/tenants');
    expect(route?.name).toBe('tenants');
    expect(route?.target).toBe('http://localhost:3001');
  });

  it('routes platform settings to auth service', () => {
    const route = matchProxyRoute(routes, '/api/v1/settings/contact-email');
    expect(route?.name).toBe('settings');
    expect(route?.target).toBe('http://localhost:3001');
  });

  it('routes notifications paths to notification service', () => {
    const route = matchProxyRoute(routes, '/api/v1/notifications/inbox');
    expect(route?.name).toBe('notifications');
    expect(route?.target).toBe('http://localhost:3002');
  });

  it('routes helpdesk paths with prefix rewrite', () => {
    const route = matchProxyRoute(routes, '/api/v1/helpdesk/tickets');
    expect(route?.name).toBe('helpdesk');
    expect(route?.pathRewrite?.('/api/v1/helpdesk/tickets')).toBe('/api/v1/tickets');
  });

  it('routes analytics paths with prefix rewrite', () => {
    const route = matchProxyRoute(routes, '/api/v1/analytics/kpis');
    expect(route?.name).toBe('analytics');
    expect(route?.pathRewrite?.('/api/v1/analytics/kpis')).toBe('/api/v1/kpis');
  });

  it('routes jwks to auth service', () => {
    const route = matchProxyRoute(routes, '/.well-known/jwks.json');
    expect(route?.name).toBe('jwks');
    expect(route?.target).toBe('http://localhost:3001');
  });

  it('routes chat paths to realtime chat service', () => {
    const route = matchProxyRoute(routes, '/api/v1/chat/rooms/abc/messages');
    expect(route?.name).toBe('chat');
    expect(route?.target).toBe('http://localhost:3005');
  });

  it('routes socket.io paths to realtime chat service with ws enabled', () => {
    const route = matchProxyRoute(routes, '/socket.io/');
    expect(route?.name).toBe('chat-ws');
    expect(route?.target).toBe('http://localhost:3005');
    expect(route?.ws).toBe(true);
  });

  it('returns undefined for non-proxy paths', () => {
    expect(matchProxyRoute(routes, '/api/v1/status')).toBeUndefined();
  });
});
