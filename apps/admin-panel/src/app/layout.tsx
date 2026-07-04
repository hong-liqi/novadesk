import type { Metadata } from 'next';
import { AppProviders } from '@/shared/providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Admin Portal',
  description: 'Portfolio OS — platform administration',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
