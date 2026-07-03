import { Button } from '@portfolio/ui';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-semibold">Helpdesk SaaS</h1>
      <p className="text-slate-600">Foundation ready</p>
      <Button>Get started</Button>
    </main>
  );
}
