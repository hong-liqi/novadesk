export interface ProxyRoute {
  name: string;
  match: (path: string) => boolean;
  target: string;
  pathRewrite?: (path: string) => string;
  ws?: boolean;
}

export interface GatewayProxyConfig {
  authServiceUrl: string;
  notificationServiceUrl: string;
  helpdeskServiceUrl: string;
  analyticsServiceUrl: string;
  realtimeChatServiceUrl: string;
}

export function buildProxyRoutes(config: GatewayProxyConfig): ProxyRoute[] {
  return [
    {
      name: 'jwks',
      match: (path) => path === '/.well-known/jwks.json',
      target: config.authServiceUrl,
    },
    {
      name: 'auth',
      match: (path) => path.startsWith('/api/v1/auth'),
      target: config.authServiceUrl,
    },
    {
      name: 'notifications',
      match: (path) => path.startsWith('/api/v1/notifications'),
      target: config.notificationServiceUrl,
    },
    {
      name: 'helpdesk',
      match: (path) => path.startsWith('/api/v1/helpdesk'),
      target: config.helpdeskServiceUrl,
      pathRewrite: (path) => path.replace(/^\/api\/v1\/helpdesk/, '/api/v1'),
    },
    {
      name: 'analytics',
      match: (path) => path.startsWith('/api/v1/analytics'),
      target: config.analyticsServiceUrl,
      pathRewrite: (path) => path.replace(/^\/api\/v1\/analytics/, '/api/v1'),
    },
    {
      name: 'chat',
      match: (path) => path.startsWith('/api/v1/chat'),
      target: config.realtimeChatServiceUrl,
    },
    {
      name: 'chat-ws',
      match: (path) => path.startsWith('/socket.io'),
      target: config.realtimeChatServiceUrl,
      ws: true,
    },
  ];
}

export function matchProxyRoute(routes: ProxyRoute[], path: string): ProxyRoute | undefined {
  return routes.find((route) => route.match(path));
}
