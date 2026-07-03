# Realtime Chat

Portfolio OS foundation app — Next.js 14 application.

## Quick start

```bash
pnpm install
pnpm --filter @portfolio/realtime-chat dev
```

Base path: `/chat` (dev: http://localhost:3014/chat)

## Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start development server (port 3014) |
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
docker build -f Dockerfile -t portfolio-realtime-chat ../..
docker run -p 3014:3014 portfolio-realtime-chat
```

## Environment

Copy `.env.example` to `.env.local` and adjust as needed.
