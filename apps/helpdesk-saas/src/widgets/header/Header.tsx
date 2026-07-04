'use client';

import { useAuth } from '@novadesk/auth/client';
import { Button } from '@novadesk/ui';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { routes } from '@/shared/lib/routes';
import { useWorkspace } from '@/shared/hooks/use-workspace';

export function Header() {
  const { user, logout } = useAuth();
  const { workspace, workspaces, workspaceId, setWorkspaceId } = useWorkspace();
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
      <div className="flex items-center gap-3">
        <h1 className="text-base font-semibold text-neutral-900">
          {workspace?.name ?? 'Workspace'}
        </h1>
        {workspaces.length > 1 ? (
          <select
            aria-label="Switch workspace"
            className="rounded-lg border border-neutral-200 bg-white px-2 py-1 text-sm text-neutral-700"
            value={workspaceId ?? ''}
            onChange={(event) => {
              setWorkspaceId(event.target.value);
            }}
          >
            {workspaces.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        ) : null}
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
              {user?.email}
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
