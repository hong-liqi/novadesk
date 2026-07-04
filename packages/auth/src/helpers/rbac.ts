import type { Role } from '@portfolio/shared';
import type { AuthUser } from '../types';

export function hasRole(user: AuthUser | undefined, requiredRoles: Role[]): boolean {
  if (!user) {
    return false;
  }

  if (requiredRoles.length === 0) {
    return true;
  }

  return requiredRoles.some((role) => user.roles.includes(role));
}

export function hasPermission(user: AuthUser | undefined, requiredPermissions: string[]): boolean {
  if (!user) {
    return false;
  }

  if (requiredPermissions.length === 0) {
    return true;
  }

  const permissions = user.permissions ?? [];
  return requiredPermissions.some((permission) => permissions.includes(permission));
}
