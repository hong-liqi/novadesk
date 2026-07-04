import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators';
import { parseBearerToken } from '../helpers';
import type { AuthRequest } from '../types';

/**
 * Foundation guard — validates presence of auth headers injected by Gateway.
 * Full JWT validation will be implemented in M2 (Auth Service).
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const token = parseBearerToken(request.headers.authorization);
    const userId = request.headers['x-user-id'];

    if (!token && !userId && !request.user) {
      throw new UnauthorizedException('Missing authentication');
    }

    return true;
  }
}
