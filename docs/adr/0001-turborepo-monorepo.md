# ADR-0001: Turborepo Monorepo Orchestration

**Status:** Accepted  
**Date:** 2026-07-06  
**Deciders:** Li Hong  
**Related:** [15-Monorepo-Structure.md](../15-Monorepo-Structure.md), [02-Tech-Stack.md](../02-Tech-Stack.md)

---

## Context

NovaDesk contains five applications, six backend services, and eight shared packages in a single repository. We need build orchestration that:

1. Parallelizes tasks across workspaces
2. Caches build outputs between CI runs and local development
3. Respects dependency order (packages before services before apps)
4. Keeps CI fast enough for a solo maintainer workflow

---

## Decision

Adopt **pnpm workspaces** for dependency linking and **Turborepo 2** for task pipelines (`build`, `lint`, `test`, `typecheck`, `dev`).

Pipeline rules in `turbo.json`:

- `build` depends on `^build` (upstream packages first)
- Outputs cached: `.next/**`, `dist/**`
- `dev` is persistent and uncached

---

## Alternatives considered

| Alternative         | Rejected because                                                |
| ------------------- | --------------------------------------------------------------- |
| Nx                  | Heavier configuration for portfolio scope; Turborepo sufficient |
| Lerna               | Less active ecosystem; weaker caching story                     |
| Separate repos      | Loses atomic cross-service changes and shared CI                |
| npm workspaces only | No task caching or pipeline DAG                                 |

---

## Consequences

### Positive

- Single `pnpm turbo build` validates entire monorepo
- CI time reduced via remote-aware cache keys
- Clear task graph visible in `turbo.json`

### Negative

- Turborepo adds a dependency and learning curve
- Cache invalidation requires discipline on env var changes

---

## Compliance

Aligns with [00-Vision.md](../00-Vision.md) goal of demonstrating monorepo engineering maturity.
