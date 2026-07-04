'use client';

import { AuthProvider } from '@portfolio/auth/client';
import type { AuthUser } from '@portfolio/auth/types';
import { ROLES, type Role } from '@portfolio/shared';
import { useCallback, type ReactNode } from 'react';
import { authClient, tokenManager } from '@/shared/services';

interface AppProvidersProps {
  children: ReactNode;
}

async function fetchAuthUser(_accessToken: string): Promise<AuthUser> {
  const profile = await authClient.me();
  const roles = [
    ...new Set(profile.tenants.map((tenant) => tenant.role as Role)),
  ] as AuthUser['roles'];

  return {
    id: profile.id,
    email: profile.email,
    roles: roles.length > 0 ? roles : [ROLES.USER],
    tenantId: profile.tenants[0]?.id,
  };
}

export function AppProviders({ children }: AppProvidersProps) {
  const refreshHandler = useCallback(async (refreshToken: string) => {
    return authClient.refresh({ refreshToken });
  }, []);

  return (
    <AuthProvider
      tokenManager={tokenManager}
      refreshHandler={refreshHandler}
      fetchUser={fetchAuthUser}
    >
      {children}
    </AuthProvider>
  );
}
