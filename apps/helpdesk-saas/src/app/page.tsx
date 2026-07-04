import Link from 'next/link';
import { Button } from '@portfolio/ui';
import { routes } from '@/shared/lib/routes';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-bold">Helpdesk SaaS</h1>
      <p className="max-w-md text-center text-neutral-600">
        Modern customer support platform — architecture scaffold ready for implementation.
      </p>
      <div className="flex gap-3">
        <Link href={routes.dashboard}>
          <Button variant="primary">Open dashboard</Button>
        </Link>
        <Link href={routes.login}>
          <Button variant="secondary">Sign in</Button>
        </Link>
      </div>
    </main>
  );
}
