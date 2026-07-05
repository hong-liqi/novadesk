import type { User, UserTenantMembership } from '@novadesk/shared';
import type { NovaDeskClient } from '../client';

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
    return this.client.post<AuthTokens>('/auth/login', input).then((response) => response.data);
  }

  register(input: RegisterInput): Promise<AuthTokens> {
    return this.client.post<AuthTokens>('/auth/register', input).then((response) => response.data);
  }

  getSetupStatus(): Promise<SetupStatus> {
    return this.client.get<SetupStatus>('/auth/setup').then((response) => response.data);
  }

  refresh(input: RefreshInput): Promise<AuthTokens> {
    return this.client.post<AuthTokens>('/auth/refresh', input).then((response) => response.data);
  }

  logout(input: LogoutInput = {}): Promise<{ success: true }> {
    return this.client
      .post<{ success: true }>('/auth/logout', input)
      .then((response) => response.data);
  }

  me(): Promise<MeResponse> {
    return this.client.get<MeResponse>('/auth/me').then((response) => response.data);
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
