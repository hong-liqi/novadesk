# Portfolio OS

Portfolio OS foundation app — marketing website.

## Quick start

```bash
pnpm install
pnpm --filter @portfolio/website dev
```

Public site: http://localhost:3013

## Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start development server (port 3013) |
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
docker build -f Dockerfile -t portfolio-website ../..
docker run -p 3013:3013 portfolio-website
```

## Environment

Copy `.env.example` to `.env.local` and adjust as needed.
