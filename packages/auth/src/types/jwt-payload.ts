import type { Role } from '@portfolio/shared';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: Role[];
  tenantId?: string;
  scope?: string[];
  iat: number;
  exp: number;
  jti: string;
}

export interface AuthUser {
  id: string;
  email: string;
  roles: Role[];
  tenantId?: string;
}
