import { Stack, Text } from '@novadesk/ui';
import Link from 'next/link';
import { AppLink } from '@/components/app-link';
import { getAppUrls } from '@/lib/app-urls';

export function HeroSection() {
  const urls = getAppUrls();

  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/25 via-slate-950 to-slate-950"
        aria-hidden
      />
      <div className="relative mx-auto max-w-4xl">
        <Text
          as="p"
          size="sm"
          weight="medium"
          className="mb-4 uppercase tracking-widest !text-blue-400"
        >
          Software Engineer · Full Stack · Backend
        </Text>
        <Text
          as="h1"
          size="2xl"
          weight="bold"
          className="text-balance text-4xl !text-white sm:text-5xl lg:text-6xl"
        >
          Production software, documented architecture, live deployment.
        </Text>
        <Text as="p" size="lg" tone="muted" className="mt-6 max-w-2xl !text-slate-400">
          I am Li Hong. NovaDesk is my engineering portfolio — a monorepo with microservices, shared
          packages, CI/CD, and four live applications behind a single API gateway. It demonstrates
          how I design, build, and operate production-ready systems.
        </Text>

        <Stack gap="md" className="mt-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-500"
            >
              About the Engineer
            </Link>
            <Link
              href="/engineering"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/50 px-6 py-3 text-base font-medium text-white transition-colors hover:border-slate-600 hover:bg-slate-900"
            >
              Engineering docs
            </Link>
            <AppLink
              href={urls.helpdesk}
              className="inline-flex items-center justify-center rounded-full border border-slate-700 px-6 py-3 text-base font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
            >
              Open live demo
            </AppLink>
          </div>
          <Text as="p" size="sm" tone="muted" className="!text-slate-500">
            Reviewer path: About → Engineering → Case Studies → Live demo — under three clicks.
          </Text>
        </Stack>
      </div>
    </section>
  );
}
