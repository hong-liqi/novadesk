'use client';

import { useAuth } from '@novadesk/auth/client';
import { ROLES } from '@novadesk/shared';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { routes } from '@/shared/lib/routes';

const ADMIN_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN] as const;

interface AdminProtectedRouteProps {
  children: ReactNode;
}

function hasAdminAccess(roles: readonly string[]): boolean {
  return ADMIN_ROLES.some((role) => roles.includes(role));
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace(routes.login);
      return;
    }

    if (user && !hasAdminAccess(user.roles)) {
      router.replace(routes.login);
    }
  }, [isAuthenticated, isLoading, router, user]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-neutral-500">
        Loading session…
      </div>
    );
  }

  if (!isAuthenticated || !user || !hasAdminAccess(user.roles)) {
    return null;
  }

  return children;
}
