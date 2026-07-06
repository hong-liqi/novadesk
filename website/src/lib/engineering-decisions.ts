export interface EngineeringDecision {
  id: string;
  technology: string;
  decision: string;
  rationale: string;
  adrSlug?: string;
}

export const ENGINEERING_DECISIONS: EngineeringDecision[] = [
  {
    id: 'turborepo',
    technology: 'Turborepo',
    decision: 'Monorepo orchestration with remote-aware build caching and task pipelines.',
    rationale:
      'Five applications and six services share types and tooling. Turborepo parallelizes builds and avoids redundant work across CI and local development.',
    adrSlug: '0001-turborepo-monorepo',
  },
  {
    id: 'nestjs',
    technology: 'NestJS',
    decision: 'Backend framework for all microservices with modular DI and OpenAPI integration.',
    rationale:
      'Consistent module structure, guards, interceptors, and testing patterns across services. NestJS enforces boundaries that map directly to domain modules.',
    adrSlug: '0002-nestjs-microservices',
  },
  {
    id: 'nextjs',
    technology: 'Next.js',
    decision: 'App Router for all frontends and the public website with SSR/SSG where appropriate.',
    rationale:
      'Unified React stack, server components for performance, and API routes only at integration boundaries (e.g. contact form proxy).',
    adrSlug: '0003-nextjs-frontend',
  },
  {
    id: 'postgresql',
    technology: 'PostgreSQL',
    decision: 'Primary relational store with Prisma ORM and per-service database ownership.',
    rationale:
      'ACID guarantees, mature ecosystem, JSON support when needed, and schema migrations as living documentation.',
    adrSlug: '0004-postgresql-data-store',
  },
  {
    id: 'docker',
    technology: 'Docker',
    decision: 'Container-first deployment with compose for local dev and CapRover for production.',
    rationale:
      'Reproducible environments, isolated service deploys, and infrastructure-as-code alignment with production topology.',
    adrSlug: '0005-docker-containerization',
  },
  {
    id: 'shared-packages',
    technology: 'Shared Packages',
    decision:
      'Eight workspace packages for cross-cutting concerns instead of copy-paste utilities.',
    rationale:
      'Single source of truth for auth guards, env validation, logging format, UI primitives, and API contracts reduces drift between apps.',
    adrSlug: '0006-shared-packages',
  },
  {
    id: 'monorepo',
    technology: 'Monorepo',
    decision:
      'Single repository with pnpm workspaces spanning packages, services, apps, and website.',
    rationale:
      'Atomic changes across frontend and backend, shared CI, and visible architecture for reviewers evaluating engineering maturity.',
    adrSlug: '0001-turborepo-monorepo',
  },
];
