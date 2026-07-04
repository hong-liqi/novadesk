'use client';

import { AuthProvider } from '@novadesk/auth/client';
import type { AuthUser } from '@novadesk/auth/types';
import { useCallback, type ReactNode } from 'react';
import { authClient, tokenManager } from '@/shared/services';
import { WorkspaceProvider } from './workspace-provider';

interface AppProvidersProps {
  children: ReactNode;
}

async function fetchAuthUser(_accessToken: string): Promise<AuthUser> {
  const profile = await authClient.me();
  const primaryTenant = profile.tenants[0];

  return {
    id: profile.id,
    email: profile.email,
    roles: primaryTenant ? [primaryTenant.role as AuthUser['roles'][number]] : [],
    tenantId: primaryTenant?.id,
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
      <WorkspaceProvider>{children}</WorkspaceProvider>
    </AuthProvider>
  );
}
