import type { Metadata } from 'next';
import { DocPageLayout, EngineeringIndexCard } from '@/components/doc-page-layout';
import { Stack, Text } from '@novadesk/ui';
import { ENGINEERING_NAV } from '@/lib/navigation';

export const metadata: Metadata = {
  title: 'Engineering',
  description:
    'NovaDesk engineering documentation — architecture, monorepo structure, auth flow, request flow, roadmap, and ADRs.',
};

export default function EngineeringPage() {
  return (
    <DocPageLayout
      title="Engineering"
      subtitle="Technical documentation for reviewers evaluating system design, code organization, and operational maturity."
      backHref="/"
      backLabel="← Back to home"
    >
      <Stack gap="md">
        <Text as="p" tone="muted" className="!text-slate-400">
          Full engineering docs also live in the repository under{' '}
          <code className="rounded bg-slate-800 px-1.5 py-0.5 text-sm text-blue-300">docs/</code>.
          These pages surface the material most relevant to a technical review.
        </Text>
        <div className="grid gap-4 sm:grid-cols-2">
          {ENGINEERING_NAV.map((item) => (
            <EngineeringIndexCard
              key={item.href}
              href={item.href}
              title={item.label}
              description={item.description ?? ''}
            />
          ))}
        </div>
      </Stack>
    </DocPageLayout>
  );
}
