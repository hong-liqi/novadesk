import { Text } from '@novadesk/ui';
import { AppLink } from '@/components/app-link';
import { getAppUrls } from '@/lib/app-urls';

export function SiteFooter() {
  const urls = getAppUrls();
  const footerLinks = [
    { href: urls.helpdesk, label: 'HelpDesk' },
    { href: urls.analytics, label: 'Analytics' },
    { href: urls.admin, label: 'Admin' },
  ];

  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <Text as="p" size="sm" weight="semibold" className="text-white">
            NovaDesk
          </Text>
          <Text as="p" size="sm" tone="muted" className="mt-1 max-w-md !text-slate-400">
            Production-grade monorepo demonstrating senior-level software architecture.
          </Text>
        </div>

        <nav className="flex flex-wrap gap-4" aria-label="Footer">
          {footerLinks.map((link) => (
            <AppLink
              key={link.label}
              href={link.href}
              className="text-sm text-slate-400 transition-colors hover:text-white"
            >
              {link.label}
            </AppLink>
          ))}
        </nav>

        <Text as="p" size="xs" tone="muted" className="!text-slate-500">
          © {new Date().getFullYear()} NovaDesk. All rights reserved.
        </Text>
      </div>
    </footer>
  );
}
