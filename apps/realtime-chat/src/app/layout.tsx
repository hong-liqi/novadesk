import type { Metadata } from 'next';
import { AppProviders } from '@/shared/providers/app-providers';
import { RuntimeConfigScript } from '@/shared/components/runtime-config-script';
import './globals.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Realtime Chat',
  description: 'NovaDesk — Realtime ticket chat',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <RuntimeConfigScript />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
