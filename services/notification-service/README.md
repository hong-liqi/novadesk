# Notification Service

Notification delivery microservice for Portfolio OS. Processes outbound notifications via email and other channels (business logic deferred to later milestones).

## Overview

| Property | Value |
|----------|-------|
| Package | `@portfolio/notification-service` |
| Port | `3002` |
| Database | `notification_db` (PostgreSQL) |
| Queue | `notification-queue` (BullMQ / Redis) |

## Prerequisites

- Node.js >= 20
- pnpm >= 9
- Redis (for queue and health checks)
- PostgreSQL (optional at foundation stage)
- SMTP server (Mailpit recommended for local dev)

## Local development

```bash
# From monorepo root
cp services/notification-service/.env.example services/notification-service/.env
pnpm install
pnpm turbo run dev --filter=@portfolio/notification-service
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
docker build -f services/notification-service/Dockerfile -t portfolio/notification-service .
```

## Architecture

```
src/
├── main.ts
├── app.module.ts
├── presentation/     # HTTP controllers (health, metrics)
└── infrastructure/   # Queue, database prep, observability, swagger
```
