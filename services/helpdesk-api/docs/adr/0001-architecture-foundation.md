# ADR-0001: Helpdesk SaaS Architecture Foundation

**Status:** Accepted  
**Date:** 2026-07-03  
**Deciders:** NovaDesk architecture  
**Related:** [ARCHITECTURE.md](../ARCHITECTURE.md), [ROADMAP.md](../ROADMAP.md)

---

## Context

Helpdesk SaaS is the flagship application of NovaDesk — the primary project shown to recruiters. We need an architecture that:

1. Demonstrates senior-level system design without premature implementation
2. Differs completely from the Spell case study (vocabulary learning) while matching its technical depth
3. Integrates with existing NovaDesk shared packages and services
4. Supports future AI-assisted workflows without coupling to a specific provider
5. Scales from scaffold to production incrementally via backlog items

---

## Decision

### 1. Modular monolith for the API

Implement a **single NestJS service** (`helpdesk-api`) with **22 bounded-context modules**, each following Clean Architecture layers:

- `domain/` — entities, no framework deps
- `application/` — use cases, ports, DTOs
- `infrastructure/` — Prisma repositories, messaging
- `presentation/` — controllers, validators

**Rationale:** One deployable unit simplifies the NovaDesk demo and local development. Module boundaries are explicit and extractable to microservices later (e.g. `analytics-api`).

### 2. Workspace-scoped multi-tenancy

Tenancy hierarchy: **Organization → Workspace → Resources**.

All tenant-scoped tables include `workspace_id`. RBAC via `Role` + `Permission` at workspace level.

**Rationale:** Standard B2B SaaS pattern; aligns with `docs/17-Data-Architecture.md`.

### 3. Feature-Sliced Design on the frontend

Next.js app structured as:

`app → widgets → features → entities → shared`

**Rationale:** Matches `docs/03-Coding-Standards.md`; prevents cross-feature coupling.

### 4. Prisma for initial persistence

Single `helpdesk_db` with normalized schema. No cross-service DB access.

**Rationale:** Consistent with NovaDesk stack; schema serves as living documentation.

### 5. AI as an isolated module with ports only

The `ai` module defines boundaries (`AiContext` entity, repository port) but **no provider integration** in the scaffold phase.

**Rationale:** Avoids vendor lock-in and keeps the scaffold focused on structure.

### 6. Shared packages for cross-cutting concerns

| Concern                  | Package                  |
| ------------------------ | ------------------------ |
| Auth guards / decorators | `@novadesk/auth`         |
| Env validation           | `@novadesk/config`       |
| Logging                  | `@novadesk/logger`       |
| API contracts            | `@novadesk/shared`       |
| HTTP client              | `@novadesk/sdk` (future) |
| UI components            | `@novadesk/ui`           |

**Rationale:** Demonstrates monorepo cohesion; avoids duplicating infrastructure code.

### 7. No business logic in scaffold

Controllers throw `Not implemented`; repositories return `null`; use cases delegate without rules.

**Rationale:** Explicit user requirement; enables TDD per backlog item.

---

## Consequences

### Positive

- Clear module map for parallel development
- Recruiters can navigate codebase by domain
- Easy to explain in interviews (diagrams + ADR)
- Low coupling between modules via ports

### Negative

- Large folder tree before visible features
- Some boilerplate per module (acceptable for NovaDesk depth)
- Modular monolith may need extraction if scope grows significantly

### Risks and Mitigations

| Risk                  | Mitigation                                                                     |
| --------------------- | ------------------------------------------------------------------------------ |
| Module sprawl         | Each module exports only via NestJS module; no cross-imports of infrastructure |
| Tenancy leaks         | WorkspaceGuard + repository scoping in M2                                      |
| Frontend FSD overhead | Strict import lint rules in ESLint (future)                                    |

---

## Alternatives Considered

| Alternative                           | Rejected because                          |
| ------------------------------------- | ----------------------------------------- |
| Microservices per module from day one | Operational overhead for NovaDesk demo    |
| Copy Spell architecture               | User explicitly forbade; different domain |
| Single src without modules            | Poor scalability demonstration            |
| GraphQL API                           | REST aligns with NovaDesk API standards   |

---

## Compliance

- Follows `NOVADESK_MASTER_SPEC.md`
- Uses existing shared packages
- Documented in README and ARCHITECTURE.md
- Prisma schema follows naming conventions (snake_case, UUID ids)
