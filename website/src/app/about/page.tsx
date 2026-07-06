import type { Metadata } from 'next';
import Link from 'next/link';
import { DocPageLayout } from '@/components/doc-page-layout';
import { Badge, Stack, Surface, Text } from '@novadesk/ui';
import { ENGINEER_LINKS } from '@/lib/navigation';

export const metadata: Metadata = {
  title: 'About the Engineer',
  description:
    'Li Hong — Software Engineer. Engineering philosophy, problem-solving approach, architecture vision, and production delivery background.',
};

const PRINCIPLES = [
  {
    title: 'Clarity over cleverness',
    body: 'Readable code, explicit boundaries, and documentation that survives team turnover. I optimize for the next engineer who reads the system.',
  },
  {
    title: 'Deployable increments',
    body: 'Every milestone leaves the system in a runnable state. Architecture decisions are validated by what ships, not by diagrams alone.',
  },
  {
    title: 'Contracts at boundaries',
    body: 'APIs, shared packages, and database schemas are versioned contracts. Internal refactors stay internal; external surfaces stay stable.',
  },
  {
    title: 'Operational awareness',
    body: 'Logging, metrics, health checks, and runbooks are part of the feature — not a post-launch afterthought.',
  },
];

const TECHNOLOGIES = [
  'TypeScript',
  'Node.js',
  'NestJS',
  'Next.js',
  'React',
  'PostgreSQL',
  'Prisma',
  'Redis',
  'Docker',
  'GraphQL',
  'WebSocket',
  'OpenAI / RAG',
  'Turborepo',
  'pnpm',
  'CapRover',
  'GitHub Actions',
];

const TRAJECTORY = [
  {
    period: 'Production systems',
    detail:
      'Delivered multi-tenant SaaS platforms in production — AI customer service (Spell), white-label ride-hailing (Broom), and behavioral assessment tooling (Teste de Perfil).',
  },
  {
    period: 'NovaDesk portfolio',
    detail:
      'Designed and implemented a full engineering ecosystem: six microservices, five applications, eight shared packages, CI/CD, and live deployment.',
  },
  {
    period: 'Engineering focus',
    detail:
      'Backend architecture, API design, multi-tenancy, authentication, async processing, and frontend integration with shared design systems.',
  },
];

export default function AboutPage() {
  return (
    <DocPageLayout
      title="About the Engineer"
      subtitle="Li Hong — Software Engineer building production systems with documented architecture."
      backHref="/"
      backLabel="← Back to home"
    >
      <Stack gap="lg">
        <section>
          <Text as="h2" size="xl" weight="bold" className="mb-4 !text-white">
            Engineering philosophy
          </Text>
          <Text as="p" tone="muted" className="mb-6 !text-slate-400">
            I treat software as long-lived infrastructure. The goal is not a demo that impresses in
            a five-minute walkthrough — it is a system an engineering team could inherit, extend,
            and operate. NovaDesk exists to make that claim verifiable: open the repo, read the
            ADRs, run the stack locally, and inspect live services.
          </Text>
          <div className="grid gap-4 sm:grid-cols-2">
            {PRINCIPLES.map((item) => (
              <Surface
                key={item.title}
                variant="outline"
                padding="lg"
                className="border-slate-800 bg-slate-900/50"
              >
                <Text as="h3" size="lg" weight="semibold" className="mb-2 !text-white">
                  {item.title}
                </Text>
                <Text as="p" size="sm" tone="muted" className="!text-slate-400">
                  {item.body}
                </Text>
              </Surface>
            ))}
          </div>
        </section>

        <section>
          <Text as="h2" size="xl" weight="bold" className="mb-4 !text-white">
            How I solve problems
          </Text>
          <ol className="list-decimal space-y-3 pl-6 text-slate-400">
            <li>
              <strong className="text-white">Understand the constraint.</strong> Business rules,
              compliance, scale, and team size determine architecture more than framework trends.
            </li>
            <li>
              <strong className="text-white">Model the domain.</strong> Bounded contexts, clear
              ownership, and data boundaries before choosing deployment topology.
            </li>
            <li>
              <strong className="text-white">Build the thinnest vertical slice.</strong> Prove
              integration points early — auth, persistence, deployment — then expand modules.
            </li>
            <li>
              <strong className="text-white">Document decisions.</strong> ADRs capture why, not just
              what. Future maintainers need context, not archaeology.
            </li>
          </ol>
        </section>

        <section>
          <Text as="h2" size="xl" weight="bold" className="mb-4 !text-white">
            Architecture vision
          </Text>
          <Text as="p" tone="muted" className="mb-4 !text-slate-400">
            I favor <strong className="text-white">modular monoliths that can split</strong> over
            premature microservices. Services emerge when deployment, scaling, or team boundaries
            demand isolation — not because the diagram looks impressive. Cross-cutting concerns live
            in shared packages with strict dependency rules. The API gateway is the security and
            routing perimeter; identity is centralized; each service owns its data.
          </Text>
          <Link
            href="/engineering/architecture"
            className="text-sm font-medium text-blue-400 hover:text-blue-300"
          >
            View NovaDesk architecture →
          </Link>
        </section>

        <section>
          <Text as="h2" size="xl" weight="bold" className="mb-4 !text-white">
            Trajectory
          </Text>
          <div className="space-y-4">
            {TRAJECTORY.map((item) => (
              <Surface
                key={item.period}
                variant="outline"
                padding="md"
                className="border-slate-800 bg-slate-900/40"
              >
                <Text as="h3" size="sm" weight="semibold" className="mb-1 !text-blue-400">
                  {item.period}
                </Text>
                <Text as="p" size="sm" tone="muted" className="!text-slate-400">
                  {item.detail}
                </Text>
              </Surface>
            ))}
          </div>
        </section>

        <section>
          <Text as="h2" size="xl" weight="bold" className="mb-4 !text-white">
            How I structure projects
          </Text>
          <Text as="p" tone="muted" className="mb-4 !text-slate-400">
            Monorepo with pnpm workspaces. Shared packages for auth, config, logging, UI, and API
            contracts. Backend modules follow Clean Architecture layers. Frontends use
            Feature-Sliced Design. Infrastructure is container-first with documented runbooks.
          </Text>
          <Link
            href="/engineering/monorepo"
            className="text-sm font-medium text-blue-400 hover:text-blue-300"
          >
            Monorepo structure →
          </Link>
        </section>

        <section>
          <Text as="h2" size="xl" weight="bold" className="mb-4 !text-white">
            Technologies
          </Text>
          <div className="flex flex-wrap gap-2">
            {TECHNOLOGIES.map((tech) => (
              <Badge key={tech} variant="default">
                {tech}
              </Badge>
            ))}
          </div>
        </section>

        <section>
          <Text as="h2" size="xl" weight="bold" className="mb-4 !text-white">
            Links
          </Text>
          <div className="flex flex-wrap gap-4">
            <a
              href={ENGINEER_LINKS.resume}
              className="inline-flex items-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500"
            >
              Download resume (PDF)
            </a>
            <a
              href={ENGINEER_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 hover:border-slate-600 hover:text-white"
            >
              LinkedIn
            </a>
            <a
              href={ENGINEER_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 hover:border-slate-600 hover:text-white"
            >
              GitHub
            </a>
          </div>
        </section>
      </Stack>
    </DocPageLayout>
  );
}
