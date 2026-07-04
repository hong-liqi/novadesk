import { TENANT_ID_HEADER } from '@portfolio/shared';
import {
  createAuthClient,
  createHelpdeskClient,
  createSdkClient,
  type AuthClient,
  type HelpdeskClient,
  type RequestInterceptor,
} from '@portfolio/sdk';
import { createTokenManager, type TokenManager } from '@portfolio/auth/client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api/v1';

let tenantId: string | null = null;

export function setApiTenantId(id: string | null): void {
  tenantId = id;
}

export function getApiTenantId(): string | null {
  return tenantId;
}

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

export const tokenManager: TokenManager = createTokenManager({
  storageKey: 'helpdesk.auth.tokens',
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
  requestInterceptors: [authTokenInterceptor(), tenantIdInterceptor()],
});

export const authClient: AuthClient = createAuthClient(portfolioClient);
export const helpdeskClient: HelpdeskClient = createHelpdeskClient(portfolioClient);

export { API_BASE_URL };
