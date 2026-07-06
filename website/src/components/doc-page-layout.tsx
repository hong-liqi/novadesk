import { Stack, Surface, Text } from '@novadesk/ui';
import Link from 'next/link';
import { MarkdownContent } from '@/components/markdown-content';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

interface DocPageLayoutProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  children?: React.ReactNode;
  markdown?: string;
}

export function DocPageLayout({
  title,
  subtitle,
  backHref = '/engineering',
  backLabel = '← Back to Engineering',
  children,
  markdown,
}: DocPageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      <SiteHeader />
      <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href={backHref}
            className="mb-8 inline-flex text-sm text-blue-400 transition-colors hover:text-blue-300"
          >
            {backLabel}
          </Link>
          <Stack gap="sm" className="mb-8">
            <Text as="h1" size="2xl" weight="bold" className="!text-white">
              {title}
            </Text>
            {subtitle ? (
              <Text as="p" tone="muted" className="!text-slate-400">
                {subtitle}
              </Text>
            ) : null}
          </Stack>
          {markdown ? <MarkdownContent content={markdown} /> : children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

interface EngineeringIndexCardProps {
  href: string;
  title: string;
  description: string;
}

export function EngineeringIndexCard({ href, title, description }: EngineeringIndexCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <Surface
        variant="outline"
        padding="lg"
        className="h-full border-slate-800 bg-slate-900/50 transition-colors group-hover:border-slate-600 group-hover:bg-slate-900/80"
      >
        <Text
          as="h3"
          size="lg"
          weight="semibold"
          className="mb-2 !text-white group-hover:text-blue-300"
        >
          {title}
        </Text>
        <Text as="p" size="sm" tone="muted" className="!text-slate-400">
          {description}
        </Text>
      </Surface>
    </Link>
  );
}
