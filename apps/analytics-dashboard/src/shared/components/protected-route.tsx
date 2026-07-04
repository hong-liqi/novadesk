'use client';

import { useAuth } from '@portfolio/auth/client';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { routes } from '@/shared/lib/routes';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(routes.login);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-neutral-500">
        Loading session…
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}
