# Analytics Dashboard

Portfolio OS foundation app — Next.js 14 application.

## Quick start

```bash
pnpm install
pnpm --filter @portfolio/analytics-dashboard dev
```

Base path: `/analytics` (dev: http://localhost:3011/analytics)

## Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start development server (port 3011) |
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
docker build -f Dockerfile -t portfolio-analytics-dashboard ../..
docker run -p 3011:3011 portfolio-analytics-dashboard
```

## Environment

Copy `.env.example` to `.env.local` and adjust as needed.
