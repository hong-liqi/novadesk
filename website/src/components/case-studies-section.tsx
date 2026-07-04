import { Badge, Stack, Surface, Text } from '@portfolio/ui';
import Link from 'next/link';
import { CASE_STUDIES } from '@/lib/case-studies';

export function CaseStudiesSection() {
  return (
    <section id="case-studies" className="border-t border-slate-800/80 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Stack gap="sm" className="mb-10">
          <Text as="h2" size="xl" weight="bold" className="!text-white">
            Case studies
          </Text>
          <Text as="p" tone="muted" className="max-w-2xl !text-slate-400">
            Prior projects that shaped architectural decisions in Portfolio OS — documented as
            narrative case studies with lessons learned.
          </Text>
        </Stack>

        <div className="grid gap-6 md:grid-cols-3">
          {CASE_STUDIES.map((study) => (
            <Surface
              key={study.slug}
              variant="raised"
              padding="lg"
              className="flex h-full flex-col bg-slate-900/60"
            >
              <Text as="h3" size="lg" weight="semibold" className="!text-white">
                {study.title}
              </Text>
              <Text as="p" size="sm" className="mt-1 font-medium !text-emerald-400">
                {study.highlight}
              </Text>
              <Text as="p" size="sm" tone="muted" className="mt-3 flex-1 !text-slate-400">
                {study.summary}
              </Text>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {study.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="default">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Link
                href={`/case-studies/${study.slug}`}
                className="mt-4 text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
              >
                Read case study →
              </Link>
            </Surface>
          ))}
        </div>
      </div>
    </section>
  );
}
