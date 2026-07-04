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
      'Vocabulary learning app using spaced repetition (SRS) to maximize long-term retention with personalized study sessions.',
    tags: ['Node.js', 'React', 'PostgreSQL', 'Redis', 'SRS'],
    highlight: '78% retention after 30 days',
  },
  {
    slug: 'broom',
    title: 'Broom',
    summary:
      'Automated repository analysis pipeline that surfaces technical debt, vulnerabilities, and dead code with prioritized findings.',
    tags: ['Python', 'FastAPI', 'Celery', 'Docker', 'CI'],
    highlight: '40% tech debt reduction in pilot teams',
  },
  {
    slug: 'teste-de-perfil',
    title: 'Teste de Perfil',
    summary:
      'Adaptive professional profiling platform combining psychometric questionnaires with technical competency analysis.',
    tags: ['NestJS', 'React', 'PostgreSQL', 'IRT', 'PDF'],
    highlight: '71% fit accuracy validated at 6 months',
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
