'use client';

import { useAuth } from '@novadesk/auth/client';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { routes } from '@/shared/lib/routes';

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(routes.home);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-neutral-500">Loading…</div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return children;
}
