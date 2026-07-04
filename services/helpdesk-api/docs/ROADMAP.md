# Helpdesk SaaS — Product Roadmap

**Version:** 0.2.0  
**Horizon:** 6 milestones  
**Status:** M3 in progress

---

## M1 — Foundation ✅

**Goal:** Solid architecture scaffold ready for incremental implementation.

| Deliverable                           | Status    |
| ------------------------------------- | --------- |
| Backend module structure (22 modules) | ✅        |
| Frontend FSD structure                | ✅        |
| Prisma initial schema                 | ✅        |
| README, ADR, architecture diagrams    | ✅        |
| Docker / env templates                | ✅        |
| Gateway routing to helpdesk-api       | ✅ BL-262 |

---

## M2 — Identity & Tenancy ✅

**Goal:** Users can authenticate and operate within a workspace.

| Feature                           | Status                   |
| --------------------------------- | ------------------------ |
| Workspace CRUD                    | ✅                       |
| Organization management           | ✅                       |
| RBAC (roles + permissions)        | ✅ schema + auth-service |
| Workspace switcher (frontend)     | ✅                       |
| Integration with auth-service JWT | ✅ via Gateway headers   |

**Exit criteria:** Agent logs in, selects workspace, sees dashboard — **met**.

---

## M3 — Core Ticketing ✅

**Goal:** End-to-end ticket lifecycle without channel integrations.

| Feature                                       | Status       |
| --------------------------------------------- | ------------ |
| Create / list / view tickets                  | ✅ REST + UI |
| Assign to agent / team                        | ✅           |
| Status transitions (open → resolved → closed) | ✅           |
| Internal & public messages                    | ✅           |
| Customer & contact linking                    | ✅           |
| Dashboard KPIs                                | ✅           |

**Exit criteria:** Agent creates ticket, replies, resolves — **met**.

---

## M4 — Channels & Inbox (Partial)

**Goal:** Unified inbox across intake channels.

| Feature                 | Status                    |
| ----------------------- | ------------------------- |
| Email channel (inbound) | 🔲 notification-service   |
| Chat widget (WebSocket) | 🔲 realtime-chat service  |
| Inbox view with filters | ✅ pending tickets filter |
| Channel routing rules   | 🔲 automations module     |

---

## M5 — Knowledge Base & Search

**Goal:** Self-service and fast information retrieval.

| Feature                              | Status                   |
| ------------------------------------ | ------------------------ |
| Article CRUD                         | 🔲 knowledge-base module |
| Full-text search                     | 🔲 search module         |
| Article suggestions on ticket create | 🔲                       |

---

## M6 — Analytics, Automations & AI Assist

**Goal:** Operational intelligence and workflow automation.

| Feature                 | Status         |
| ----------------------- | -------------- |
| Dashboard KPIs          | ✅ basic stats |
| Automation rules engine | 🔲             |
| AI draft replies        | 🔲             |
| SLA tracking            | 🔲             |

---

## Technical Debt & Hardening (Ongoing)

- E2E tests (Playwright) per critical flow — partial smoke test
- Integration tests per module — pending
- OpenAPI contract tests — pending
- Performance benchmarks — pending
- RLS policies for workspace isolation — pending

---

## Dependencies on NovaDesk

| Dependency           | Status                     |
| -------------------- | -------------------------- |
| auth-service         | ✅ implemented             |
| gateway              | ✅ proxy + JWT validation  |
| notification-service | 🔲 shell only              |
| @novadesk/sdk        | ✅ auth + helpdesk clients |
| @novadesk/ui         | ✅ design system           |

---

## Out of Scope (NovaDesk Demo)

- Billing / subscriptions
- White-label theming
- Mobile native apps
- SOC2 compliance automation
