import type { Metadata } from 'next';
import { DocPageLayout } from '@/components/doc-page-layout';
import { loadDocMarkdown } from '@/lib/docs-loader';

export const metadata: Metadata = {
  title: 'Monorepo Structure',
  description: 'NovaDesk monorepo layout — packages, services, apps, and dependency boundaries.',
};

export default function MonorepoPage() {
  const markdown = loadDocMarkdown('15-Monorepo-Structure.md');

  return (
    <DocPageLayout
      title="Monorepo Structure"
      subtitle="Physical repository layout, workspace naming, and package boundaries."
      markdown={markdown ?? undefined}
    >
      {!markdown ? <p className="text-slate-400">Monorepo documentation not found.</p> : null}
    </DocPageLayout>
  );
}
