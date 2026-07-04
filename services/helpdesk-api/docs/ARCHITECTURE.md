# Helpdesk SaaS — System Architecture

**Version:** 0.1.0 (scaffold)  
**Status:** Foundation  
**Last updated:** 2026-07-03

---

## 1. System Context

```mermaid
C4Context
  title Helpdesk SaaS — System Context

  Person(agent, "Support Agent", "Handles tickets and customer conversations")
  Person(admin, "Workspace Admin", "Manages teams, roles, and settings")
  Person(customer, "Customer", "Submits support requests")

  System(helpdesk, "Helpdesk SaaS", "Multi-tenant customer support platform")
  System_Ext(auth, "Auth Service", "Identity and JWT issuance")
  System_Ext(notif, "Notification Service", "Email and push delivery")
  System_Ext(ai, "AI Providers", "Future: LLM integrations")

  Rel(agent, helpdesk, "Uses")
  Rel(admin, helpdesk, "Administers")
  Rel(customer, helpdesk, "Contacts support via channels")
  Rel(helpdesk, auth, "Validates tokens")
  Rel(helpdesk, notif, "Publishes events")
  Rel(helpdesk, ai, "Optional AI assist", "Future")
```

---

## 2. Container Diagram

```mermaid
flowchart LR
  subgraph Frontend
    Next[Next.js 14<br/>helpdesk-saas :3010]
  end

  subgraph API_Layer
    GW[Gateway :3000]
    API[helpdesk-api :3003]
  end

  subgraph Shared_Services
    Auth[auth-service :3001]
    Notif[notification-service :3002]
  end

  subgraph Storage
    DB[(helpdesk_db)]
    Cache[(Redis)]
    Queue[BullMQ]
  end

  Next -->|REST| GW
  GW --> API
  GW --> Auth
  API --> DB
  API --> Cache
  API --> Queue
  API -.-> Notif
```

---

## 3. Backend Layer Architecture

Each bounded context follows **Clean Architecture**:

```mermaid
flowchart TB
  subgraph Presentation
    C[Controllers]
    G[Guards / Middlewares]
    V[Validators]
  end

  subgraph Application
    UC[Use Cases]
    DTO[DTOs]
    P[Ports]
  end

  subgraph Domain
    E[Entities]
    VO[Value Objects]
    EX[Exceptions]
  end

  subgraph Infrastructure
    R[Repositories]
    MQ[Messaging]
    EXT[External APIs]
  end

  C --> UC
  UC --> P
  P -.-> R
  UC --> E
  R --> DB[(Prisma / PostgreSQL)]
```

**Dependency rule:** dependencies point inward. Domain has zero framework imports.

---

## 4. Application Request Flow

```mermaid
sequenceDiagram
  participant Client
  participant Gateway
  participant HelpdeskAPI
  participant Guard
  participant Controller
  participant UseCase
  participant Repository
  participant DB

  Client->>Gateway: GET /api/v1/tickets/:id
  Gateway->>HelpdeskAPI: Forward + JWT
  HelpdeskAPI->>Guard: Validate auth and workspace
  Guard->>Controller: Authorized request
  Controller->>UseCase: execute(id)
  UseCase->>Repository: findById(id)
  Repository->>DB: SELECT
  DB-->>Repository: row
  Repository-->>UseCase: Ticket entity
  UseCase-->>Controller: result
  Controller-->>Client: 200 JSON
```

---

## 5. Authentication Flow

```mermaid
sequenceDiagram
  participant User
  participant Frontend
  participant Gateway
  participant AuthService
  participant HelpdeskAPI

  User->>Frontend: Sign in
  Frontend->>Gateway: POST /api/v1/auth/login
  Gateway->>AuthService: Credentials
  AuthService-->>Gateway: access and refresh tokens
  Gateway-->>Frontend: JWT pair
  Frontend->>Frontend: Store tokens securely

  User->>Frontend: Open ticket
  Frontend->>Gateway: GET /api/v1/tickets (Bearer)
  Gateway->>HelpdeskAPI: Forward JWT
  HelpdeskAPI->>HelpdeskAPI: Validate via NovaDesk auth
  HelpdeskAPI-->>Frontend: Ticket data
```

---

## 6. Module Interaction Map

```mermaid
flowchart TB
  subgraph Tenancy
    ORG[organizations]
    WS[workspaces]
    TEAMS[teams]
    ROLES[roles]
    PERM[permissions]
  end

  subgraph Identity
    USERS[users]
    AUTH[auth]
  end

  subgraph Support
    CUST[customers]
    CONT[contacts]
    TICK[tickets]
    MSG[messages]
    CH[channels]
  end

  subgraph Platform
    KB[knowledge-base]
    AUTO[automations]
    AI[ai]
    NOTIF[notifications]
    AUDIT[audit]
    FILES[files]
    SET[settings]
  end

  subgraph ReadModels
    DASH[dashboard]
    ANAL[analytics]
    SEARCH[search]
  end

  ORG --> WS
  WS --> TEAMS
  WS --> ROLES
  ROLES --> PERM
  WS --> CUST
  CUST --> CONT
  CUST --> TICK
  CONT --> TICK
  TICK --> MSG
  CH --> TICK
  TICK --> FILES
  WS --> KB
  WS --> AUTO
  AUTO -.-> AI
  TICK -.-> AI
  USERS --> TICK
  USERS --> MSG
  WS --> SET
  WS --> AUDIT
  TICK --> DASH
  TICK --> ANAL
  KB --> SEARCH
  TICK --> SEARCH
  USERS --> NOTIF
```

---

## 7. Frontend Architecture (FSD)

```mermaid
flowchart TB
  subgraph app_layer[app Routes]
    Pages[page.tsx and layout.tsx]
  end

  subgraph widgets_layer[widgets]
    Shell[AppShell]
    Side[Sidebar]
    Head[Header]
  end

  subgraph features_layer[features]
    Tickets[tickets]
    Inbox[inbox]
    Settings[settings]
  end

  subgraph entities_layer[entities]
    TicketE[ticket]
    UserE[user]
  end

  subgraph shared_layer[shared]
    API[services]
    Hooks[hooks]
    Stores[stores]
    Prov[providers]
  end

  Pages --> Shell
  Shell --> Side
  Shell --> Head
  Pages --> features_layer
  features_layer --> entities_layer
  features_layer --> shared_layer
  widgets_layer --> shared_layer
```

**Import rule:** `app → widgets → features → entities → shared` (no upward imports).

---

## 8. Data Model (Core Entities)

```mermaid
erDiagram
  Organization ||--o{ Workspace : has
  Workspace ||--o{ Team : has
  Workspace ||--o{ Role : has
  Role ||--o{ RolePermission : has
  Permission ||--o{ RolePermission : has
  Workspace ||--o{ Customer : has
  Customer ||--o{ Contact : has
  Workspace ||--o{ Ticket : has
  Customer ||--o{ Ticket : opens
  Contact ||--o{ Ticket : opens
  Ticket ||--o{ Message : contains
  User ||--o{ Message : writes
  Workspace ||--o{ KnowledgeArticle : has
  Workspace ||--o{ Channel : has
  Workspace ||--o{ Automation : has
  Ticket ||--o{ File : attaches
  User ||--o{ Notification : receives
```

Full schema: `prisma/schema.prisma`

---

## 9. Deployment Topology (Local)

```mermaid
flowchart LR
  Dev[Developer] --> Nginx
  Nginx -->|/helpdesk| Next
  Nginx -->|/api/v1| Gateway
  Gateway --> HelpdeskAPI
  Gateway --> Auth
  HelpdeskAPI --> Postgres
  HelpdeskAPI --> Redis
```

---

## 10. Implementation Status (2026-07-03)

| Area                                   | Status                                |
| -------------------------------------- | ------------------------------------- |
| Organizations, Workspaces              | ✅ Implemented                        |
| Customers, Contacts                    | ✅ Implemented                        |
| Tickets, Messages                      | ✅ Implemented                        |
| Dashboard stats                        | ✅ Implemented                        |
| Auth integration (Gateway JWT headers) | ✅ Implemented                        |
| Knowledge Base, Search, AI             | 🔲 Scaffold                           |
| Channels, Automations                  | 🔲 Scaffold                           |
| Real-time WebSocket                    | 🔲 Delegated to realtime-chat service |

---
