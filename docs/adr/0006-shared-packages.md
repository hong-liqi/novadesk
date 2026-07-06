# ADR-0006: Shared Packages for Cross-Cutting Concerns

**Status:** Accepted  
**Date:** 2026-07-06  
**Deciders:** Li Hong  
**Related:** [15-Monorepo-Structure.md](../15-Monorepo-Structure.md), [M1 in 09-Roadmap.md](../09-Roadmap.md)

---

## Context

Six services and five applications duplicate auth logic, env validation, logging format, UI primitives, and API types without shared packages. Duplication causes drift and undermines the monorepo value proposition.

---

## Decision

Create **eight workspace packages** under `packages/`:

| Package                   | Responsibility                |
| ------------------------- | ----------------------------- |
| `@novadesk/tsconfig`      | TypeScript base configs       |
| `@novadesk/eslint-config` | ESLint flat config            |
| `@novadesk/config`        | Zod env schemas               |
| `@novadesk/shared`        | Types, enums, utilities       |
| `@novadesk/logger`        | Structured Pino logging       |
| `@novadesk/auth`          | JWT utils, guards, decorators |
| `@novadesk/sdk`           | HTTP client for service calls |
| `@novadesk/ui`            | Design system components      |

Dependency rules:

- Packages may not import from `services/` or `apps/`
- Apps and services consume packages via `workspace:*`
- UI package is framework-aware but primitives stay portable

---

## Alternatives considered

| Alternative             | Rejected because                             |
| ----------------------- | -------------------------------------------- |
| Copy-paste utils        | Drift between services; poor reviewer signal |
| npm published packages  | Overhead for private portfolio monorepo      |
| Single `common` package | God package anti-pattern; boundaries blur    |

---

## Consequences

### Positive

- Auth guard behavior identical across all NestJS services
- UI consistency across four Next.js apps
- Single place to update logging format

### Negative

- Package versioning discipline required
- Breaking changes ripple via Turborepo rebuild

---

## Compliance

Milestone M1 deliverable per [09-Roadmap.md](../09-Roadmap.md).
