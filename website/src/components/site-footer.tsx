import { Text } from '@portfolio/ui';
import Link from 'next/link';

const FOOTER_LINKS = [
  { href: '/helpdesk', label: 'HelpDesk' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/admin', label: 'Admin' },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <Text as="p" size="sm" weight="semibold" className="text-white">
            Portfolio OS
          </Text>
          <Text as="p" size="sm" tone="muted" className="mt-1 max-w-md !text-slate-400">
            Production-grade monorepo demonstrating senior-level software architecture.
          </Text>
        </div>

        <nav className="flex flex-wrap gap-4" aria-label="Footer">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-400 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Text as="p" size="xs" tone="muted" className="!text-slate-500">
          © {new Date().getFullYear()} Portfolio OS. All rights reserved.
        </Text>
      </div>
    </footer>
  );
}
