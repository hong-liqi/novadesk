# ADR-0003: Next.js App Router for Frontends

**Status:** Accepted  
**Date:** 2026-07-06  
**Deciders:** Li Hong  
**Related:** [02-Tech-Stack.md](../02-Tech-Stack.md), [03-Coding-Standards.md](../03-Coding-Standards.md)

---

## Context

NovaDesk has four SaaS applications plus a public marketing/documentation website. Frontend technology must support SSR for SEO (website), client-heavy dashboards (HelpDesk, Analytics), and shared UI components across apps.

---

## Decision

Use **Next.js 14 with App Router** for all frontends:

| App       | Package                         | Purpose                                   |
| --------- | ------------------------------- | ----------------------------------------- |
| Website   | `@novadesk/website`             | Portfolio, case studies, engineering docs |
| HelpDesk  | `@novadesk/helpdesk-saas`       | Ticket management UI                      |
| Analytics | `@novadesk/analytics-dashboard` | KPI dashboards                            |
| Admin     | `@novadesk/admin-panel`         | Platform administration                   |
| Chat      | `@novadesk/realtime-chat`       | Realtime messaging UI                     |

Conventions:

- Server Components by default
- Client Components only for interactivity (forms, charts, WebSocket)
- Feature-Sliced Design folder structure in SaaS apps
- Shared UI from `@novadesk/ui`

---

## Alternatives considered

| Alternative      | Rejected because                                     |
| ---------------- | ---------------------------------------------------- |
| Vite + React SPA | No SSR for website; worse SEO for portfolio          |
| Remix            | Smaller hiring signal; team familiarity with Next.js |
| Pages Router     | App Router is current standard; RSC benefits         |

---

## Consequences

### Positive

- One React framework across all apps
- SSG for case studies and engineering pages
- API routes only at integration boundaries (contact form proxy)

### Negative

- App Router complexity for WebSocket-heavy chat
- Multiple Next.js builds in CI (mitigated by Turborepo cache)

---

## Compliance

Matches [03-Coding-Standards.md](../03-Coding-Standards.md) frontend conventions.
