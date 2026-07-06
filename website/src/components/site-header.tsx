'use client';

import { Text } from '@novadesk/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { AppLink } from '@/components/app-link';
import { getAppUrls } from '@/lib/app-urls';
import { PRIMARY_NAV } from '@/lib/navigation';

export function SiteHeader() {
  const urls = getAppUrls();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href.startsWith('/#')) return pathname === '/';
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-bold text-white shadow-lg shadow-blue-900/30">
            LH
          </span>
          <div className="flex flex-col">
            <Text as="span" size="sm" weight="semibold" className="leading-tight text-white">
              Li Hong
            </Text>
            <Text as="span" size="xs" tone="muted" className="leading-tight !text-slate-500">
              NovaDesk
            </Text>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {PRIMARY_NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <AppLink
            href={urls.helpdesk}
            className="hidden rounded-md px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:text-white md:inline-flex"
          >
            Demo
          </AppLink>
          <Link
            href="/about"
            className="hidden rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 sm:inline-flex"
          >
            About
          </Link>
          <button
            type="button"
            className="inline-flex rounded-md p-2 text-slate-400 hover:bg-slate-900 hover:text-white lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span className="sr-only">Toggle menu</span>
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <nav
          id="mobile-nav"
          className="border-t border-slate-800 bg-slate-950 px-4 py-4 lg:hidden"
          aria-label="Mobile"
        >
          <ul className="space-y-1">
            {PRIMARY_NAV.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900 hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/about"
                className="block rounded-md px-3 py-2 text-sm font-medium text-blue-400 hover:bg-slate-900"
                onClick={() => setMobileOpen(false)}
              >
                About the Engineer
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
