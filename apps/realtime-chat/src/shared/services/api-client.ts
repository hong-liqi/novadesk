import {
  createAuthClient,
  createSdkClient,
  type AuthClient,
  type RequestInterceptor,
} from '@novadesk/sdk';
import { createTokenManager, type TokenManager } from '@novadesk/auth/client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api/v1';

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

const novadeskClient = createSdkClient({
  baseUrl: API_BASE_URL,
  requestInterceptors: [authTokenInterceptor()],
});

export const authClient: AuthClient = createAuthClient(novadeskClient);

export { API_BASE_URL };

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
  const response = await fetch(`${API_BASE_URL}/chat/rooms/${ticketId}/messages`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    throw new Error('Failed to load chat history');
  }

  return response.json() as Promise<ChatMessage[]>;
}
