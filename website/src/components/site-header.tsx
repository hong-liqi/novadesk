import { Text } from '@portfolio/ui';
import Link from 'next/link';

const NAV_LINKS = [
  { href: '#projects', label: 'Projects' },
  { href: '#case-studies', label: 'Case Studies' },
  { href: '#contact', label: 'Contact' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            PO
          </span>
          <Text
            as="span"
            size="lg"
            weight="semibold"
            className="text-white group-hover:text-blue-300"
          >
            Portfolio OS
          </Text>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/helpdesk"
            className="hidden rounded-full px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:text-white sm:inline-flex"
          >
            HelpDesk
          </Link>
          <Link
            href="/admin"
            className="inline-flex rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          >
            Open Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
