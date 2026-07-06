import {
  createAuthClient,
  createHelpdeskClient,
  createLazyClient,
  createSdkClient,
  getApiBaseUrl,
  getGatewayOrigin,
  type AuthClient,
  type HelpdeskTicket,
  type HelpdeskClient,
  type NovaDeskClient,
  type RequestInterceptor,
} from '@novadesk/sdk';
import { TENANT_ID_HEADER } from '@novadesk/shared';
import { createTokenManager, type TokenManager } from '@novadesk/auth/client';

export const tokenManager: TokenManager = createTokenManager({
  storageKey: 'chat.auth.tokens',
});

let tenantId: string | null = null;

export function setApiTenantId(id: string | null): void {
  tenantId = id;
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

export const authClient: AuthClient = createLazyClient(getAuthClient);
export const helpdeskClient: HelpdeskClient = createLazyClient(getHelpdeskClient);

export { getGatewayOrigin };

export interface ChatMessage {
  id: string;
  ticketId: string;
  userId: string;
  body: string;
  createdAt: string;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isTicketUuid(value: string): boolean {
  return UUID_PATTERN.test(value.trim());
}

export async function fetchChatHistory(ticketId: string): Promise<ChatMessage[]> {
  const token = await tokenManager.ensureAccessToken();
  const response = await fetch(`${getApiBaseUrl()}/chat/rooms/${ticketId}/messages`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    throw new Error('Failed to load chat history');
  }

  return response.json() as Promise<ChatMessage[]>;
}

export async function loadOpenTickets(): Promise<HelpdeskTicket[]> {
  const profile = await authClient.me();
  const primaryTenant = profile.tenants[0];
  if (!primaryTenant) {
    return [];
  }

  setApiTenantId(primaryTenant.id);
  const result = await helpdeskClient.listTickets({ limit: 20, statuses: ['OPEN', 'PENDING'] });
  return result.items;
}

export function getConfiguredApiBaseUrl(): string {
  return getApiBaseUrl();
}
