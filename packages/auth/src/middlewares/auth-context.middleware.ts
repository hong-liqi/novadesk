import { extractRequestIdentity } from '../helpers';
import type { AuthRequest } from '../types';
import type { AuthUser } from '../types';

interface MiddlewareRequest {
  headers: AuthRequest['headers'];
  user?: AuthUser;
}

export class AuthContextMiddleware {
  use(request: MiddlewareRequest, _response: unknown, next: () => void): void {
    request.user = extractRequestIdentity({
      headers: request.headers,
      user: request.user,
    });
    next();
  }
}
