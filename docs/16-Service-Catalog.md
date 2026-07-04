# 16 — Catálogo de Serviços

**Versão:** 1.0  
**Status:** Aprovado  
**Última atualização:** 2026-07-03  
**Relacionado:** [01-Architecture.md](./01-Architecture.md), [17-Data-Architecture.md](./17-Data-Architecture.md), [07-Security.md](./07-Security.md)

---

## 1. Objetivo

Documentar cada serviço e aplicação do NovaDesk: responsabilidades, APIs, dependências, comunicação, dados e contratos.

---

## 2. Mapa de serviços

| ID     | Nome                           | Tipo         | Porta     | Criticality |
| ------ | ------------------------------ | ------------ | --------- | ----------- |
| APP-01 | Auth Service                   | Backend      | 3001      | Critical    |
| APP-02 | API Gateway                    | Backend      | 3000      | Critical    |
| APP-03 | Notification Service           | Backend      | 3002      | High        |
| APP-04 | HelpDesk SaaS (API + UI)       | Full-stack   | 3003/3010 | High        |
| APP-05 | Analytics Dashboard (API + UI) | Full-stack   | 3004/3011 | Medium      |
| APP-06 | Realtime Chat                  | Backend + WS | 3005      | Medium      |
| APP-07 | Admin Portal                   | Frontend     | 3012      | High        |
| APP-08 | NovaDesk Website               | Frontend     | 3013      | Low         |

---

## 3. APP-01 — Auth Service

### 3.1 Responsabilidades

| Responsabilidade    | Detalhe                                           |
| ------------------- | ------------------------------------------------- |
| Registro de usuário | Email + password, verificação de e-mail           |
| Autenticação        | Login, logout, refresh token rotation             |
| Autorização         | RBAC, roles, permissions                          |
| Gestão de tenants   | CRUD de tenants, associação user↔tenant           |
| Gestão de usuários  | CRUD, profile, password reset                     |
| Emissão JWT         | Access token (RS256) + refresh token (opaque)     |
| JWKS                | Endpoint público de chaves                        |
| Service tokens      | Emissão de tokens para comunicação inter-serviços |
| Audit log           | Login, logout, role changes, password changes     |

### 3.2 O que NÃO faz

- Não armazena dados de negócio (tickets, analytics, chat)
- Não envia e-mails diretamente (delega para Notification Service)
- Não faz roteamento de requests

### 3.3 APIs principais

| Método | Path                           | Descrição               |
| ------ | ------------------------------ | ----------------------- |
| POST   | `/api/v1/auth/register`        | Registro                |
| POST   | `/api/v1/auth/login`           | Login                   |
| POST   | `/api/v1/auth/refresh`         | Refresh token           |
| POST   | `/api/v1/auth/logout`          | Logout                  |
| POST   | `/api/v1/auth/forgot-password` | Solicitar reset         |
| POST   | `/api/v1/auth/reset-password`  | Resetar senha           |
| GET    | `/api/v1/auth/me`              | Perfil autenticado      |
| GET    | `/api/v1/users`                | Listar usuários (admin) |
| POST   | `/api/v1/users`                | Criar usuário (admin)   |
| GET    | `/api/v1/tenants`              | Listar tenants          |
| POST   | `/api/v1/tenants`              | Criar tenant            |
| GET    | `/.well-known/jwks.json`       | JWKS                    |

### 3.4 Dependências

| Dependência            | Tipo  | Uso                                       |
| ---------------------- | ----- | ----------------------------------------- |
| PostgreSQL (`auth_db`) | Sync  | Persistência                              |
| Redis                  | Sync  | Refresh tokens, rate limiting, JWKS cache |
| BullMQ (`auth-queue`)  | Async | Envio de e-mail de verificação/reset      |
| Notification Service   | Async | Via fila — envio de e-mails               |

### 3.5 Eventos publicados

| Evento                          | Fila                 | Payload                          |
| ------------------------------- | -------------------- | -------------------------------- |
| `user.registered`               | `notification-queue` | userId, email, verificationToken |
| `user.password-reset-requested` | `notification-queue` | userId, email, resetToken        |
| `user.role-changed`             | `notification-queue` | userId, oldRole, newRole         |

---

## 4. APP-02 — API Gateway

### 4.1 Responsabilidades

| Responsabilidade | Detalhe                                     |
| ---------------- | ------------------------------------------- |
| Roteamento       | Proxy para serviços backend por path prefix |
| Autenticação     | Validação JWT via JWKS                      |
| Rate limiting    | Por IP e por user                           |
| Request ID       | Geração e propagação                        |
| CORS             | Política por ambiente                       |
| Circuit breaker  | Proteção contra serviços down               |
| Health agregado  | Status de todos os serviços                 |
| TLS termination  | Via Nginx upstream                          |

### 4.2 O que NÃO faz

- Lógica de negócio
- Persistência de dados
- Transformação de payloads (passthrough)

### 4.3 Roteamento

| Path prefix               | Destino                   | Auth                             |
| ------------------------- | ------------------------- | -------------------------------- |
| `/api/v1/auth/*`          | auth-service:3001         | Parcial (login/register público) |
| `/api/v1/notifications/*` | notification-service:3002 | Sim                              |
| `/api/v1/tickets/*`       | helpdesk-api:3003         | Sim                              |
| `/api/v1/analytics/*`     | analytics-api:3004        | Sim                              |
| `/api/v1/chat/*`          | realtime-chat:3005        | Sim                              |
| `/ws/*`                   | realtime-chat:3005        | Sim (upgrade)                    |
| `/health`                 | Gateway (agregado)        | Não                              |
| `/metrics`                | Gateway                   | Não (interno)                    |

### 4.4 Dependências

| Dependência       | Tipo | Uso                                  |
| ----------------- | ---- | ------------------------------------ |
| Redis             | Sync | Rate limiting, circuit breaker state |
| Auth Service      | Sync | JWKS fetch                           |
| Todos os serviços | Sync | Proxy                                |

---

## 5. APP-03 — Notification Service

### 5.1 Responsabilidades

| Responsabilidade            | Detalhe                                    |
| --------------------------- | ------------------------------------------ |
| E-mail transacional         | Verificação, reset, notificações de ticket |
| E-mail marketing (futuro)   | Newsletter do NovaDesk                     |
| Push notifications (futuro) | v1.1                                       |
| In-app notifications        | Persistência e entrega                     |
| Template engine             | Templates HTML para e-mails                |
| Delivery tracking           | Status de envio, retry, DLQ                |

### 5.2 APIs principais

| Método | Path                                 | Descrição                     |
| ------ | ------------------------------------ | ----------------------------- |
| GET    | `/api/v1/notifications`              | Listar notificações do user   |
| PATCH  | `/api/v1/notifications/:id/read`     | Marcar como lida              |
| GET    | `/api/v1/notifications/unread-count` | Contagem não lidas            |
| POST   | `/api/v1/notifications/send`         | Envio interno (service token) |

### 5.3 Dependências

| Dependência                    | Tipo  | Uso                                   |
| ------------------------------ | ----- | ------------------------------------- |
| PostgreSQL (`notification_db`) | Sync  | Templates, logs, in-app notifications |
| Redis                          | Sync  | Rate limiting de envio                |
| BullMQ (`notification-queue`)  | Async | Processamento de envio                |
| SMTP server                    | Async | Envio de e-mails                      |

### 5.4 Eventos consumidos

| Evento                          | Origem   | Ação                         |
| ------------------------------- | -------- | ---------------------------- |
| `user.registered`               | Auth     | Enviar e-mail de verificação |
| `user.password-reset-requested` | Auth     | Enviar e-mail de reset       |
| `ticket.created`                | HelpDesk | Notificar agentes            |
| `ticket.assigned`               | HelpDesk | Notificar agente             |
| `ticket.resolved`               | HelpDesk | Notificar usuário            |
| `ticket.comment-added`          | HelpDesk | Notificar participantes      |
| `chat.message`                  | Chat     | Notificar offline users      |

---

## 6. APP-04 — HelpDesk SaaS

### 6.1 Componentes

| Componente   | Tipo               | Porta |
| ------------ | ------------------ | ----- |
| HelpDesk API | Backend (NestJS)   | 3003  |
| HelpDesk App | Frontend (Next.js) | 3010  |

### 6.2 Responsabilidades

| Responsabilidade              | Detalhe                           |
| ----------------------------- | --------------------------------- |
| Gestão de tickets             | CRUD, status workflow, prioridade |
| Atribuição                    | Agentes, filas, auto-assign       |
| Comentários                   | Thread de comunicação por ticket  |
| SLA                           | Tempo de resposta e resolução     |
| Categorias e tags             | Organização de tickets            |
| Anexos (futuro)               | v1.1                              |
| Base de conhecimento (futuro) | v1.2                              |
| Multi-tenancy                 | Isolamento por tenant             |

### 6.3 Ticket workflow

```
open → in_progress → waiting_customer → resolved → closed
  │         │              │                │
  └─────────┴──────────────┴────────────────┘
                    ↓
                 cancelled
```

### 6.4 APIs principais

| Método | Path                           | Descrição                           |
| ------ | ------------------------------ | ----------------------------------- |
| GET    | `/api/v1/tickets`              | Listar tickets (paginado, filtrado) |
| POST   | `/api/v1/tickets`              | Criar ticket                        |
| GET    | `/api/v1/tickets/:id`          | Detalhe do ticket                   |
| PATCH  | `/api/v1/tickets/:id`          | Atualizar ticket                    |
| POST   | `/api/v1/tickets/:id/comments` | Adicionar comentário                |
| POST   | `/api/v1/tickets/:id/assign`   | Atribuir agente                     |
| GET    | `/api/v1/tickets/:id/history`  | Histórico de alterações             |
| GET    | `/api/v1/categories`           | Listar categorias                   |
| GET    | `/api/v1/agents`               | Listar agentes do tenant            |

### 6.5 Dependências

| Dependência                | Tipo    | Uso                              |
| -------------------------- | ------- | -------------------------------- |
| PostgreSQL (`helpdesk_db`) | Sync    | Tickets, comments, categories    |
| Redis                      | Sync    | Cache de listagens, SLA timers   |
| BullMQ (`helpdesk-queue`)  | Async   | SLA checks, auto-assign, eventos |
| Auth Service               | Sync    | Validação de users/agents        |
| Notification Service       | Async   | Via fila — notificações          |
| Realtime Chat              | Sync/WS | Chat associado a ticket          |

### 6.6 Eventos publicados

| Evento                  | Fila                 | Payload                        |
| ----------------------- | -------------------- | ------------------------------ |
| `ticket.created`        | `notification-queue` | ticketId, tenantId, userId     |
| `ticket.assigned`       | `notification-queue` | ticketId, agentId              |
| `ticket.status-changed` | `analytics-queue`    | ticketId, oldStatus, newStatus |
| `ticket.resolved`       | `notification-queue` | ticketId, userId               |
| `ticket.comment-added`  | `notification-queue` | ticketId, commentId            |

---

## 7. APP-05 — Analytics Dashboard

### 7.1 Componentes

| Componente    | Tipo               | Porta |
| ------------- | ------------------ | ----- |
| Analytics API | Backend (NestJS)   | 3004  |
| Analytics App | Frontend (Next.js) | 3011  |

### 7.2 Responsabilidades

| Responsabilidade    | Detalhe                          |
| ------------------- | -------------------------------- |
| Métricas de tickets | Criados, resolvidos, tempo médio |
| Métricas de agentes | Performance, tickets por agente  |
| Métricas de SLA     | Compliance, breaches             |
| Dashboards          | Visualizações interativas        |
| Relatórios          | Exportação CSV/PDF               |
| Filtros temporais   | Dia, semana, mês, custom range   |
| Multi-tenancy       | Dados isolados por tenant        |

### 7.3 APIs principais

| Método | Path                         | Descrição            |
| ------ | ---------------------------- | -------------------- |
| GET    | `/api/v1/analytics/overview` | KPIs gerais          |
| GET    | `/api/v1/analytics/tickets`  | Métricas de tickets  |
| GET    | `/api/v1/analytics/agents`   | Métricas de agentes  |
| GET    | `/api/v1/analytics/sla`      | Métricas de SLA      |
| GET    | `/api/v1/analytics/trends`   | Tendências temporais |
| POST   | `/api/v1/analytics/export`   | Exportar relatório   |

### 7.4 Dependências

| Dependência                 | Tipo  | Uso                              |
| --------------------------- | ----- | -------------------------------- |
| PostgreSQL (`analytics_db`) | Sync  | Aggregations, materialized views |
| Redis                       | Sync  | Cache de queries pesadas         |
| BullMQ (`analytics-queue`)  | Async | Agregações, exports              |
| HelpDesk API                | Async | Via eventos — dados de tickets   |

### 7.5 Eventos consumidos

| Evento                  | Origem   | Ação                     |
| ----------------------- | -------- | ------------------------ |
| `ticket.status-changed` | HelpDesk | Atualizar agregações     |
| `ticket.created`        | HelpDesk | Incrementar contadores   |
| `ticket.resolved`       | HelpDesk | Calcular resolution time |

---

## 8. APP-06 — Realtime Chat

### 8.1 Responsabilidades

| Responsabilidade        | Detalhe                                |
| ----------------------- | -------------------------------------- |
| Mensagens em tempo real | WebSocket bidirecional                 |
| Salas de chat           | Por ticket, por tenant                 |
| Presença                | Online/offline/typing                  |
| Histórico               | Persistência de mensagens              |
| Notificações            | Offline users via Notification Service |

### 8.2 APIs principais

| Método   | Path                              | Descrição               |
| -------- | --------------------------------- | ----------------------- |
| GET      | `/api/v1/chat/rooms`              | Listar salas            |
| GET      | `/api/v1/chat/rooms/:id/messages` | Histórico (paginado)    |
| WS       | `/ws/chat`                        | WebSocket endpoint      |
| WS event | `message:send`                    | Enviar mensagem         |
| WS event | `message:received`                | Receber mensagem        |
| WS event | `presence:update`                 | Atualização de presença |
| WS event | `typing:start/stop`               | Indicador de digitação  |

### 8.3 Dependências

| Dependência            | Tipo  | Uso                                  |
| ---------------------- | ----- | ------------------------------------ |
| PostgreSQL (`chat_db`) | Sync  | Mensagens, salas                     |
| Redis                  | Sync  | Pub/sub, presença, adapter Socket.IO |
| BullMQ (`chat-queue`)  | Async | Notificações offline                 |
| Auth Service           | Sync  | Validação JWT em WS handshake        |
| Notification Service   | Async | Notificar usuários offline           |

---

## 9. APP-07 — Admin Portal

### 9.1 Responsabilidades

| Responsabilidade          | Detalhe                         |
| ------------------------- | ------------------------------- |
| Gestão de tenants         | CRUD, configurações             |
| Gestão de usuários        | CRUD, roles, convites           |
| Visão geral da plataforma | Dashboard admin                 |
| Configurações globais     | Feature flags (futuro)          |
| Audit log viewer          | Visualização de audit logs      |
| Gestão de serviços        | Health status, métricas básicas |

### 9.2 Dependências (via SDK)

| Serviço       | Uso                     |
| ------------- | ----------------------- |
| Auth Service  | Gestão de users/tenants |
| API Gateway   | Todas as chamadas       |
| Analytics API | Métricas da plataforma  |

---

## 10. APP-08 — NovaDesk Website

### 10.1 Responsabilidades

| Responsabilidade      | Detalhe                             |
| --------------------- | ----------------------------------- |
| Showcase do portfólio | Projetos, skills, experiência       |
| Case studies          | Spell, Broom, Teste de Perfil       |
| Blog (futuro)         | Artigos técnicos                    |
| Formulário de contato | Envio via Notification Service      |
| SEO                   | Meta tags, sitemap, structured data |
| Performance           | SSG, image optimization             |

### 10.2 Dependências

| Serviço              | Uso                        |
| -------------------- | -------------------------- |
| API Gateway          | Formulário de contato      |
| Notification Service | Envio de e-mail de contato |

---

## 11. Comunicação entre serviços

### 11.1 Matriz de comunicação

| De ↓ / Para →     | Auth | Gateway | Notification | HelpDesk | Analytics | Chat    |
| ----------------- | ---- | ------- | ------------ | -------- | --------- | ------- |
| **Gateway**       | HTTP | —       | HTTP         | HTTP     | HTTP      | HTTP/WS |
| **Auth**          | —    | —       | Queue        | —        | —         | —       |
| **Notification**  | —    | —       | —            | —        | —         | —       |
| **HelpDesk**      | HTTP | —       | Queue        | —        | Queue     | HTTP/WS |
| **Analytics**     | —    | —       | —            | —        | —         | —       |
| **Chat**          | HTTP | —       | Queue        | HTTP     | —         | —       |
| **Frontend apps** | —    | HTTP    | —            | —        | —         | —       |

### 11.2 Protocolos

| Protocolo      | Uso                     | Autenticação                |
| -------------- | ----------------------- | --------------------------- |
| HTTP/REST      | Operações síncronas     | JWT Bearer ou Service Token |
| WebSocket      | Chat em tempo real      | JWT no handshake            |
| BullMQ (Redis) | Eventos assíncronos     | Namespace isolation         |
| Redis Pub/Sub  | Broadcast em tempo real | Network isolation (Docker)  |

### 11.3 Contratos de eventos

Todos os eventos seguem envelope padrão:

| Campo           | Tipo     | Descrição                     |
| --------------- | -------- | ----------------------------- |
| `eventId`       | UUID     | Identificador único do evento |
| `eventType`     | string   | Tipo do evento (dot notation) |
| `timestamp`     | ISO 8601 | Momento da emissão            |
| `source`        | string   | Serviço emissor               |
| `tenantId`      | UUID?    | Tenant associado              |
| `payload`       | object   | Dados do evento               |
| `correlationId` | UUID?    | Request ID de origem          |

Schemas Zod definidos em `packages/shared/src/schemas/events/`.

---

## 12. Referências cruzadas

| Tópico      | Documento                                                  |
| ----------- | ---------------------------------------------------------- |
| Arquitetura | [01-Architecture.md](./01-Architecture.md)                 |
| Dados       | [17-Data-Architecture.md](./17-Data-Architecture.md)       |
| APIs        | [18-API-Design-Standards.md](./18-API-Design-Standards.md) |
| Segurança   | [07-Security.md](./07-Security.md)                         |
| Monorepo    | [15-Monorepo-Structure.md](./15-Monorepo-Structure.md)     |
