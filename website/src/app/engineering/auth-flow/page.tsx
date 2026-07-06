import type { Metadata } from 'next';
import { DocPageLayout } from '@/components/doc-page-layout';
import { loadEngineeringContent } from '@/lib/docs-loader';

export const metadata: Metadata = {
  title: 'Authentication Flow',
  description:
    'NovaDesk JWT authentication — RS256, refresh rotation, RBAC, and multi-tenant isolation.',
};

export default function AuthFlowPage() {
  const markdown = loadEngineeringContent('auth-flow.md');

  return (
    <DocPageLayout
      title="Authentication Flow"
      subtitle="Centralized identity via Auth Service with JWT access tokens and refresh rotation."
      markdown={markdown ?? undefined}
    >
      {!markdown ? <p className="text-slate-400">Auth flow documentation not found.</p> : null}
    </DocPageLayout>
  );
}
