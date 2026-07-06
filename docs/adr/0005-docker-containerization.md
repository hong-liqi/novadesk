# ADR-0005: Docker Containerization Strategy

**Status:** Accepted  
**Date:** 2026-07-06  
**Deciders:** Li Hong  
**Related:** [06-DevOps.md](../06-DevOps.md), [DEPLOY-CAPROVER.md](../../DEPLOY-CAPROVER.md)

---

## Context

NovaDesk must run identically in local development and production. Twelve deployable units (6 services + 5 apps + nginx) require reproducible builds and independent deploy capability.

---

## Decision

**Container-first** deployment:

1. **Local:** `docker-compose.yml` with PostgreSQL, Redis, Nginx, and all services
2. **Production:** CapRover with per-component `captain-definition` and Git webhook deploy
3. **Multi-stage Dockerfiles** — build stage (pnpm + turbo) → slim runtime (Node 20 Alpine)

Each service/app has:

- `Dockerfile` at package root
- `captain-definition` pointing to Dockerfile path
- Environment variables documented in `.env.example`

Nginx routes path prefixes to containers — single domain, multiple apps.

---

## Alternatives considered

| Alternative         | Rejected because                                  |
| ------------------- | ------------------------------------------------- |
| PM2 on VPS          | No isolation; harder to replicate locally         |
| Kubernetes          | Operational overhead excessive for solo portfolio |
| Serverless (Lambda) | WebSocket and long-running workers poorly suited  |
| Vercel-only         | Backend microservices need persistent processes   |

---

## Consequences

### Positive

- `docker compose up` gives full stack locally
- Independent service deploys on CapRover
- Demonstrates DevOps competence to reviewers

### Negative

- Image build time in CI
- CapRover-specific deploy knowledge required

---

## Compliance

Documented in [06-DevOps.md](../06-DevOps.md) and [infrastructure/caprover/README.md](../../infrastructure/caprover/README.md).
