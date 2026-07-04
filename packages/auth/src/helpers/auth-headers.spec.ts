import { ROLES } from '@portfolio/shared';
import { buildAuthUser, extractRequestIdentity, parseBearerToken } from './auth-headers';

describe('auth headers helpers', () => {
  it('parses bearer tokens', () => {
    expect(parseBearerToken('Bearer abc.def.ghi')).toBe('abc.def.ghi');
    expect(parseBearerToken('Basic token')).toBeUndefined();
  });

  it('builds auth users from jwt payloads', () => {
    const user = buildAuthUser({
      sub: 'user-1',
      email: 'user@example.com',
      roles: ['user'],
      permissions: ['ticket:create'],
      iat: 1,
      exp: 2,
      jti: 'jti-1',
    });

    expect(user.id).toBe('user-1');
    expect(user.permissions).toEqual(['ticket:create']);
  });

  it('extracts request identity from headers', () => {
    const identity = extractRequestIdentity({
      headers: {
        'x-user-id': 'user-1',
        'x-user-email': 'user@example.com',
        'x-roles': 'admin,user',
      },
    });

    expect(identity?.id).toBe('user-1');
    expect(identity?.roles).toEqual(['admin', 'user']);
  });

  it('returns existing request users and handles array headers', () => {
    const existing = {
      id: 'user-2',
      email: 'existing@example.com',
      roles: [ROLES.USER],
    };

    expect(extractRequestIdentity({ headers: {}, user: existing })).toBe(existing);
    expect(
      extractRequestIdentity({
        headers: {
          'x-user-id': ['user-3'],
          'x-permissions': 'ticket:update,ticket:delete',
        },
      })?.permissions,
    ).toEqual(['ticket:update', 'ticket:delete']);
  });
});
