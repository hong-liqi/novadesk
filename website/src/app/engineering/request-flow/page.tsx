import type { Metadata } from 'next';
import { DocPageLayout } from '@/components/doc-page-layout';
import { loadEngineeringContent } from '@/lib/docs-loader';

export const metadata: Metadata = {
  title: 'Request Flow',
  description:
    'NovaDesk request lifecycle — Nginx, API Gateway, service routing, and observability.',
};

export default function RequestFlowPage() {
  const markdown = loadEngineeringContent('request-flow.md');

  return (
    <DocPageLayout
      title="Request Flow"
      subtitle="End-to-end HTTP request path from client through gateway to backend services."
      markdown={markdown ?? undefined}
    >
      {!markdown ? <p className="text-slate-400">Request flow documentation not found.</p> : null}
    </DocPageLayout>
  );
}
