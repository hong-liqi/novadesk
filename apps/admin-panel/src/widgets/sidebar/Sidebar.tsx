'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { routes } from '@/shared/lib/routes';

const navItems = [
  { href: routes.dashboard, label: 'Dashboard' },
  { href: routes.tenants, label: 'Tenants' },
  { href: routes.users, label: 'Users' },
  { href: routes.settings, label: 'Settings' },
  { href: routes.audit, label: 'Audit' },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin navigation" className="flex h-full flex-col gap-1 p-4">
      <div className="mb-6 px-2">
        <span className="text-lg font-semibold text-neutral-900">Admin Portal</span>
      </div>
      <ul className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== routes.dashboard && pathname.startsWith(item.href));

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
