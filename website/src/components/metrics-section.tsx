import { Stack, Surface, Text } from '@novadesk/ui';
import { METRIC_LABELS, PROJECT_METRICS } from '@/lib/project-metrics';

export function MetricsSection() {
  const entries = Object.entries(PROJECT_METRICS) as [keyof typeof PROJECT_METRICS, number][];

  return (
    <section id="metrics" className="border-t border-slate-800/60 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Stack gap="sm" className="mb-10">
          <Text as="h2" size="xl" weight="bold" className="!text-white">
            Repository metrics
          </Text>
          <Text as="p" tone="muted" className="max-w-2xl !text-slate-400">
            Quantified scope of the monorepo — useful for reviewers evaluating system complexity and
            engineering investment.
          </Text>
        </Stack>

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {entries.map(([key, value]) => (
            <Surface
              key={key}
              variant="outline"
              padding="lg"
              className="border-slate-800 bg-slate-900/50 text-center"
            >
              <Text as="p" size="2xl" weight="bold" className="!text-white">
                {value.toLocaleString('en-US')}
              </Text>
              <Text as="p" size="sm" tone="muted" className="mt-1 !text-slate-400">
                {METRIC_LABELS[key]}
              </Text>
            </Surface>
          ))}
        </div>
      </div>
    </section>
  );
}
