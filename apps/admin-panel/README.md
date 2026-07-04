# Admin Panel

NovaDesk foundation app — Next.js 14 application.

## Quick start

```bash
pnpm install
pnpm --filter @novadesk/admin-panel dev
```

Base path: `/admin` (dev: http://localhost:3012/admin)

## Scripts

| Script      | Description                          |
| ----------- | ------------------------------------ |
| `dev`       | Start development server (port 3012) |
| `build`     | Production build                     |
| `start`     | Start production server              |
| `lint`      | Run ESLint                           |
| `typecheck` | Run TypeScript                       |
| `test`      | Run Vitest unit tests                |
| `clean`     | Remove build artifacts               |

## E2E tests

```bash
pnpm exec playwright test --config e2e/playwright.config.ts
```

## Docker

```bash
docker build -f Dockerfile -t novadesk-admin-panel ../..
docker run -p 3012:3012 novadesk-admin-panel
```

## Environment

Copy `.env.example` to `.env.local` and adjust as needed.
