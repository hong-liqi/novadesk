import { ROLES } from '@novadesk/shared';
import { hasPermission, hasRole } from './rbac';

describe('rbac helpers', () => {
  const user = {
    id: 'user-1',
    email: 'user@example.com',
    roles: [ROLES.ADMIN],
    permissions: ['ticket:read'],
  };

  it('evaluates roles', () => {
    expect(hasRole(user, [ROLES.ADMIN])).toBe(true);
    expect(hasRole(user, [])).toBe(true);
    expect(hasRole(undefined, [ROLES.ADMIN])).toBe(false);
    expect(hasRole(user, [ROLES.USER])).toBe(false);
  });

  it('evaluates permissions', () => {
    expect(hasPermission(user, ['ticket:read'])).toBe(true);
    expect(hasPermission(user, [])).toBe(true);
    expect(hasPermission(undefined, ['ticket:read'])).toBe(false);
    expect(hasPermission({ ...user, permissions: undefined }, ['ticket:read'])).toBe(false);
  });
});
