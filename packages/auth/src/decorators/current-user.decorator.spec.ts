import { ExecutionContext } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { CurrentUser } from './current-user.decorator';

describe('CurrentUser decorator', () => {
  it('extracts the authenticated user from the request', () => {
    class TestController {
      handler(@CurrentUser() _user: unknown): void {
        return undefined;
      }
    }

    const metadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestController, 'handler') as Record<
      string,
      { factory: (data: unknown, ctx: ExecutionContext) => unknown }
    >;
    const factory = Object.values(metadata)[0]?.factory;
    const user = { id: 'user-1', email: 'user@example.com', roles: ['user'] };
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as ExecutionContext;

    expect(factory?.(undefined, context)).toBe(user);
  });
});
