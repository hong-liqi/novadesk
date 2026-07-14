import type { User, UserTenantMembership } from '@novadesk/shared';
import type { ApiResponse } from '@novadesk/shared';
import type { NovaDeskClient } from '../client';
import { SdkError } from '../errors';

export interface LoginInput {
  email: string;
  password: string;
  tenantId?: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
  tenantSlug?: string;
}

export interface AuthTokens {
  accessToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface RefreshInput {
  refreshToken: string;
}

export interface LogoutInput {
  refreshToken?: string;
}

export interface MeResponse {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  tenants: UserTenantMembership[];
}

export interface SetupStatus {
  needsBootstrap: boolean;
}

export class AuthClient {
  constructor(private readonly client: NovaDeskClient) {}

  login(input: LoginInput): Promise<AuthTokens> {
    return this.client
      .post<AuthTokens>('/auth/login', input)
      .then((response) => unwrapAuthTokens(response));
  }

  register(input: RegisterInput): Promise<AuthTokens> {
    return this.client
      .post<AuthTokens>('/auth/register', input)
      .then((response) => unwrapAuthTokens(response));
  }

  getSetupStatus(): Promise<SetupStatus> {
    return this.client.get<SetupStatus>('/auth/setup').then((response) => unwrapPayload(response));
  }

  refresh(input: RefreshInput): Promise<AuthTokens> {
    return this.client
      .post<AuthTokens>('/auth/refresh', input)
      .then((response) => unwrapAuthTokens(response));
  }

  logout(input: LogoutInput = {}): Promise<{ success: true }> {
    return this.client
      .post<{ success: true }>('/auth/logout', input)
      .then((response) => unwrapPayload(response));
  }

  me(): Promise<MeResponse> {
    return this.client.get<MeResponse>('/auth/me').then((response) => unwrapPayload(response));
  }

  toAuthUser(profile: MeResponse): User {
    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      emailVerified: profile.emailVerified,
      tenantId: profile.tenants[0]?.id,
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
    };
  }
}

export function createAuthClient(client: NovaDeskClient): AuthClient {
  return new AuthClient(client);
}

function isEnvelope(value: unknown): value is ApiResponse<unknown> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if (!('data' in value) || !('meta' in value)) {
    return false;
  }

  const meta = (value as { meta: unknown }).meta;
  return typeof meta === 'object' && meta !== null;
}

function unwrapPayload<T>(value: ApiResponse<T> | T): T {
  if (isEnvelope(value)) {
    return value.data;
  }
  return value;
}

/** Accepts ApiResponse, bare tokens, or accidental double-wrapping. */
export function unwrapAuthTokens(value: unknown): AuthTokens {
  if (isAuthTokens(value)) {
    return {
      accessToken: value.accessToken,
      expiresIn: value.expiresIn,
      tokenType: 'Bearer',
    };
  }

  if (typeof value === 'object' && value !== null && 'data' in value) {
    return unwrapAuthTokens(value.data);
  }

  throw new SdkError(
    'Authentication succeeded but the response did not include an access token.',
    'INVALID_AUTH_RESPONSE',
    502,
  );
}

function isAuthTokens(value: unknown): value is AuthTokens {
  return (
    typeof value === 'object' &&
    value !== null &&
    'accessToken' in value &&
    typeof (value as AuthTokens).accessToken === 'string' &&
    (value as AuthTokens).accessToken.length > 0 &&
    'expiresIn' in value &&
    typeof (value as AuthTokens).expiresIn === 'number'
  );
}
