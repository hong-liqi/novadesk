# API Gateway

Entry point and routing layer for NovaDesk. Terminates TLS at the edge (via Nginx in production), enforces authentication headers, and proxies requests to downstream services.

## Overview

| Property | Value                                         |
| -------- | --------------------------------------------- |
| Package  | `@novadesk/gateway`                           |
| Port     | `3000`                                        |
| Auth     | Global `JwtAuthGuard` with `@Public()` bypass |

## Prerequisites

- Node.js >= 20
- pnpm >= 9
- Redis (optional, for readiness checks)

## Local development

```bash
# From monorepo root
cp services/gateway/.env.example services/gateway/.env
pnpm install
pnpm turbo run dev --filter=@novadesk/gateway
```

## API

| Endpoint                   | Description                  |
| -------------------------- | ---------------------------- |
| `GET /api/v1/health/live`  | Liveness probe (public)      |
| `GET /api/v1/health/ready` | Readiness probe (public)     |
| `GET /api/v1/status`       | Gateway status stub (public) |
| `GET /api/v1/metrics`      | Prometheus metrics           |
| `GET /api/docs`            | Swagger UI                   |

Protected routes require a valid Bearer JWT. Propagated identity headers (`x-user-id`, `x-tenant-id`, `x-roles`) are forwarded to downstream services.

## WebSocket proxy (realtime chat)

Socket.IO connections are proxied from `/socket.io/*` to the realtime chat service (`REALTIME_CHAT_SERVICE_URL`). JWT validation happens on the chat service WebSocket handshake (token via `auth.token` or `?token=` query param).

### Sticky sessions (required for production)

When running **multiple gateway or chat service replicas**, WebSocket connections must stick to the same backend instance for the lifetime of the session. Configure session affinity in your load balancer:

- **CapRover / Nginx**: enable `ip_hash` or `sticky` cookie on the upstream that serves `/socket.io/`
- **Local Docker Compose**: a single gateway + single `realtime-chat-service` replica is sufficient for development; sticky sessions are not required until you scale out

Example Nginx upstream snippet:

```nginx
upstream chat_ws {
  ip_hash;
  server realtime-chat-service:3005;
}
```

## Scripts

| Script                  | Description             |
| ----------------------- | ----------------------- |
| `pnpm build`            | Compile TypeScript      |
| `pnpm dev`              | Start with hot reload   |
| `pnpm lint`             | Run ESLint              |
| `pnpm typecheck`        | Type-check without emit |
| `pnpm test`             | Run unit tests          |
| `pnpm test:integration` | Run e2e tests           |

## Docker

Build from the monorepo root:

```bash
docker build -f services/gateway/Dockerfile -t novadesk/gateway .
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
