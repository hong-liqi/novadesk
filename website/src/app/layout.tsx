import { Providers } from '@/components/providers';
import { buildRootMetadata } from '@/lib/site-metadata';
import type { Metadata } from 'next';
import './globals.css';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  return buildRootMetadata();
}

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
