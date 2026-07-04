import type { Metadata } from 'next';
import { AppProviders } from '@/shared/providers/app-providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Realtime Chat',
  description: 'Portfolio OS — Realtime ticket chat',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
