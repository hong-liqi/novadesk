# ADR-0004: PostgreSQL as Primary Data Store

**Status:** Accepted  
**Date:** 2026-07-06  
**Deciders:** Li Hong  
**Related:** [17-Data-Architecture.md](../17-Data-Architecture.md)

---

## Context

Services need durable relational storage with ACID guarantees, migration tooling, and TypeScript integration. HelpDesk requires complex tenant-scoped queries; Auth requires transactional consistency for credentials and tokens.

---

## Decision

Use **PostgreSQL 16** as the primary database with **Prisma 5** ORM per service.

Database ownership:

| Service       | Database          | Notes                                 |
| ------------- | ----------------- | ------------------------------------- |
| Auth Service  | `auth_db`         | Users, roles, tenants, refresh tokens |
| HelpDesk API  | `helpdesk_db`     | Tickets, customers, workspaces        |
| Notification  | `notification_db` | Templates, delivery log               |
| Analytics API | `analytics_db`    | Metrics aggregates                    |

**No cross-service database access.** Services communicate via HTTP APIs only.

Redis is used for cache, rate limiting, pub/sub, and BullMQ queues — not as primary store.

---

## Alternatives considered

| Alternative       | Rejected because                                     |
| ----------------- | ---------------------------------------------------- |
| MongoDB           | Weaker relational modeling for multi-tenant RBAC     |
| MySQL             | PostgreSQL JSON and extension ecosystem preferred    |
| Shared database   | Violates service boundary isolation                  |
| Supabase/Firebase | External dependency; less control for portfolio demo |

---

## Consequences

### Positive

- Prisma schema as living documentation
- Migration history per service
- Strong consistency for auth and billing-adjacent data

### Negative

- Multiple PostgreSQL instances in production (or schemas with strict isolation)
- Prisma migration coordination across services

---

## Compliance

Aligned with [17-Data-Architecture.md](../17-Data-Architecture.md).
