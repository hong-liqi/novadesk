import type { AuthUser } from '../types';
import { AuthContextMiddleware } from './auth-context.middleware';

describe('AuthContextMiddleware', () => {
  it('attaches request identity to the request object', () => {
    const middleware = new AuthContextMiddleware();
    const request: {
      headers: Record<string, string>;
      user?: AuthUser;
    } = {
      headers: {
        'x-user-id': 'user-1',
        'x-user-email': 'user@example.com',
        'x-roles': 'admin,user',
      },
    };
    const response = {};
    const next = jest.fn();

    middleware.use(request, response, next);

    expect(next).toHaveBeenCalled();
    expect(request.user?.id).toBe('user-1');
  });
});
