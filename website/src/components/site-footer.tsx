import { Text } from '@novadesk/ui';
import Link from 'next/link';
import { AppLink } from '@/components/app-link';
import { getAppUrls } from '@/lib/app-urls';
import { ENGINEER_LINKS, FOOTER_NAV } from '@/lib/navigation';

export function SiteFooter() {
  const urls = getAppUrls();
  const demoLinks = [
    { href: urls.helpdesk, label: 'HelpDesk' },
    { href: urls.analytics, label: 'Analytics' },
    { href: urls.chat, label: 'Chat' },
    { href: urls.admin, label: 'Admin' },
  ];

  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Text as="p" size="sm" weight="semibold" className="text-white">
              Li Hong
            </Text>
            <Text as="p" size="sm" tone="muted" className="mt-2 !text-slate-400">
              Software Engineer — production systems, monorepo architecture, and full-stack
              delivery.
            </Text>
          </div>

          <nav aria-label="Site">
            <Text
              as="p"
              size="xs"
              weight="semibold"
              className="mb-3 uppercase tracking-wider !text-slate-500"
            >
              Site
            </Text>
            <ul className="space-y-2">
              {FOOTER_NAV.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Live demo">
            <Text
              as="p"
              size="xs"
              weight="semibold"
              className="mb-3 uppercase tracking-wider !text-slate-500"
            >
              Live demo
            </Text>
            <ul className="space-y-2">
              {demoLinks.map((link) => (
                <li key={link.label}>
                  <AppLink
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </AppLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Connect">
            <Text
              as="p"
              size="xs"
              weight="semibold"
              className="mb-3 uppercase tracking-wider !text-slate-500"
            >
              Connect
            </Text>
            <ul className="space-y-2">
              <li>
                <a
                  href={ENGINEER_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={ENGINEER_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={ENGINEER_LINKS.resume}
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  Resume (PDF)
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Text as="p" size="xs" tone="muted" className="!text-slate-500">
            © {new Date().getFullYear()} Li Hong. NovaDesk engineering portfolio.
          </Text>
          <Text as="p" size="xs" tone="muted" className="!text-slate-600">
            Built with Next.js, NestJS, PostgreSQL, Docker — documented and deployable.
          </Text>
        </div>
      </div>
    </footer>
  );
}
