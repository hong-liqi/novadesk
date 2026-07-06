import { Stack, Text } from '@novadesk/ui';
import { AppLink } from '@/components/app-link';
import { getAppUrls } from '@/lib/app-urls';

export function HeroSection() {
  const urls = getAppUrls();
  const ctaLinks = [
    { href: urls.helpdesk, label: 'HelpDesk SaaS', description: 'Ticket management & SLA' },
    { href: urls.analytics, label: 'Analytics', description: 'KPIs & reports' },
    { href: urls.admin, label: 'Admin Portal', description: 'Platform control' },
  ];
  const codeLink = urls.code
    ? {
        href: urls.code,
        label: 'View Code',
        description: 'Repository and source code',
      }
    : null;
  const visibleLinks = codeLink ? [...ctaLinks, codeLink] : ctaLinks;

  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950 to-slate-950"
        aria-hidden
      />
      <div className="relative mx-auto max-w-4xl text-center">
        <Text
          as="p"
          size="sm"
          weight="medium"
          className="mb-4 uppercase tracking-widest !text-blue-400"
        >
          NovaDesk
        </Text>
        <Text
          as="h1"
          size="2xl"
          weight="bold"
          className="text-balance text-4xl !text-white sm:text-5xl lg:text-6xl"
        >
          Integrated engineering ecosystem
        </Text>
        <Text as="p" size="lg" tone="muted" className="mx-auto mt-6 max-w-2xl !text-slate-400">
          A production-grade monorepo with microservices, full-stack apps, shared packages, and
          DevOps — built to demonstrate senior-level software architecture.
        </Text>

        <Stack gap="md" className="mx-auto mt-10 max-w-2xl">
          <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap">
            {visibleLinks.map((link) => (
              <AppLink
                key={link.label}
                href={link.href}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-500 sm:flex-initial"
              >
                {link.label}
              </AppLink>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
            {visibleLinks.map((link) => (
              <span key={link.label}>
                <span className="font-medium text-slate-400">{link.label}</span>
                {' — '}
                {link.description}
              </span>
            ))}
          </div>
        </Stack>
      </div>
    </section>
  );
}
