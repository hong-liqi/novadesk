import type { Metadata } from 'next';
import Link from 'next/link';
import { DocPageLayout } from '@/components/doc-page-layout';
import { MarkdownContent } from '@/components/markdown-content';
import { Badge, Stack, Surface, Text } from '@novadesk/ui';
import { getAdrList, loadAdrMarkdown } from '@/lib/docs-loader';

export const metadata: Metadata = {
  title: 'Architecture Decision Records',
  description: 'NovaDesk ADRs — documented technology and architecture decisions with rationale.',
};

export default function DecisionsPage() {
  const adrs = getAdrList();

  return (
    <DocPageLayout
      title="Architecture Decision Records"
      subtitle="Formal record of significant technical decisions. Status: Accepted unless noted otherwise."
      backHref="/engineering"
      backLabel="← Back to Engineering"
    >
      <Stack gap="lg">
        <nav aria-label="ADR index" className="grid gap-3 sm:grid-cols-2">
          {adrs.map((adr) => (
            <a
              key={adr.slug}
              href={`#${adr.slug}`}
              className="block rounded-lg border border-slate-800 bg-slate-900/50 p-4 transition-colors hover:border-slate-600"
            >
              <Text as="p" size="sm" weight="semibold" className="!text-white">
                {adr.title}
              </Text>
              <div className="mt-2 flex gap-2">
                <Badge variant="accent">{adr.status}</Badge>
                <Text as="span" size="xs" tone="muted" className="!text-slate-500">
                  {adr.date}
                </Text>
              </div>
            </a>
          ))}
        </nav>

        {adrs.map((adr) => {
          const markdown = loadAdrMarkdown(adr.slug);
          if (!markdown) return null;

          return (
            <Surface
              key={adr.slug}
              variant="outline"
              padding="lg"
              className="scroll-mt-24 border-slate-800 bg-slate-900/30"
            >
              <div id={adr.slug}>
                <MarkdownContent content={markdown} />
              </div>
              <Link
                href="/engineering"
                className="mt-6 inline-block text-sm text-blue-400 hover:text-blue-300"
              >
                ↑ Back to Engineering index
              </Link>
            </Surface>
          );
        })}
      </Stack>
    </DocPageLayout>
  );
}
