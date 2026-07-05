'use client';

import { useAuth } from '@novadesk/auth/client';
import { Button } from '@novadesk/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { routes } from '@/shared/lib/routes';
import { authClient } from '@/shared/services';

export function BootstrapRegisterGate({ children }: Readonly<{ children: ReactNode }>) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [needsBootstrap, setNeedsBootstrap] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(routes.dashboard);
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    void authClient
      .getSetupStatus()
      .then((status) => {
        setNeedsBootstrap(status.needsBootstrap);
      })
      .catch(() => {
        setNeedsBootstrap(false);
      });
  }, []);

  if (isLoading || needsBootstrap === null) {
    return (
      <div className="flex min-h-screen items-center justify-center text-neutral-500">Loading…</div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  if (!needsBootstrap) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Administrator already configured
        </h1>
        <p className="max-w-md text-sm text-neutral-600">
          Platform administrator accounts are created during the initial setup. Sign in with an
          existing administrator account or ask your platform admin for access.
        </p>
        <Link href={routes.login}>
          <Button variant="primary">Go to sign in</Button>
        </Link>
      </main>
    );
  }

  return children;
}
