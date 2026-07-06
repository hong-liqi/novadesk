import fs from 'node:fs';
import path from 'node:path';

const DOCS_ROOT_CANDIDATES = [
  path.join(process.cwd(), '..', 'docs'),
  path.join(process.cwd(), 'docs'),
];

function resolveDocsRoot(): string {
  for (const dir of DOCS_ROOT_CANDIDATES) {
    if (fs.existsSync(dir)) {
      return dir;
    }
  }
  return DOCS_ROOT_CANDIDATES[0] ?? path.join(process.cwd(), 'docs');
}

export function loadDocMarkdown(relativePath: string): string | null {
  const filePath = path.join(resolveDocsRoot(), relativePath);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return fs.readFileSync(filePath, 'utf8');
}

export interface AdrMeta {
  slug: string;
  title: string;
  status: string;
  date: string;
}

const ADR_FILES: AdrMeta[] = [
  {
    slug: '0001-turborepo-monorepo',
    title: 'Turborepo Monorepo Orchestration',
    status: 'Accepted',
    date: '2026-07-06',
  },
  {
    slug: '0002-nestjs-microservices',
    title: 'NestJS for Backend Microservices',
    status: 'Accepted',
    date: '2026-07-06',
  },
  {
    slug: '0003-nextjs-frontend',
    title: 'Next.js App Router for Frontends',
    status: 'Accepted',
    date: '2026-07-06',
  },
  {
    slug: '0004-postgresql-data-store',
    title: 'PostgreSQL as Primary Data Store',
    status: 'Accepted',
    date: '2026-07-06',
  },
  {
    slug: '0005-docker-containerization',
    title: 'Docker Containerization Strategy',
    status: 'Accepted',
    date: '2026-07-06',
  },
  {
    slug: '0006-shared-packages',
    title: 'Shared Packages for Cross-Cutting Concerns',
    status: 'Accepted',
    date: '2026-07-06',
  },
  {
    slug: '0007-api-gateway-pattern',
    title: 'API Gateway as Single Entry Point',
    status: 'Accepted',
    date: '2026-07-06',
  },
];

export function getAdrList(): AdrMeta[] {
  return ADR_FILES;
}

export function loadAdrMarkdown(slug: string): string | null {
  return loadDocMarkdown(path.join('adr', `${slug}.md`));
}

export function loadEngineeringContent(filename: string): string | null {
  const candidates = [
    path.join(process.cwd(), 'website', 'content', 'engineering', filename),
    path.join(process.cwd(), 'content', 'engineering', filename),
  ];

  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf8');
    }
  }

  return null;
}
