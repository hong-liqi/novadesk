import {
  CurrentUser,
  IS_PUBLIC_KEY,
  PERMISSIONS_KEY,
  Permissions,
  Public,
  ROLES_KEY,
  Roles,
} from './decorators';

describe('auth package exports', () => {
  it('exposes decorator metadata keys', () => {
    class TestController {
      @Public()
      @Roles('admin')
      @Permissions('ticket:create')
      handler(): void {
        return undefined;
      }
    }

    expect(Reflect.getMetadata(IS_PUBLIC_KEY, TestController.prototype.handler)).toBe(true);
    expect(Reflect.getMetadata(ROLES_KEY, TestController.prototype.handler)).toEqual(['admin']);
    expect(Reflect.getMetadata(PERMISSIONS_KEY, TestController.prototype.handler)).toEqual([
      'ticket:create',
    ]);
    expect(CurrentUser).toBeDefined();
  });
});
