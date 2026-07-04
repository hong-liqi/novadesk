# Helpdesk SaaS — Frontend

Flagship customer support application for Portfolio OS. Modern multi-tenant helpdesk UI built with **Next.js 14** (App Router) and **Feature-Sliced Design**.

**Backend API:** `services/helpdesk-api`  
**Package:** `@portfolio/helpdesk-saas`  
**Port:** 3010  
**Base path:** `/helpdesk`

---

## Architecture

```
src/
├── app/
│   ├── (app)/              # Authenticated routes (AppShell layout)
│   │   ├── dashboard/
│   │   ├── tickets/
│   │   ├── inbox/
│   │   ├── knowledge-base/
│   │   ├── settings/
│   │   ├── administration/
│   │   ├── analytics/
│   │   ├── profile/
│   │   ├── search/
│   │   └── notifications/
│   └── (auth)/             # Public auth routes
│       └── login/
├── features/               # Feature slices (api, hooks, components, types)
├── entities/               # Domain models (ticket, user, workspace, ...)
├── widgets/                # AppShell, Sidebar, Header, Footer
└── shared/                 # Providers, hooks, stores, services, lib
```

**Import hierarchy:** `app → widgets → features → entities → shared`

See [helpdesk-api docs](../../services/helpdesk-api/docs/ARCHITECTURE.md) for system diagrams.

---

## Quick start

```bash
pnpm install
pnpm --filter @portfolio/helpdesk-saas dev
```

Open: http://localhost:3010/helpdesk

---

## Path aliases

| Alias         | Path             |
| ------------- | ---------------- |
| `@/*`         | `src/*`          |
| `@features/*` | `src/features/*` |
| `@entities/*` | `src/entities/*` |
| `@widgets/*`  | `src/widgets/*`  |
| `@shared/*`   | `src/shared/*`   |

---

## Scripts

| Script      | Description                          |
| ----------- | ------------------------------------ |
| `dev`       | Start development server (port 3010) |
| `build`     | Production build                     |
| `start`     | Start production server              |
| `lint`      | Run ESLint                           |
| `typecheck` | Run TypeScript                       |
| `test`      | Run Vitest unit tests                |
| `clean`     | Remove build artifacts               |

---

## Status

| Area                                   | Status      |
| -------------------------------------- | ----------- |
| Route structure                        | Scaffold    |
| Layout shell (Sidebar, Header, Footer) | Scaffold    |
| Feature modules                        | Scaffold    |
| UI implementation                      | Not started |
| API integration                        | Not started |

---

## Related

- [helpdesk-api README](../../services/helpdesk-api/README.md)
- [Roadmap](../../services/helpdesk-api/docs/ROADMAP.md)
- [ADR-0001](../../services/helpdesk-api/docs/adr/0001-architecture-foundation.md)
