'use client';

import { useAuth } from '@portfolio/auth/client';
import { Button } from '@portfolio/ui';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { routes } from '@/shared/lib/routes';

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = useCallback(() => {
    logout();
    setMenuOpen(false);
    router.replace(routes.login);
  }, [logout, router]);

  return (
    <div className="flex w-full items-center justify-between gap-4">
      <div>
        <h1 className="text-base font-semibold text-neutral-900">Portfolio OS</h1>
        <p className="text-xs text-neutral-500">Platform administration</p>
      </div>

      <div className="relative" ref={menuRef}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setMenuOpen((open) => !open);
          }}
        >
          {user?.email ?? 'Account'}
        </Button>
        {menuOpen ? (
          <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-neutral-200 bg-white py-1 shadow-md">
            <div className="border-b border-neutral-100 px-3 py-2 text-xs text-neutral-500">
              {user?.roles.join(', ')}
            </div>
            <button
              type="button"
              className="block w-full px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
              onClick={handleLogout}
            >
              Sign out
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
