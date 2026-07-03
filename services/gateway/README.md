# API Gateway

Entry point and routing layer for Portfolio OS. Terminates TLS at the edge (via Nginx in production), enforces authentication headers, and proxies requests to downstream services.

## Overview

| Property | Value |
|----------|-------|
| Package | `@portfolio/gateway` |
| Port | `3000` |
| Auth | Global `JwtAuthGuard` with `@Public()` bypass |

## Prerequisites

- Node.js >= 20
- pnpm >= 9
- Redis (optional, for readiness checks)

## Local development

```bash
# From monorepo root
cp services/gateway/.env.example services/gateway/.env
pnpm install
pnpm turbo run dev --filter=@portfolio/gateway
```

## API

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/health/live` | Liveness probe (public) |
| `GET /api/v1/health/ready` | Readiness probe (public) |
| `GET /api/v1/status` | Gateway status stub (public) |
| `GET /api/v1/metrics` | Prometheus metrics |
| `GET /api/docs` | Swagger UI |

Protected routes require an `x-user-id` header (foundation guard — full JWT validation in M2).

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm build` | Compile TypeScript |
| `pnpm dev` | Start with hot reload |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Type-check without emit |
| `pnpm test` | Run unit tests |
| `pnpm test:integration` | Run e2e tests |

## Docker

Build from the monorepo root:

```bash
docker build -f services/gateway/Dockerfile -t portfolio/gateway .
```

## Architecture

```
src/
├── main.ts
├── app.module.ts
├── presentation/
│   ├── health/       # Liveness and readiness probes
│   ├── metrics/      # Prometheus endpoint
│   └── proxy/        # Routing stub (downstream proxy in later milestones)
└── infrastructure/   # Observability, swagger config
```
