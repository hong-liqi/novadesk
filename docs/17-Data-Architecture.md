# 17 — Arquitetura de Dados

**Versão:** 1.0  
**Status:** Aprovado  
**Última atualização:** 2026-07-03  
**Relacionado:** [01-Architecture.md](./01-Architecture.md), [16-Service-Catalog.md](./16-Service-Catalog.md), [07-Security.md](./07-Security.md)

---

## 1. Objetivo

Definir a estratégia de dados do NovaDesk: bancos de dados, schemas, cache, filas, migrations, backup e políticas de consistência.

---

## 2. Princípios

| Princípio              | Implementação                                       |
| ---------------------- | --------------------------------------------------- |
| Database-per-service   | Cada microsserviço possui banco PostgreSQL dedicado |
| Schema ownership       | Apenas o serviço dono acessa seu banco              |
| Tenant isolation       | `tenant_id` em todas tabelas multi-tenant           |
| Migrations versionadas | Prisma Migrate com histórico                        |
| Cache as cache         | Redis nunca é source of truth                       |
| At-least-once delivery | BullMQ com idempotência em consumers                |
| Soft delete            | `deleted_at` onde dados precisam ser recuperáveis   |

---

## 3. PostgreSQL

### 3.1 Instâncias

| Database          | Serviço              | Porta (local)                |
| ----------------- | -------------------- | ---------------------------- |
| `auth_db`         | Auth Service         | 5432 (postgres-auth)         |
| `notification_db` | Notification Service | 5432 (postgres-notification) |
| `helpdesk_db`     | HelpDesk API         | 5432 (postgres-helpdesk)     |
| `analytics_db`    | Analytics API        | 5432 (postgres-analytics)    |
| `chat_db`         | Realtime Chat        | 5432 (postgres-chat)         |

Cada instância é um container PostgreSQL 16 separado em Docker Compose.

### 3.2 Connection pooling

| Ambiente   | Mecanismo                    | Pool size |
| ---------- | ---------------------------- | --------- |
| local      | Prisma direct                | 5         |
| staging    | PgBouncer (transaction mode) | 20        |
| production | PgBouncer (transaction mode) | 50        |

URL pattern: `postgresql://{user}:{password}@{host}:{port}/{database}?schema=public`

### 3.3 Convenções de schema

| Convenção    | Valor                                                      |
| ------------ | ---------------------------------------------------------- |
| Tabelas      | snake_case, plural: `users`, `tickets`                     |
| Colunas      | snake_case: `created_at`, `tenant_id`                      |
| Primary key  | `id` UUID v4, default `gen_random_uuid()`                  |
| Timestamps   | `created_at`, `updated_at` (auto), `deleted_at` (nullable) |
| Foreign keys | `{entity}_id`: `user_id`, `tenant_id`                      |
| Índices      | `idx_{table}_{columns}`: `idx_tickets_tenant_id_status`    |
| Enums        | PostgreSQL native enums via Prisma                         |

---

## 4. Schemas por serviço

### 4.1 Auth Service (`auth_db`)

| Tabela                      | Descrição                           | Campos principais                                      |
| --------------------------- | ----------------------------------- | ------------------------------------------------------ |
| `users`                     | Usuários da plataforma              | id, email, password_hash, name, email_verified, status |
| `tenants`                   | Organizações/empresas               | id, name, slug, plan, status                           |
| `user_tenants`              | Relação user↔tenant                 | user_id, tenant_id, role                               |
| `refresh_tokens`            | Tokens de refresh (backup do Redis) | id, user_id, token_hash, expires_at, device_info       |
| `password_reset_tokens`     | Tokens de reset                     | id, user_id, token_hash, expires_at, used_at           |
| `email_verification_tokens` | Tokens de verificação               | id, user_id, token_hash, expires_at                    |
| `audit_logs`                | Log de auditoria                    | id, user_id, action, metadata, ip, created_at          |
| `roles`                     | Definição de roles                  | id, name, permissions[]                                |
| `outbox_events`             | Outbox pattern                      | id, event_type, payload, processed_at                  |

### 4.2 Notification Service (`notification_db`)

| Tabela                   | Descrição           | Campos principais                                  |
| ------------------------ | ------------------- | -------------------------------------------------- |
| `notification_templates` | Templates de e-mail | id, name, subject, body_html, variables[]          |
| `notifications`          | Notificações in-app | id, user_id, tenant_id, type, title, body, read_at |
| `notification_logs`      | Log de envio        | id, channel, recipient, status, sent_at, error     |
| `outbox_events`          | Outbox pattern      | id, event_type, payload, processed_at              |

### 4.3 HelpDesk API (`helpdesk_db`)

| Tabela            | Descrição               | Campos principais                                                                                 |
| ----------------- | ----------------------- | ------------------------------------------------------------------------------------------------- |
| `tickets`         | Tickets de suporte      | id, tenant_id, user_id, agent_id, subject, description, status, priority, category_id, sla_due_at |
| `ticket_comments` | Comentários             | id, ticket_id, user_id, body, is_internal, created_at                                             |
| `ticket_history`  | Histórico de alterações | id, ticket_id, field, old_value, new_value, changed_by                                            |
| `categories`      | Categorias              | id, tenant_id, name, description, parent_id                                                       |
| `sla_policies`    | Políticas de SLA        | id, tenant_id, priority, response_time_min, resolution_time_min                                   |
| `outbox_events`   | Outbox pattern          | id, event_type, payload, processed_at                                                             |

### 4.4 Analytics API (`analytics_db`)

| Tabela                 | Descrição                     | Campos principais                                                      |
| ---------------------- | ----------------------------- | ---------------------------------------------------------------------- |
| `ticket_metrics_daily` | Agregação diária              | id, tenant_id, date, created_count, resolved_count, avg_resolution_min |
| `agent_metrics_daily`  | Métricas por agente           | id, tenant_id, agent_id, date, tickets_handled, avg_response_min       |
| `sla_metrics_daily`    | Compliance SLA                | id, tenant_id, date, total, met, breached                              |
| `event_log`            | Log de eventos para agregação | id, event_type, tenant_id, payload, processed_at                       |

### 4.5 Realtime Chat (`chat_db`)

| Tabela              | Descrição      | Campos principais                            |
| ------------------- | -------------- | -------------------------------------------- |
| `chat_rooms`        | Salas de chat  | id, tenant_id, ticket_id, type, created_at   |
| `chat_messages`     | Mensagens      | id, room_id, user_id, body, type, created_at |
| `chat_participants` | Participantes  | id, room_id, user_id, joined_at, left_at     |
| `outbox_events`     | Outbox pattern | id, event_type, payload, processed_at        |

---

## 5. Row-Level Security (RLS)

Row-Level Security é habilitado em todas as tabelas multi-tenant de `helpdesk_db` e `analytics_db`. Cada policy de isolamento compara o `tenant_id` da linha com o valor de sessão `app.tenant_id` configurado pelo middleware Prisma no início de cada request autenticado.

---

## 6. Redis

### 6.1 Instância

Instância única Redis 7 compartilhada com namespace por prefixo de chave.

### 6.2 Namespaces

| Prefixo         | Serviço              | Uso                                       |
| --------------- | -------------------- | ----------------------------------------- |
| `auth:`         | Auth Service         | Refresh tokens, JWKS cache, rate limiting |
| `gateway:`      | API Gateway          | Rate limiting, circuit breaker            |
| `notification:` | Notification Service | Rate limiting de envio                    |
| `helpdesk:`     | HelpDesk API         | Cache de listagens, SLA timers            |
| `analytics:`    | Analytics API        | Cache de queries                          |
| `chat:`         | Realtime Chat        | Pub/sub, presença, Socket.IO adapter      |
| `bull:`         | Todos                | BullMQ queues (automático)                |

### 6.3 Estruturas de cache

| Chave                                        | Tipo             | TTL | Descrição              |
| -------------------------------------------- | ---------------- | --- | ---------------------- |
| `auth:refresh:{hash}`                        | Hash             | 7d  | Refresh token metadata |
| `auth:jwks`                                  | String (JSON)    | 1h  | JWKS cache             |
| `auth:login_attempts:{ip}`                   | String (counter) | 15m | Brute force protection |
| `gateway:ratelimit:{ip}`                     | Sorted Set       | 1m  | Rate limiting          |
| `gateway:circuit:{service}`                  | String           | 60s | Circuit breaker state  |
| `helpdesk:tickets:{tenantId}:{filters_hash}` | String (JSON)    | 5m  | Cache de listagem      |
| `analytics:overview:{tenantId}:{period}`     | String (JSON)    | 15m | Cache de dashboard     |
| `chat:presence:{userId}`                     | String           | 5m  | Online status          |
| `chat:room:{roomId}:typing`                  | Set              | 10s | Typing indicators      |

### 6.4 Políticas

| Política         | Valor                                     |
| ---------------- | ----------------------------------------- |
| maxmemory        | 256mb (local), 512mb (staging/prod)       |
| maxmemory-policy | allkeys-lru                               |
| Persistence      | RDB snapshot a cada 15 min (staging/prod) |
| Eviction         | LRU automático                            |

---

## 7. BullMQ — Filas

### 7.1 Filas

| Fila                 | Produtor             | Consumidor           | Concurrency |
| -------------------- | -------------------- | -------------------- | ----------- |
| `auth-queue`         | Auth Service         | Auth Service         | 5           |
| `notification-queue` | Auth, HelpDesk, Chat | Notification Service | 10          |
| `helpdesk-queue`     | HelpDesk API         | HelpDesk API         | 5           |
| `analytics-queue`    | HelpDesk API         | Analytics API        | 3           |
| `chat-queue`         | Realtime Chat        | Realtime Chat        | 5           |

### 7.2 Configuração padrão de jobs

| Propriedade      | Valor                             |
| ---------------- | --------------------------------- |
| attempts         | 5                                 |
| backoff          | exponential, 1000ms base          |
| removeOnComplete | 1000 jobs                         |
| removeOnFail     | 5000 jobs                         |
| DLQ              | Após 5 falhas → dead letter queue |

### 7.3 Jobs por fila

| Fila                 | Job                          | Descrição                  |
| -------------------- | ---------------------------- | -------------------------- |
| `auth-queue`         | `send-verification-email`    | E-mail de verificação      |
| `auth-queue`         | `send-password-reset-email`  | E-mail de reset            |
| `auth-queue`         | `process-outbox`             | Processar outbox events    |
| `notification-queue` | `send-email`                 | Envio de e-mail            |
| `notification-queue` | `create-in-app-notification` | Criar notificação in-app   |
| `helpdesk-queue`     | `check-sla-breach`           | Verificar SLA              |
| `helpdesk-queue`     | `auto-assign-ticket`         | Atribuição automática      |
| `helpdesk-queue`     | `process-outbox`             | Processar outbox events    |
| `analytics-queue`    | `aggregate-daily-metrics`    | Agregação diária           |
| `analytics-queue`    | `process-ticket-event`       | Processar evento de ticket |
| `analytics-queue`    | `generate-export`            | Gerar export CSV/PDF       |
| `chat-queue`         | `notify-offline-user`        | Notificar usuário offline  |
| `chat-queue`         | `process-outbox`             | Processar outbox events    |

### 7.4 Idempotência

Todo consumer verifica `eventId` antes de processar:

- Tabela `processed_events` com `event_id` (UUID) unique
- Se `event_id` já existe → skip (idempotent)
- Transaction: check + process + insert event_id

---

## 8. Outbox Pattern

### 8.1 Fluxo

1. Use case executa operação de negócio em transaction
2. Na mesma transaction, insere evento em `outbox_events`
3. Worker `process-outbox` lê eventos não processados
4. Publica na fila BullMQ apropriada
5. Marca `processed_at` no outbox

### 8.2 Garantias

- At-least-once delivery
- Ordem preservada por aggregate (ticket_id, user_id)
- Retry automático via BullMQ

---

## 9. Migrations

### 9.1 Política

| Regra                            | Descrição                             |
| -------------------------------- | ------------------------------------- |
| Uma migration por mudança lógica | Não agrupar mudanças não relacionadas |
| Nome descritivo                  | `20260703_add_ticket_priority`        |
| Nunca editar migration aplicada  | Criar nova migration para correção    |
| Testar rollback                  | Validar em CI com Testcontainers      |
| Backup antes de production       | pg_dump automático                    |

### 9.2 Ordem de execução em deploy

1. Backup do banco
2. `prisma migrate deploy`
3. Verificar migration status
4. Deploy do serviço
5. Smoke test

---

## 10. Seed data

| Ambiente   | Seed                             |
| ---------- | -------------------------------- |
| local      | Dados de demonstração completos  |
| ci         | Nenhum (factories programáticas) |
| staging    | Dados de demonstração            |
| production | Apenas super_admin inicial       |

### 10.1 Dados de demonstração (local/staging)

| Entidade      | Quantidade                      |
| ------------- | ------------------------------- |
| Tenants       | 3                               |
| Users         | 10 (distribuídos entre tenants) |
| Tickets       | 50 (vários status)              |
| Categories    | 5 por tenant                    |
| Chat messages | 100                             |
| Notifications | 30                              |

---

## 11. Backup e recovery

| Database | Frequência       | Retenção | Mecanismo          |
| -------- | ---------------- | -------- | ------------------ |
| Todos    | Diário 02:00 UTC | 30 dias  | pg_dump comprimido |
| Redis    | A cada 15 min    | 7 dias   | RDB snapshot       |

Procedimentos em [21-Runbooks.md](./21-Runbooks.md).

---

## 12. Referências cruzadas

| Tópico      | Documento                                        |
| ----------- | ------------------------------------------------ |
| Arquitetura | [01-Architecture.md](./01-Architecture.md)       |
| Serviços    | [16-Service-Catalog.md](./16-Service-Catalog.md) |
| Segurança   | [07-Security.md](./07-Security.md)               |
| DevOps      | [06-DevOps.md](./06-DevOps.md)                   |
| Runbooks    | [21-Runbooks.md](./21-Runbooks.md)               |
