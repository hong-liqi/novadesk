const PUBLIC_AUTH_PATHS = new Set([
  '/api/v1/auth/login',
  '/api/v1/auth/register',
  '/api/v1/auth/setup',
  '/api/v1/auth/refresh',
]);

/** Public notification endpoint for NovaDesk contact form (rate-limited at gateway). */
const PUBLIC_NOTIFICATION_PATHS = new Set(['/api/v1/notifications/send']);

/** Public platform settings readable by the marketing site contact form. */
const PUBLIC_SETTINGS_PATHS = new Set(['/api/v1/settings/contact-email']);

export function isPublicRoute(path: string): boolean {
  if (path === '/.well-known/jwks.json') {
    return true;
  }

  if (path === '/api/v1/status' || path.startsWith('/api/v1/status/')) {
    return true;
  }

  if (path === '/api/v1/health' || path.startsWith('/api/v1/health/')) {
    return true;
  }

  if (path.startsWith('/socket.io')) {
    return true;
  }

  if (PUBLIC_NOTIFICATION_PATHS.has(path)) {
    return true;
  }

  if (PUBLIC_SETTINGS_PATHS.has(path)) {
    return true;
  }

  return PUBLIC_AUTH_PATHS.has(path);
}
