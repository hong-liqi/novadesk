import { Text } from '@novadesk/ui';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MarkdownContent } from '@/components/markdown-content';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getCaseStudyMarkdown, getCaseStudyMeta, getCaseStudySlugs } from '@/lib/case-studies';

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const meta = getCaseStudyMeta(slug);

  if (!meta) {
    return { title: 'Case Study Not Found' };
  }

  return {
    title: `${meta.title} — Case Study`,
    description: meta.summary,
    openGraph: {
      title: `${meta.title} — NovaDesk Case Study`,
      description: meta.summary,
      type: 'article',
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const meta = getCaseStudyMeta(slug);
  const markdown = getCaseStudyMarkdown(slug);

  if (!meta || !markdown) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      <SiteHeader />
      <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/#case-studies"
            className="mb-8 inline-flex text-sm text-blue-400 transition-colors hover:text-blue-300"
          >
            ← Back to case studies
          </Link>
          <Text as="p" size="sm" className="mb-2 font-medium !text-emerald-400">
            {meta.highlight}
          </Text>
          <MarkdownContent content={markdown} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
