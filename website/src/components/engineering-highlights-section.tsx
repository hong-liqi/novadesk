import { Badge, Stack, Surface, Text } from '@novadesk/ui';
import { ENGINEERING_HIGHLIGHTS } from '@/lib/engineering-highlights';

const CATEGORY_LABELS = {
  architecture: 'Architecture',
  operations: 'Operations',
  quality: 'Quality',
} as const;

export function EngineeringHighlightsSection() {
  return (
    <section id="highlights" className="border-t border-slate-800/60 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Stack gap="sm" className="mb-10">
          <Text as="h2" size="xl" weight="bold" className="!text-white">
            Engineering highlights
          </Text>
          <Text as="p" tone="muted" className="max-w-2xl !text-slate-400">
            Patterns and practices applied across the platform — not marketing labels, but concrete
            implementation choices visible in the codebase and infrastructure.
          </Text>
        </Stack>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ENGINEERING_HIGHLIGHTS.map((item) => (
            <Surface
              key={item.id}
              variant="outline"
              padding="md"
              className="border-slate-800 bg-slate-900/40"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <Text as="h3" size="sm" weight="semibold" className="!text-white">
                  {item.title}
                </Text>
                <Badge variant="default">{CATEGORY_LABELS[item.category]}</Badge>
              </div>
              <Text as="p" size="sm" tone="muted" className="!text-slate-400">
                {item.description}
              </Text>
            </Surface>
          ))}
        </div>
      </div>
    </section>
  );
}
