# Realtime Chat Service

NestJS WebSocket + REST service for ticket-scoped chat in Portfolio OS (M7).

## Overview

| Property | Value                                          |
| -------- | ---------------------------------------------- |
| Package  | `@portfolio/realtime-chat-service`             |
| Port     | `3005`                                         |
| Database | `chat_db` (PostgreSQL)                         |
| Auth     | JWT on WebSocket handshake via `AUTH_JWKS_URL` |

## WebSocket events

| Event      | Direction | Payload                              |
| ---------- | --------- | ------------------------------------ |
| `join`     | C→S       | `{ ticketId }`                       |
| `message`  | C→S / S→C | `{ ticketId, body }` / saved message |
| `typing`   | C→S / S→C | `{ ticketId, isTyping }`             |
| `presence` | S→C       | `{ ticketId, userId, online }`       |

Rooms use the naming convention `ticket:{ticketId}`.

## REST API

| Endpoint                                    | Description                            |
| ------------------------------------------- | -------------------------------------- |
| `GET /api/v1/chat/rooms/:ticketId/messages` | Message history (requires gateway JWT) |
| `GET /api/v1/health/live`                   | Liveness                               |
| `GET /api/v1/health/ready`                  | Readiness (Redis + Postgres)           |
| `GET /api/v1/metrics`                       | Prometheus metrics                     |

## Local development

```bash
cp services/realtime-chat/.env.example services/realtime-chat/.env
pnpm install
pnpm turbo run dev --filter=@portfolio/realtime-chat-service
```

Run `pnpm db:push` (or migrate) after starting `postgres-chat`.

## Docker

Built from monorepo root:

```bash
docker build -f services/realtime-chat/Dockerfile -t portfolio/realtime-chat-service .
```

When scaling beyond a single replica, configure sticky sessions on the gateway/nginx WebSocket upstream (see `services/gateway/README.md`).
