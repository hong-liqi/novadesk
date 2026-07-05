import { Badge, Stack, Surface, Text } from '@novadesk/ui';
import Link from 'next/link';
import { getNovaDeskModules } from '@/lib/projects';

export function ProjectsSection() {
  const modules = getNovaDeskModules();

  return (
    <section id="projects" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Stack gap="sm" className="mb-10">
          <Text as="h2" size="xl" weight="bold" className="!text-white">
            NovaDesk modules
          </Text>
          <Text as="p" tone="muted" className="max-w-2xl !text-slate-400">
            Eight integrated applications and services sharing auth, observability, and a unified
            design system — deployed behind a single API gateway.
          </Text>
        </Stack>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Surface
              key={module.id}
              variant="outline"
              padding="lg"
              className="flex h-full flex-col border-slate-800 bg-slate-900/50 transition-colors hover:border-slate-700 hover:bg-slate-900/80"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <Text as="h3" size="lg" weight="semibold" className="!text-white">
                  {module.name}
                </Text>
                <Badge variant={module.type === 'app' ? 'accent' : 'default'}>{module.type}</Badge>
              </div>
              <Text as="p" size="sm" tone="muted" className="mb-4 flex-1 !text-slate-400">
                {module.description}
              </Text>
              <div className="mb-4 flex flex-wrap gap-1.5">
                {module.tags.map((tag) => (
                  <Badge key={tag} variant="default">
                    {tag}
                  </Badge>
                ))}
              </div>
              {module.href ? (
                <Link
                  href={module.href}
                  className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
                >
                  Open app →
                </Link>
              ) : (
                <Text as="span" size="sm" tone="muted" className="!text-slate-500">
                  Backend service
                </Text>
              )}
            </Surface>
          ))}
        </div>
      </div>
    </section>
  );
}
