import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { ProxyService } from './proxy.service';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  constructor(private readonly proxyService: ProxyService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const route = this.proxyService.matchRoute(request.path);
    if (!route) {
      next();
      return;
    }

    const proxy = this.proxyService.getProxy(route);
    proxy(request, response, next);
  }
}
