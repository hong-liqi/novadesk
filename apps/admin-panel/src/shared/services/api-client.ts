import type { ApiResponse } from '@novadesk/shared';
import {
  createAuthClient,
  createSdkClient,
  type AuthClient,
  type RequestInterceptor,
} from '@novadesk/sdk';
import { createTokenManager, type TokenManager } from '@novadesk/auth/client';

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

const novadeskClient = createSdkClient({
  baseUrl: API_BASE_URL,
  requestInterceptors: [authTokenInterceptor()],
});

export const authClient: AuthClient = createAuthClient(novadeskClient);

function extractData<T>(response: ApiResponse<T>): T {
  return response.data;
}

export const tenantsClient = {
  list(): Promise<Tenant[]> {
    return novadeskClient.get<Tenant[]>('/tenants').then(extractData);
  },

  get(id: string): Promise<Tenant> {
    return novadeskClient.get<Tenant>(`/tenants/${id}`).then(extractData);
  },

  create(input: CreateTenantInput): Promise<Tenant> {
    return novadeskClient.post<Tenant>('/tenants', input).then(extractData);
  },

  update(id: string, input: UpdateTenantInput): Promise<Tenant> {
    return novadeskClient.patch<Tenant>(`/tenants/${id}`, input).then(extractData);
  },

  delete(id: string): Promise<{ success: true }> {
    return novadeskClient.delete<{ success: true }>(`/tenants/${id}`).then(extractData);
  },
};

export async function fetchPlatformHealth(): Promise<HealthCheckResult> {
  const response = await novadeskClient.get<HealthCheckResult>('/health');
  return extractData(response);
}

export { API_BASE_URL };
