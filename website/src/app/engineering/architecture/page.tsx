import type { Metadata } from 'next';
import { DocPageLayout } from '@/components/doc-page-layout';
import { loadDocMarkdown } from '@/lib/docs-loader';

export const metadata: Metadata = {
  title: 'Architecture',
  description: 'NovaDesk system architecture — context diagram, service boundaries, and data flow.',
};

export default function ArchitecturePage() {
  const markdown = loadDocMarkdown('01-Architecture.md');

  return (
    <DocPageLayout
      title="System Architecture"
      subtitle="Domain-oriented microservices behind an API gateway with shared packages and centralized identity."
      markdown={markdown ?? undefined}
    >
      {!markdown ? <p className="text-slate-400">Architecture documentation not found.</p> : null}
    </DocPageLayout>
  );
}
