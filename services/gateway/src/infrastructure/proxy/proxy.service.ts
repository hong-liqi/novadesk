import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { RequestHandler } from 'express';
import { createProxyMiddleware, type Options } from 'http-proxy-middleware';
import {
  REQUEST_ID_HEADER,
  ROLES_HEADER,
  TENANT_ID_HEADER,
  USER_ID_HEADER,
} from '@novadesk/shared';
import { buildProxyRoutes, matchProxyRoute, type ProxyRoute } from './proxy.routes';

const PROPAGATED_HEADERS = [
  REQUEST_ID_HEADER,
  USER_ID_HEADER,
  TENANT_ID_HEADER,
  ROLES_HEADER,
] as const;

type UpgradeableProxy = RequestHandler & {
  upgrade: (
    req: import('http').IncomingMessage,
    socket: import('net').Socket,
    head: Buffer,
  ) => void;
};

@Injectable()
export class ProxyService {
  private readonly routes: ProxyRoute[];
  private readonly proxies = new Map<string, RequestHandler>();
  private readonly timeoutMs: number;

  constructor(private readonly configService: ConfigService) {
    this.routes = buildProxyRoutes({
      authServiceUrl: this.configService.get<string>('AUTH_SERVICE_URL', 'http://localhost:3001'),
      notificationServiceUrl: this.configService.get<string>(
        'NOTIFICATION_SERVICE_URL',
        'http://localhost:3002',
      ),
      helpdeskServiceUrl: this.configService.get<string>(
        'HELPDESK_SERVICE_URL',
        'http://localhost:3003',
      ),
      analyticsServiceUrl: this.configService.get<string>(
        'ANALYTICS_SERVICE_URL',
        'http://localhost:3004',
      ),
      realtimeChatServiceUrl: this.configService.get<string>(
        'REALTIME_CHAT_SERVICE_URL',
        'http://localhost:3005',
      ),
    });
    this.timeoutMs = this.configService.get<number>('PROXY_TIMEOUT_MS', 10_000);
  }

  matchRoute(path: string): ProxyRoute | undefined {
    return matchProxyRoute(this.routes, path);
  }

  getProxy(route: ProxyRoute): RequestHandler {
    const cached = this.proxies.get(route.name);
    if (cached) {
      return cached;
    }

    const options: Options = {
      target: route.target,
      changeOrigin: true,
      ws: route.ws ?? false,
      proxyTimeout: this.timeoutMs,
      timeout: this.timeoutMs,
      on: {
        proxyReq: (proxyReq, req) => {
          for (const header of PROPAGATED_HEADERS) {
            const value = req.headers[header];
            if (value === undefined) {
              continue;
            }

            const normalized = Array.isArray(value) ? value[0] : value;
            if (normalized) {
              proxyReq.setHeader(header, normalized);
            }
          }
        },
        error: (_error, _req, res) => {
          if ('writeHead' in res && typeof res.writeHead === 'function') {
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ statusCode: 502, message: 'Bad Gateway' }));
          }
        },
      },
    };

    if (route.pathRewrite) {
      const rewrite = route.pathRewrite;
      options.pathRewrite = (path) => rewrite(path);
    }

    const handler = createProxyMiddleware(options);
    this.proxies.set(route.name, handler);
    return handler;
  }

  upgrade(
    route: ProxyRoute,
    request: import('http').IncomingMessage,
    socket: import('net').Socket,
    head: Buffer,
  ): void {
    const proxy = this.getProxy(route) as UpgradeableProxy;
    proxy.upgrade(request, socket, head);
  }
}
