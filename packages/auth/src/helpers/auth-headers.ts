import type { Role } from '@novadesk/shared';
import type { AuthRequest, AuthUser, JwtPayload } from '../types';

export function normalizeHeaderValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function splitCsvHeader(value: string | string[] | undefined): string[] {
  const normalized = normalizeHeaderValue(value);
  if (!normalized) {
    return [];
  }

  return normalized
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseBearerToken(value: string | string[] | undefined): string | undefined {
  const header = normalizeHeaderValue(value);
  if (!header) {
    return undefined;
  }

  const [scheme, token] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return undefined;
  }

  return token;
}

export function normalizeRoles(value: string | string[] | undefined): Role[] {
  return splitCsvHeader(value) as Role[];
}

export function normalizePermissions(value: string | string[] | undefined): string[] {
  return splitCsvHeader(value);
}

export function buildAuthUser(payload: JwtPayload): AuthUser {
  return {
    id: payload.sub,
    email: payload.email,
    roles: payload.roles,
    permissions: payload.permissions,
    tenantId: payload.tenantId,
  };
}

export function extractRequestIdentity(request: AuthRequest): AuthUser | undefined {
  if (request.user) {
    return request.user;
  }

  const userId = normalizeHeaderValue(request.headers['x-user-id']);
  if (!userId) {
    return undefined;
  }

  return {
    id: userId,
    email: normalizeHeaderValue(request.headers['x-user-email']) ?? userId,
    roles: normalizeRoles(request.headers['x-roles']),
    permissions: normalizePermissions(request.headers['x-permissions']),
    tenantId: normalizeHeaderValue(request.headers['x-tenant-id']),
  };
}
