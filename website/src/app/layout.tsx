import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import { getSiteUrl } from '@/lib/app-urls';
import './globals.css';

export const dynamic = 'force-dynamic';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'NovaDesk — Integrated Engineering Ecosystem',
    template: '%s | NovaDesk',
  },
  description:
    'Production-grade monorepo with microservices, full-stack apps, shared packages, and DevOps — demonstrating senior-level software architecture.',
  keywords: ['novadesk', 'microservices', 'Next.js', 'NestJS', 'TypeScript', 'monorepo', 'DevOps'],
  authors: [{ name: 'NovaDesk' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'NovaDesk',
    title: 'NovaDesk — Integrated Engineering Ecosystem',
    description:
      'Production-grade monorepo demonstrating senior-level software architecture with HelpDesk, Analytics, Admin Portal, and more.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NovaDesk — Integrated Engineering Ecosystem',
    description: 'Production-grade monorepo demonstrating senior-level software architecture.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
