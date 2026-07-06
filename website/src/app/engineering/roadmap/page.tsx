import type { Metadata } from 'next';
import { DocPageLayout } from '@/components/doc-page-layout';
import { loadDocMarkdown } from '@/lib/docs-loader';

export const metadata: Metadata = {
  title: 'Roadmap',
  description: 'NovaDesk delivery roadmap — milestones M0–M13 and implementation status.',
};

export default function RoadmapPage() {
  const markdown = loadDocMarkdown('09-Roadmap.md');

  return (
    <DocPageLayout
      title="Roadmap"
      subtitle="Incremental delivery milestones with deployable increments at each phase."
      markdown={markdown ?? undefined}
    >
      {!markdown ? <p className="text-slate-400">Roadmap documentation not found.</p> : null}
    </DocPageLayout>
  );
}
