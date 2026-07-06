export interface EngineeringHighlight {
  id: string;
  title: string;
  description: string;
  category: 'architecture' | 'operations' | 'quality';
}

export const ENGINEERING_HIGHLIGHTS: EngineeringHighlight[] = [
  {
    id: 'production-ready',
    title: 'Production Ready',
    description:
      'Live deployment with Docker, Nginx reverse proxy, and CapRover per-service builds.',
    category: 'operations',
  },
  {
    id: 'docker',
    title: 'Docker',
    description:
      'Containerized services with compose-based local stack and captain-definition per component.',
    category: 'operations',
  },
  {
    id: 'cicd',
    title: 'CI/CD',
    description: 'GitHub Actions pipeline with lint, typecheck, test, and path-scoped builds.',
    category: 'operations',
  },
  {
    id: 'monorepo',
    title: 'Monorepo',
    description: 'pnpm workspaces with Turborepo caching and explicit package boundaries.',
    category: 'architecture',
  },
  {
    id: 'shared-packages',
    title: 'Shared Packages',
    description:
      'Cross-cutting concerns centralized in auth, config, logger, SDK, UI, and shared types.',
    category: 'architecture',
  },
  {
    id: 'microservices',
    title: 'Microservices Ready',
    description: 'Domain-oriented services behind an API gateway with independent deploy units.',
    category: 'architecture',
  },
  {
    id: 'openapi',
    title: 'OpenAPI',
    description: 'Swagger documentation exposed on each NestJS service for contract visibility.',
    category: 'quality',
  },
  {
    id: 'type-safety',
    title: 'Type Safety',
    description:
      'End-to-end TypeScript with Prisma, Zod, and shared contracts across clients and APIs.',
    category: 'quality',
  },
  {
    id: 'rbac',
    title: 'RBAC',
    description: 'Role-based access control with multi-tenant isolation at workspace scope.',
    category: 'quality',
  },
  {
    id: 'ddd',
    title: 'DDD',
    description:
      'Bounded contexts with domain, application, infrastructure, and presentation layers.',
    category: 'architecture',
  },
  {
    id: 'solid',
    title: 'SOLID',
    description: 'Ports-and-adapters pattern with dependency injection and interface segregation.',
    category: 'architecture',
  },
  {
    id: 'clean-architecture',
    title: 'Clean Architecture',
    description: 'Framework-agnostic domain logic with explicit use cases and repository ports.',
    category: 'architecture',
  },
];
