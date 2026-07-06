import type { ApiResponse } from '@novadesk/shared';
import {
  createAuthClient,
  createLazyClient,
  createSdkClient,
  getApiBaseUrl,
  type AuthClient,
  type NovaDeskClient,
  type RequestInterceptor,
} from '@novadesk/sdk';
import { createTokenManager, type TokenManager } from '@novadesk/auth/client';

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

let novadeskClient: NovaDeskClient | undefined;
let authClientInstance: AuthClient | undefined;

function getNovadeskClient(): NovaDeskClient {
  novadeskClient ??= createSdkClient({
    baseUrl: getApiBaseUrl(),
    requestInterceptors: [authTokenInterceptor()],
  });
  return novadeskClient;
}

function getAuthClient(): AuthClient {
  authClientInstance ??= createAuthClient(getNovadeskClient());
  return authClientInstance;
}

export const authClient: AuthClient = createLazyClient(getAuthClient);

function extractData<T>(response: ApiResponse<T>): T {
  return response.data;
}

export const tenantsClient = {
  list(): Promise<Tenant[]> {
    return getNovadeskClient().get<Tenant[]>('/tenants').then(extractData);
  },

  get(id: string): Promise<Tenant> {
    return getNovadeskClient().get<Tenant>(`/tenants/${id}`).then(extractData);
  },

  create(input: CreateTenantInput): Promise<Tenant> {
    return getNovadeskClient().post<Tenant>('/tenants', input).then(extractData);
  },

  update(id: string, input: UpdateTenantInput): Promise<Tenant> {
    return getNovadeskClient().patch<Tenant>(`/tenants/${id}`, input).then(extractData);
  },

  delete(id: string): Promise<{ success: true }> {
    return getNovadeskClient().delete<{ success: true }>(`/tenants/${id}`).then(extractData);
  },
};

export async function fetchPlatformHealth(): Promise<HealthCheckResult> {
  const response = await getNovadeskClient().get<HealthCheckResult>('/health');
  return extractData(response);
}

export const settingsClient = {
  getContactEmail(): Promise<string | null> {
    return getNovadeskClient()
      .get<{ contactEmail: string | null }>('/settings/contact-email')
      .then((response) => response.data.contactEmail);
  },

  updateContactEmail(contactEmail: string): Promise<string> {
    return getNovadeskClient()
      .patch<{ contactEmail: string }>('/settings/contact-email', { contactEmail })
      .then((response) => response.data.contactEmail);
  },
};

export function getConfiguredApiBaseUrl(): string {
  return getApiBaseUrl();
}
