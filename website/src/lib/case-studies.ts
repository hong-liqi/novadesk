import fs from 'node:fs';
import path from 'node:path';

export interface CaseStudyMeta {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  highlight: string;
}

export const CASE_STUDIES: CaseStudyMeta[] = [
  {
    slug: 'spell',
    title: 'Spell',
    summary:
      'Multi-tenant SaaS for WhatsApp and Instagram customer service with RAG-grounded AI, human handoff, visual flows, and billing.',
    tags: ['Fastify', 'React', 'PostgreSQL', 'pgvector', 'OpenAI'],
    highlight: 'In production at spelltalk.com.br',
  },
  {
    slug: 'broom',
    title: 'Broom',
    summary:
      'White-label ride-hailing platform powering regional mobility brands with passenger/driver apps, admin panel, and WhatsApp booking.',
    tags: ['GraphQL', 'React Native', 'PostgreSQL', 'Firebase', 'WhatsApp'],
    highlight: '20+ franchise brands on one platform',
  },
  {
    slug: 'teste-de-perfil',
    title: 'Teste de Perfil',
    summary:
      'Behavioral profile assessment platform for Paulo Odorico — online courses, corporate training events, and investor profiling.',
    tags: ['Next.js', 'PostgreSQL', 'Prisma', 'Puppeteer', 'Chart.js'],
    highlight: '3 assessment flows in production',
  },
];

export function getCaseStudySlugs(): string[] {
  return CASE_STUDIES.map((study) => study.slug);
}

export function getCaseStudyMeta(slug: string): CaseStudyMeta | undefined {
  return CASE_STUDIES.find((study) => study.slug === slug);
}

const CONTENT_DIR_CANDIDATES = [
  path.join(process.cwd(), 'content', 'case-studies'),
  path.join(process.cwd(), 'website', 'content', 'case-studies'),
  path.join(process.cwd(), '..', 'docs', 'case-studies'),
  path.join(process.cwd(), 'docs', 'case-studies'),
];

function resolveContentDir(): string {
  for (const dir of CONTENT_DIR_CANDIDATES) {
    if (fs.existsSync(dir)) {
      return dir;
    }
  }
  return CONTENT_DIR_CANDIDATES[0] ?? path.join(process.cwd(), 'docs', 'case-studies');
}

export function getCaseStudyMarkdown(slug: string): string | null {
  const filePath = path.join(resolveContentDir(), `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return fs.readFileSync(filePath, 'utf8');
}
