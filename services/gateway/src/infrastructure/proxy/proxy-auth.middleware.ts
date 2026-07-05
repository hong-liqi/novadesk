import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import {
  ROLES_HEADER,
  TENANT_ID_HEADER,
  USER_EMAIL_HEADER,
  USER_ID_HEADER,
} from '@novadesk/shared';
import { parseBearerToken, type AuthUser } from '@novadesk/auth';
import { isPublicRoute } from './is-public-route';
import { JwtValidationService } from './jwt-validation.service';
import { ProxyService } from './proxy.service';

type AuthenticatedRequest = Request & { user?: AuthUser };

@Injectable()
export class ProxyAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly proxyService: ProxyService,
    private readonly jwtValidationService: JwtValidationService,
  ) {}

  async use(request: Request, response: Response, next: NextFunction): Promise<void> {
    const route = this.proxyService.matchRoute(request.path);
    if (!route || isPublicRoute(request.path)) {
      next();
      return;
    }

    const token = parseBearerToken(request.headers.authorization);
    if (!token) {
      next(new UnauthorizedException('Missing authentication'));
      return;
    }

    try {
      const { payload, user } = await this.jwtValidationService.validateToken(token);
      request.headers[USER_ID_HEADER] = payload.sub;
      request.headers[USER_EMAIL_HEADER] = payload.email;
      request.headers[TENANT_ID_HEADER] = payload.tenantId ?? '';
      request.headers[ROLES_HEADER] = payload.roles.join(',');
      (request as AuthenticatedRequest).user = user;
      next();
    } catch (error) {
      next(error);
    }
  }
}
