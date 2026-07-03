import { Button } from '@portfolio/ui';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950 p-8 text-white">
      <p className="text-sm uppercase tracking-widest text-slate-400">Portfolio OS</p>
      <h1 className="max-w-2xl text-center text-4xl font-bold tracking-tight sm:text-5xl">
        Integrated engineering ecosystem
      </h1>
      <p className="max-w-xl text-center text-slate-400">
        Production-grade monorepo demonstrating senior-level software architecture.
      </p>
      <Button>Explore the platform</Button>
    </main>
  );
}
