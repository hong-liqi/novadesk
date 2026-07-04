import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { PermissionsGuard } from './permissions.guard';
import { IS_PUBLIC_KEY, PERMISSIONS_KEY, ROLES_KEY } from '../decorators';

function buildExecutionContext(overrides: {
  headers?: Record<string, string | undefined>;
  user?: unknown;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  publicRoute?: boolean;
}) {
  const reflector = {
    getAllAndOverride: (key: string) => {
      if (key === IS_PUBLIC_KEY) return overrides.publicRoute ?? false;
      if (key === ROLES_KEY) return overrides.requiredRoles;
      if (key === PERMISSIONS_KEY) return overrides.requiredPermissions;
      return undefined;
    },
  } as unknown as Reflector;

  const context = {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({
      getRequest: () => ({
        headers: overrides.headers ?? {},
        user: overrides.user,
      }),
    }),
  } as never;

  return { reflector, context };
}

describe('auth guards', () => {
  it('allows authenticated requests in jwt guard', () => {
    const { reflector, context } = buildExecutionContext({
      headers: { authorization: 'Bearer token' },
    });
    const guard = new JwtAuthGuard(reflector);
    expect(guard.canActivate(context)).toBe(true);
  });

  it('rejects unauthenticated requests in jwt guard', () => {
    const { reflector, context } = buildExecutionContext({});
    const guard = new JwtAuthGuard(reflector);
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('enforces roles and permissions', () => {
    const { reflector, context } = buildExecutionContext({
      user: {
        id: 'user-1',
        email: 'user@example.com',
        roles: ['admin'],
        permissions: ['ticket:create'],
      },
      requiredRoles: ['admin'],
      requiredPermissions: ['ticket:create'],
    });

    const rolesGuard = new RolesGuard(reflector);
    const permissionsGuard = new PermissionsGuard(reflector);

    expect(rolesGuard.canActivate(context)).toBe(true);
    expect(permissionsGuard.canActivate(context)).toBe(true);
  });

  it('throws when roles are missing', () => {
    const { reflector, context } = buildExecutionContext({
      user: {
        id: 'user-1',
        email: 'user@example.com',
        roles: ['user'],
      },
      requiredRoles: ['admin'],
    });

    const rolesGuard = new RolesGuard(reflector);
    expect(() => rolesGuard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('allows public routes and gateway-injected user ids', () => {
    const publicGuard = new JwtAuthGuard(buildExecutionContext({ publicRoute: true }).reflector);
    const userIdGuard = new JwtAuthGuard(
      buildExecutionContext({ headers: { 'x-user-id': 'gateway-user' } }).reflector,
    );
    const userGuard = new JwtAuthGuard(
      buildExecutionContext({
        user: { id: 'user-1', email: 'user@example.com', roles: ['user'] },
      }).reflector,
    );

    expect(publicGuard.canActivate(buildExecutionContext({ publicRoute: true }).context)).toBe(
      true,
    );
    expect(
      userIdGuard.canActivate(
        buildExecutionContext({ headers: { 'x-user-id': 'gateway-user' } }).context,
      ),
    ).toBe(true);
    expect(
      userGuard.canActivate(
        buildExecutionContext({
          user: { id: 'user-1', email: 'user@example.com', roles: ['user'] },
        }).context,
      ),
    ).toBe(true);
  });

  it('skips role and permission checks when metadata is empty', () => {
    const { reflector, context } = buildExecutionContext({
      user: { id: 'user-1', email: 'user@example.com', roles: ['user'] },
    });

    expect(new RolesGuard(reflector).canActivate(context)).toBe(true);
    expect(new PermissionsGuard(reflector).canActivate(context)).toBe(true);
  });

  it('throws when permissions are missing', () => {
    const { reflector, context } = buildExecutionContext({
      user: {
        id: 'user-1',
        email: 'user@example.com',
        roles: ['user'],
        permissions: ['ticket:read'],
      },
      requiredPermissions: ['ticket:write'],
    });

    expect(() => new PermissionsGuard(reflector).canActivate(context)).toThrow(ForbiddenException);
  });
});
