import { Stack, Surface, Text } from '@novadesk/ui';
import Link from 'next/link';
import { ENGINEERING_DECISIONS } from '@/lib/engineering-decisions';

export function EngineeringDecisionsSection() {
  return (
    <section id="decisions" className="border-t border-slate-800/60 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Stack gap="sm" className="mb-10">
          <Text as="h2" size="xl" weight="bold" className="!text-white">
            Engineering decisions
          </Text>
          <Text as="p" tone="muted" className="max-w-2xl !text-slate-400">
            Technology choices with explicit rationale. Each decision is documented as an ADR in{' '}
            <Link href="/engineering/decisions" className="text-blue-400 hover:text-blue-300">
              docs/adr
            </Link>
            .
          </Text>
        </Stack>

        <div className="grid gap-4 lg:grid-cols-2">
          {ENGINEERING_DECISIONS.map((item) => (
            <Surface
              key={item.id}
              variant="outline"
              padding="lg"
              className="border-slate-800 bg-slate-900/50"
            >
              <Text as="h3" size="lg" weight="semibold" className="mb-1 !text-blue-400">
                {item.technology}
              </Text>
              <Text as="p" size="sm" weight="medium" className="mb-3 !text-white">
                {item.decision}
              </Text>
              <Text as="p" size="sm" tone="muted" className="mb-4 !text-slate-400">
                {item.rationale}
              </Text>
              {item.adrSlug ? (
                <Link
                  href={`/engineering/decisions#${item.adrSlug}`}
                  className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
                >
                  Read ADR →
                </Link>
              ) : null}
            </Surface>
          ))}
        </div>
      </div>
    </section>
  );
}
