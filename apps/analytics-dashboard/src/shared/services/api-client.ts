import {
  createAnalyticsClient,
  createAuthClient,
  createHelpdeskClient,
  createLazyClient,
  createSdkClient,
  getApiBaseUrl,
  type AnalyticsClient,
  type AuthClient,
  type HelpdeskClient,
  type NovaDeskClient,
  type RequestInterceptor,
} from '@novadesk/sdk';
import { TENANT_ID_HEADER } from '@novadesk/shared';
import { createTokenManager, type TokenManager } from '@novadesk/auth/client';

let tenantId: string | null = null;

export function setApiTenantId(id: string | null): void {
  tenantId = id;
}

export function getApiTenantId(): string | null {
  return tenantId;
}

export const tokenManager: TokenManager = createTokenManager({
  storageKey: 'analytics.auth.tokens',
});

function tenantIdInterceptor(): RequestInterceptor {
  return (context) => {
    if (!tenantId) {
      return context;
    }

    return {
      ...context,
      headers: {
        ...context.headers,
        [TENANT_ID_HEADER]: tenantId,
      },
    };
  };
}

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
let helpdeskClientInstance: HelpdeskClient | undefined;
let analyticsClientInstance: AnalyticsClient | undefined;

function getNovadeskClient(): NovaDeskClient {
  novadeskClient ??= createSdkClient({
    baseUrl: getApiBaseUrl(),
    requestInterceptors: [authTokenInterceptor(), tenantIdInterceptor()],
  });
  return novadeskClient;
}

function getAuthClient(): AuthClient {
  authClientInstance ??= createAuthClient(getNovadeskClient());
  return authClientInstance;
}

function getHelpdeskClient(): HelpdeskClient {
  helpdeskClientInstance ??= createHelpdeskClient(getNovadeskClient());
  return helpdeskClientInstance;
}

function getAnalyticsClient(): AnalyticsClient {
  analyticsClientInstance ??= createAnalyticsClient(getNovadeskClient());
  return analyticsClientInstance;
}

export const authClient: AuthClient = createLazyClient(getAuthClient);

export const helpdeskClient: HelpdeskClient = createLazyClient(getHelpdeskClient);

export const analyticsClient: AnalyticsClient = createLazyClient(getAnalyticsClient);

export function getConfiguredApiBaseUrl(): string {
  return getApiBaseUrl();
}
