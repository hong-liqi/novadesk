#!/usr/bin/env node
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const APP = join(dirname(fileURLToPath(import.meta.url)), '..', 'apps/helpdesk-saas/src/app');

const routes = [
  { path: 'dashboard', title: 'Dashboard' },
  { path: 'tickets', title: 'Tickets' },
  { path: 'inbox', title: 'Inbox' },
  { path: 'knowledge-base', title: 'Knowledge Base' },
  { path: 'settings', title: 'Settings' },
  { path: 'administration', title: 'Administration' },
  { path: 'analytics', title: 'Analytics' },
  { path: 'profile', title: 'Profile' },
  { path: 'search', title: 'Search' },
  { path: 'notifications', title: 'Notifications' },
];

function write(path, content) {
  if (!existsSync(dirname(path))) mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, 'utf8');
}

write(
  join(APP, '(app)/layout.tsx'),
  `import { AppShell } from '@/widgets/app-shell/AppShell';
import { AppProviders } from '@/shared/providers';

export default function AuthenticatedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AppProviders>
      <AppShell>{children}</AppShell>
    </AppProviders>
  );
}
`,
);

for (const route of routes) {
  write(
    join(APP, `(app)/${route.path}/page.tsx`),
    `/** ${route.title} — route scaffold (no UI implementation) */
export default function ${route.title.replace(/\s/g, '')}Page() {
  return (
    <section>
      <h1>${route.title}</h1>
      <p>Architecture scaffold — implementation pending.</p>
    </section>
  );
}
`,
  );
}

write(
  join(APP, '(auth)/login/page.tsx'),
  `/** Authentication — route scaffold */
export default function LoginPage() {
  return (
    <main>
      <h1>Sign in</h1>
      <p>Authentication flow not implemented.</p>
    </main>
  );
}
`,
);

write(
  join(APP, '(auth)/layout.tsx'),
  `export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
`,
);

console.log('Frontend routes created.');
