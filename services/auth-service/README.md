# Auth Service

Authentication and identity microservice for Portfolio OS. Handles user credentials, JWT issuance, and session management (business logic deferred to later milestones).

## Overview

| Property | Value |
|----------|-------|
| Package | `@portfolio/auth-service` |
| Port | `3001` |
| Database | `auth_db` (PostgreSQL) |
| Queue | `auth-queue` (BullMQ / Redis) |

## Prerequisites

- Node.js >= 20
- pnpm >= 9
- Redis (for queue and health checks)
- PostgreSQL (optional at foundation stage)

## Local development

```bash
# From monorepo root
cp services/auth-service/.env.example services/auth-service/.env
pnpm install
pnpm turbo run dev --filter=@portfolio/auth-service
```

## API

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/health/live` | Liveness probe |
| `GET /api/v1/health/ready` | Readiness probe (checks Redis when configured) |
| `GET /api/v1/metrics` | Prometheus metrics |
| `GET /api/docs` | Swagger UI |

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
docker build -f services/auth-service/Dockerfile -t portfolio/auth-service .
```

## Architecture

```
src/
├── main.ts
├── app.module.ts
├── presentation/     # HTTP controllers (health, metrics)
└── infrastructure/   # Queue, database prep, observability, swagger
```
