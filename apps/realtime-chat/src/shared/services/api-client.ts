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

export const tokenManager: TokenManager = createTokenManager({
  storageKey: 'chat.auth.tokens',
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

export function getGatewayOrigin(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return process.env.NEXT_PUBLIC_GATEWAY_URL ?? 'http://localhost';
}

export interface ChatMessage {
  id: string;
  ticketId: string;
  userId: string;
  body: string;
  createdAt: string;
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

export function getConfiguredApiBaseUrl(): string {
  return getApiBaseUrl();
}
