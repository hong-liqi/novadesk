'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AuthUser } from '../types/jwt-payload';
import { createTokenManager, type RefreshHandler, type TokenManager } from './token-manager';

export interface AuthProviderProps {
  children: ReactNode;
  tokenManager?: TokenManager;
  refreshHandler: RefreshHandler;
  fetchUser: (accessToken: string) => Promise<AuthUser>;
  initialUser?: AuthUser | null;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  login: (tokens: {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
    tokenType: 'Bearer';
  }) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
  tokenManager: tokenManagerProp,
  refreshHandler,
  fetchUser,
  initialUser = null,
}: AuthProviderProps) {
  const tokenManager = useMemo(() => tokenManagerProp ?? createTokenManager(), [tokenManagerProp]);
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(tokenManager.getAccessToken());

  const hydrateUser = useCallback(
    async (token: string | null) => {
      if (!token) {
        setUser(null);
        setAccessToken(null);
        return;
      }

      const profile = await fetchUser(token);
      setUser(profile);
      setAccessToken(token);
    },
    [fetchUser],
  );

  useEffect(() => {
    tokenManager.setRefreshHandler(refreshHandler);
  }, [tokenManager, refreshHandler]);

  useEffect(() => {
    const activeRef = { current: true };

    void (async () => {
      try {
        const token = await tokenManager.ensureAccessToken();
        if (!activeRef.current) {
          return;
        }
        await hydrateUser(token);
      } finally {
        if (activeRef.current) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      activeRef.current = false;
    };
  }, [tokenManager, hydrateUser]);

  const login = useCallback(
    async (tokens: {
      accessToken: string;
      refreshToken?: string;
      expiresIn: number;
      tokenType: 'Bearer';
    }) => {
      tokenManager.setTokens(tokens);
      await hydrateUser(tokens.accessToken);
    },
    [tokenManager, hydrateUser],
  );

  const logout = useCallback(() => {
    tokenManager.clearTokens();
    setUser(null);
    setAccessToken(null);
  }, [tokenManager]);

  const refresh = useCallback(async () => {
    const token = await tokenManager.refreshAccessToken();
    await hydrateUser(token);
    return token;
  }, [tokenManager, hydrateUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      accessToken,
      login,
      logout,
      refresh,
    }),
    [user, isLoading, accessToken, login, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
