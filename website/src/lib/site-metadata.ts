import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/app-urls';

export const OG_IMAGE_PATH = '/og/banner.png';

const SITE_TITLE = 'Li Hong — Software Engineer | NovaDesk';
const SITE_DESCRIPTION =
  'Production-grade engineering portfolio by Li Hong: microservices monorepo, live SaaS demo, documented architecture, and case studies from shipped systems.';
const OG_DESCRIPTION =
  'Full-stack portfolio demonstrating senior-level software engineering — HelpDesk, Analytics, Realtime Chat, Admin Portal, API Gateway, ADRs, and production deployment.';

export function getOpenGraphImages(): NonNullable<Metadata['openGraph']>['images'] {
  return [
    {
      url: OG_IMAGE_PATH,
      width: 1983,
      height: 793,
      alt: 'Li Hong — Full Stack Developer | NovaDesk portfolio platform',
      type: 'image/png',
    },
  ];
}

export function buildRootMetadata(): Metadata {
  const siteUrl = getSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: SITE_TITLE,
      template: '%s | NovaDesk',
    },
    description: SITE_DESCRIPTION,
    keywords: [
      'novadesk',
      'portfolio',
      'microservices',
      'Next.js',
      'NestJS',
      'TypeScript',
      'monorepo',
      'DevOps',
      'Li Hong',
    ],
    authors: [{ name: 'Li Hong', url: 'https://github.com/hong-liqi' }],
    creator: 'Li Hong',
    publisher: 'Li Hong',
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      siteName: 'NovaDesk',
      title: SITE_TITLE,
      description: OG_DESCRIPTION,
      images: getOpenGraphImages(),
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_TITLE,
      description: OG_DESCRIPTION,
      images: [OG_IMAGE_PATH],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
