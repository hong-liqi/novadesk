# Case Study — Teste de Perfil

**Version:** 3.0  
**Status:** Approved  
**Last updated:** 2026-07-06  
**Type:** Prior production system (narrative documentation, source not in this repository)

---

## Overview

Teste de Perfil is a behavioral profile assessment platform for Paulo Odorico and partners (Projeto Vender Mais, Conexão Lucrativa). It delivers DISC-based assessments for online courses, corporate training events, and investor profiling — with personalized PDF workbooks generated server-side.

**Role:** Full-stack engineer — architecture, assessment engine, PDF pipeline, admin tooling, deployment.  
**Production:** testeperfil.pauloodorico.com.br

---

## Business Problem

Partners needed to deliver behavioral profile assessments at scale — for online course students, in-person training participants, and corporate events. Manual processes (spreadsheets, ad-hoc printing, email PDF delivery) did not scale and did not integrate with course platforms (Kiwify, Hotmart).

---

## Requirements

| Category   | Requirement                                                         |
| ---------- | ------------------------------------------------------------------- |
| Assessment | DISC model — Executor, Communicator, Planner, Analyst profiles      |
| Flow 1     | Online course access via platform token (Kiwify/Hotmart params)     |
| Flow 2     | Corporate events with classes; result hidden until printed at event |
| Flow 3     | Free investor profile test with immediate online result             |
| Output     | Personalized PDF workbook per participant                           |
| Admin      | Class/event management, CSV export, batch PDF ZIP for print shops   |
| Analytics  | Funnel tracking: visits, starts, completions, drop-off per question |

---

## Architecture

Teste de Perfil uses a **Next.js App Router monolith** with API Route Handlers and PostgreSQL — no separate backend service.

| Flow                  | Route                    | Audience                            |
| --------------------- | ------------------------ | ----------------------------------- |
| Teste de Perfil       | `/teste-perfil`          | Projeto Vender Mais course students |
| Perfil Comportamental | `/perfil-comportamental` | Corporate training events           |
| Conexão Lucrativa     | `/cl`                    | Investor profiling (free)           |

Each flow has separate question banks, Prisma tables, and UX rules while sharing PDF infrastructure and deployment.

---

## System Diagram

```mermaid
flowchart TB
    subgraph flows [Assessment Flows]
        TP[/teste-perfil 20 questions/]
        PC[/perfil-comportamental 24 questions/]
        CL[/cl investor profile/]
    end

    subgraph next [Next.js App Router]
        API[API Route Handlers]
        ADMIN[Admin Panels PC + CL]
        METRICS[/metrics Dashboard]
    end

    subgraph processing [Document Pipeline]
        SCORE[Scoring Engine]
        PUP[Puppeteer + Chromium]
        QUEUE[Email Queue Worker]
    end

    subgraph data [Data]
        PG[(PostgreSQL Prisma)]
    end

    TP --> API
    PC --> API
    CL --> API
    API --> SCORE
    SCORE --> PG
    API --> PUP
    PUP --> QUEUE
    ADMIN --> API
    METRICS --> PG
```

---

## Technology Stack

| Layer     | Technology                                      |
| --------- | ----------------------------------------------- |
| Framework | Next.js 16 (App Router), React 19, TypeScript   |
| Styling   | Tailwind CSS 4                                  |
| Database  | PostgreSQL, Prisma 6                            |
| Charts    | Chart.js + react-chartjs-2                      |
| PDF       | Puppeteer-core + Chromium, pdf-lib, jsPDF       |
| Email     | Nodemailer (SMTP), file-based queue (`.queue/`) |
| Export    | JSZip (batch workbook generation)               |
| Deploy    | Docker multi-stage, CapRover                    |

---

## Key Features

1. **Three products, one codebase** — Shared infrastructure; isolated Prisma models per flow
2. **Scoring engine** — Profile points, percentages, ranking across four DISC profiles
3. **PDF generation** — Puppeteer renders internal `?print=true` URL to A4 PDF with charts
4. **Email queue** — Worker polling (15s) with configurable delay (default 7 min post-completion)
5. **Course integration** — URL params from Kiwify/Hotmart → `tp_auth` cookie
6. **Corporate batch export** — ZIP of all class PDFs for print shop; browser print route for events
7. **Funnel analytics** — `/metrics` dashboard: visits, completion rate, per-question drop-off

---

## Engineering Challenges

### Three products in one repository

Different UX rules per flow: show vs hide result, token-gated vs free access, immediate vs deferred delivery.

### Server-side PDF with charts

Puppeteer must wait for Chart.js canvas render; batch ZIP for entire classes can take minutes.

### Deployment and migrations

Prisma sqlite → PostgreSQL migration conflict (P3019) during production adoption.

### Simple email queue

Jobs deleted on process without automatic SMTP failure retry.

### Corporate privacy

Participant does not see result online — print pipeline must be ready before the event.

---

## Trade-offs

| Decision     | Chosen                 | Alternative                     | Rationale                                          |
| ------------ | ---------------------- | ------------------------------- | -------------------------------------------------- |
| Architecture | Next.js monolith       | Separate API service            | Solo maintainer; low operational overhead          |
| PDF engine   | Puppeteer              | react-pdf / PDFKit              | Charts and complex layout need real browser render |
| Email queue  | File-based polling     | Redis/BullMQ                    | Sufficient volume; simpler deploy                  |
| DB per flow  | Separate Prisma models | Single generic assessment table | Flow-specific fields without over-abstraction      |
| Corporate UX | Hide result online     | Show immediately                | Business requirement for event reveal              |

---

## Security

| Control       | Implementation                                        |
| ------------- | ----------------------------------------------------- |
| Course access | `TESTE_PERFIL_TOKEN` + platform URL params            |
| Session auth  | `tp_auth` cookie after token validation               |
| Admin         | Shared admin credentials per flow (PC/CL)             |
| Class links   | UUID `linkToken` per corporate class                  |
| Data privacy  | Corporate results not shown to participants pre-event |
| SMTP          | Credentials via environment variables                 |

---

## Performance

| Area           | Approach                                                |
| -------------- | ------------------------------------------------------- |
| Assessment UX  | One question per screen; progress bar; minimal payload  |
| PDF generation | Internal `INTERNAL_BASE_URL`; canvas wait timeout       |
| Batch ZIP      | Admin UI communicates processing time for large classes |
| Email queue    | 15s poll interval; delayed send reduces SMTP burst      |
| Metrics        | Aggregated queries; `/metrics` for funnel visualization |

---

## Scalability

| Dimension        | Strategy                                                    |
| ---------------- | ----------------------------------------------------------- |
| Concurrent users | Stateless Next.js handlers; PostgreSQL connection pool      |
| PDF load         | Sequential generation in batch; queue for email             |
| Storage          | PostgreSQL for all participant data; no blob store needed   |
| New flows        | New Prisma models + routes; shared PDF/email infrastructure |

---

## Deployment

| Environment | URL                             | Notes                       |
| ----------- | ------------------------------- | --------------------------- |
| Production  | testeperfil.pauloodorico.com.br | CapRover Docker multi-stage |
| PDF render  | Internal Docker network URL     | Chromium in container       |
| Migrations  | Prisma migrate deploy           | PostgreSQL in production    |

---

## Lessons Learned

1. **UX context beats single flow** — Course shows result; corporate hides until event; CL is immediate and free.
2. **Puppeteer in Docker is product infrastructure** — Chromium, internal URL, and timeouts are core, not extras.
3. **Course platform integration** — URL params (Kiwify/Hotmart) and access tokens avoid duplicate registration.
4. **Batch export is critical operations** — ZIP for print shops needs UX that communicates processing time.
5. **Simplified DISC scales** — Four profiles with percentages serve sales, HR, and financial education with one engine.

---

## Screenshots

| Screen          | Route                     | Description                                    |
| --------------- | ------------------------- | ---------------------------------------------- |
| Assessment      | `/teste-perfil`           | One-question-per-screen with progress          |
| Result + PDF    | `/teste-perfil/resultado` | Profile breakdown and download                 |
| Metrics         | `/metrics`                | Funnel analytics dashboard                     |
| Admin classes   | `/admin/pc`               | Class management, CSV, batch ZIP               |
| Investor result | `/cl/resultado/{id}`      | Investor profile (Arrojado, Conservador, etc.) |

_Screenshots available on request during technical interviews._

---

## Roadmap (at handoff)

| Phase | Item                            | Status     |
| ----- | ------------------------------- | ---------- |
| v1.0  | Teste de Perfil course flow     | Shipped    |
| v1.5  | Perfil Comportamental corporate | Shipped    |
| v2.0  | Conexão Lucrativa investor flow | Shipped    |
| v2.5  | Email queue retry logic         | Planned    |
| v3.0  | Hotmart webhook integration     | Evaluating |

---

## Relation to NovaDesk

Concepts from Teste de Perfil that inform NovaDesk:

- Report and PDF generation (Analytics export)
- State-based flows with progress tracking (onboarding, tickets)
- Admin with classes/organizations (multi-tenant HelpDesk)
- Token/invite-based auth (Admin Portal invites)
- Funnel and drop-off metrics (Analytics Dashboard)
- CapRover containerized deploy (same pattern as NovaDesk)
