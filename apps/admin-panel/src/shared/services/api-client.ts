import type { ApiResponse } from '@portfolio/shared';
import {
  createAuthClient,
  createSdkClient,
  type AuthClient,
  type RequestInterceptor,
} from '@portfolio/sdk';
import { createTokenManager, type TokenManager } from '@portfolio/auth/client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api/v1';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTenantInput {
  name: string;
  slug: string;
}

export interface UpdateTenantInput {
  name?: string;
  slug?: string;
  isActive?: boolean;
}

export interface HealthServiceStatus {
  status: string;
  message?: string;
}

export interface HealthCheckResult {
  status: 'ok' | 'error' | 'shutting_down';
  info?: Record<string, HealthServiceStatus>;
  error?: Record<string, HealthServiceStatus>;
  details?: Record<string, HealthServiceStatus>;
}

export const tokenManager: TokenManager = createTokenManager({
  storageKey: 'admin.auth.tokens',
});

function authTokenInterceptor(): RequestInterceptor {
  return async (context) => {
    const token = await tokenManager.ensureAccessToken();
    if (!token) {
      return context;
    }

    return {
      ...context,
      headers: {
        ...context.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  };
}

const portfolioClient = createSdkClient({
  baseUrl: API_BASE_URL,
  requestInterceptors: [authTokenInterceptor()],
});

export const authClient: AuthClient = createAuthClient(portfolioClient);

function extractData<T>(response: ApiResponse<T> | T): T {
  if (typeof response === 'object' && response !== null && 'data' in response) {
    return (response as ApiResponse<T>).data;
  }

  return response as T;
}

export const tenantsClient = {
  list(): Promise<Tenant[]> {
    return portfolioClient.get<Tenant[]>('/tenants').then(extractData);
  },

  get(id: string): Promise<Tenant> {
    return portfolioClient.get<Tenant>(`/tenants/${id}`).then(extractData);
  },

  create(input: CreateTenantInput): Promise<Tenant> {
    return portfolioClient.post<Tenant>('/tenants', input).then(extractData);
  },

  update(id: string, input: UpdateTenantInput): Promise<Tenant> {
    return portfolioClient.patch<Tenant>(`/tenants/${id}`, input).then(extractData);
  },

  delete(id: string): Promise<{ success: true }> {
    return portfolioClient.delete<{ success: true }>(`/tenants/${id}`).then(extractData);
  },
};

export async function fetchPlatformHealth(): Promise<HealthCheckResult> {
  const response = await portfolioClient.get<HealthCheckResult>('/health');
  const payload = extractData(response);

  if (typeof payload === 'object' && payload !== null && 'status' in payload) {
    return payload;
  }

  return response as unknown as HealthCheckResult;
}

export { API_BASE_URL };
