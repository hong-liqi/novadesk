import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/app-urls';

export const OG_IMAGE_PATH = '/og/banner.png';

const SITE_TITLE = 'NovaDesk — Integrated Engineering Ecosystem';
const SITE_DESCRIPTION =
  'Production-grade portfolio platform with microservices, Next.js apps, shared packages, CI/CD, and live deployment — built by Li Hong.';
const OG_DESCRIPTION =
  'Full-stack portfolio platform demonstrating senior-level software architecture: HelpDesk, Analytics, Realtime Chat, Admin Portal, and API Gateway.';

export function getOpenGraphImages(): NonNullable<Metadata['openGraph']>['images'] {
  return [
    {
      url: OG_IMAGE_PATH,
      width: 1584,
      height: 396,
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
