import { Text } from '@novadesk/ui';
import Link from 'next/link';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <Text as="p" size="sm" className="mb-2 uppercase tracking-widest !text-slate-500">
          404
        </Text>
        <Text as="h1" size="2xl" weight="bold" className="mb-4 !text-white">
          Page not found
        </Text>
        <Text as="p" tone="muted" className="mb-8 max-w-md !text-slate-400">
          The page you are looking for does not exist or has been moved.
        </Text>
        <Link
          href="/"
          className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500"
        >
          Back to home
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
