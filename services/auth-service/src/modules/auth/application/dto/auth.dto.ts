export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
  tenantSlug?: string;
}

export interface LoginDto {
  email: string;
  password: string;
  tenantId?: string;
}

export interface RefreshDto {
  refreshToken?: string;
}

export interface LogoutDto {
  refreshToken?: string;
}

export interface AuthTokensResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface SetupStatusResponse {
  needsBootstrap: boolean;
}

export interface MeResponse {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  tenants: {
    id: string;
    name: string;
    slug: string;
    role: string;
  }[];
}
