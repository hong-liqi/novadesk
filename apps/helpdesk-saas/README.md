# Helpdesk SaaS

Portfolio OS foundation app — Next.js 14 application.

## Quick start

```bash
pnpm install
pnpm --filter @portfolio/helpdesk-saas dev
```

Base path: `/helpdesk` (dev: http://localhost:3010/helpdesk)

## Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start development server (port 3010) |
| `build` | Production build |
| `start` | Start production server |
| `lint` | Run ESLint |
| `typecheck` | Run TypeScript |
| `test` | Run Vitest unit tests |
| `clean` | Remove build artifacts |

## E2E tests

```bash
pnpm exec playwright test --config e2e/playwright.config.ts
```

## Docker

```bash
docker build -f Dockerfile -t portfolio-helpdesk-saas ../..
docker run -p 3010:3010 portfolio-helpdesk-saas
```

## Environment

Copy `.env.example` to `.env.local` and adjust as needed.
