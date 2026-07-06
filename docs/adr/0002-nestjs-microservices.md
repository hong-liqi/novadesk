# ADR-0002: NestJS for Backend Microservices

**Status:** Accepted  
**Date:** 2026-07-06  
**Deciders:** Li Hong  
**Related:** [01-Architecture.md](../01-Architecture.md), [16-Service-Catalog.md](../16-Service-Catalog.md)

---

## Context

NovaDesk requires six backend services with consistent patterns for authentication guards, validation, OpenAPI documentation, health checks, and testing. Framework choice affects hiring signal, maintainability, and integration with TypeScript monorepo tooling.

---

## Decision

Use **NestJS 10** for all backend services:

- `@novadesk/gateway` — API Gateway
- `@novadesk/auth-service` — Identity provider
- `@novadesk/notification-service` — Email and notifications
- `@novadesk/helpdesk-api` — HelpDesk domain API
- `@novadesk/analytics-api` — Analytics domain API
- `@novadesk/realtime-chat-service` — WebSocket messaging

Each service is a standalone NestJS application with its own `Dockerfile`, `captain-definition`, and database schema where applicable.

---

## Alternatives considered

| Alternative             | Rejected because                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------ |
| Fastify standalone      | Less structure for multi-module domains; Spell used Fastify but NovaDesk needs consistency across 6 services |
| Express                 | No built-in DI, module system, or OpenAPI integration                                                        |
| Go microservices        | Breaks TypeScript end-to-end; shared types with frontend lost                                                |
| Single Express monolith | Does not demonstrate service boundary thinking                                                               |

---

## Consequences

### Positive

- Uniform module/guard/interceptor patterns via `@novadesk/auth` and `@novadesk/logger`
- Swagger auto-generated per service
- Jest/Vitest testing with Nest testing utilities

### Negative

- NestJS boilerplate per service
- Cold start slightly higher than minimal Fastify (acceptable for portfolio)

---

## Compliance

Documented in service READMEs and [03-Coding-Standards.md](../03-Coding-Standards.md).
