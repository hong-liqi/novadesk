import type { Metadata } from 'next';
import { AppProviders } from '@/shared/providers';
import { RuntimeConfigScript } from '@/shared/components/runtime-config-script';
import './globals.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Analytics Dashboard',
  description: 'NovaDesk — workspace analytics and KPI reporting',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
        <RuntimeConfigScript />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
