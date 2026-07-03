# 08 — Observabilidade

**Versão:** 1.0  
**Status:** Aprovado  
**Última atualização:** 2026-07-03  
**Relacionado:** [02-Tech-Stack.md](./02-Tech-Stack.md), [06-DevOps.md](./06-DevOps.md), [07-Security.md](./07-Security.md)

---

## 1. Objetivo

Definir a estratégia de observabilidade do Portfolio OS: logging estruturado, métricas, distributed tracing, health checks, alertas e dashboards. Todo serviço deve ser observável desde o primeiro deploy.

---

## 2. Os três pilares

| Pilar | Ferramenta | Propósito |
|-------|------------|-----------|
| Logs | Pino + pacote `@portfolio/logger` | Eventos discretos, debugging |
| Metrics | Prometheus + prom-client | Tendências, alertas, capacidade |
| Traces | OpenTelemetry | Latência, dependências, bottlenecks |

Complementares:

| Ferramenta | Propósito |
|------------|-----------|
| Grafana | Dashboards e visualização |
| Sentry | Error tracking e alertas |
| Health checks | Liveness e readiness |

---

## 3. Logging

### 3.1 Pacote `@portfolio/logger`

Wrapper sobre Pino que fornece:

- Logging estruturado JSON
- Request context automático (requestId, userId, tenantId, service)
- Níveis padronizados
- Redação automática de campos sensíveis
- Child loggers por módulo
- Formatação pretty em desenvolvimento

### 3.2 Formato de log

Cada entrada de log é um objeto JSON com campos obrigatórios:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `timestamp` | ISO 8601 | Momento do evento |
| `level` | string | trace, debug, info, warn, error, fatal |
| `message` | string | Descrição humana |
| `service` | string | Nome do serviço emissor |
| `requestId` | string | UUID de correlação |
| `userId` | string? | ID do usuário autenticado |
| `tenantId` | string? | ID do tenant |
| `module` | string? | Módulo NestJS ou feature |
| `duration` | number? | Duração em ms (para operações) |
| `error` | object? | Stack trace e código de erro |

### 3.3 Níveis de log

| Nível | Uso | Ambiente |
|-------|-----|----------|
| `trace` | Debugging detalhado | local apenas |
| `debug` | Informação de desenvolvimento | local, staging |
| `info` | Operações normais (request handled, job processed) | Todos |
| `warn` | Degradação, retry, deprecated usage | Todos |
| `error` | Falhas recuperáveis | Todos |
| `fatal` | Falhas irrecuperáveis (shutdown iminente) | Todos |

### 3.4 Regras de logging

| Regra | Descrição |
|-------|-----------|
| Nunca `console.log` | Usar `@portfolio/logger` exclusivamente |
| Nunca logar secrets | Passwords, tokens, keys são redatados |
| Nunca logar PII completo | E-mails mascarados, CPF omitido |
| Sempre incluir requestId | Propagado via header `X-Request-Id` |
| Logar entrada e saída de requests | INFO com method, path, status, duration |
| Logar erros com contexto | ERROR com stack, requestId, userId |
| Não logar em excesso | TRACE/DEBUG desabilitados em production |

### 3.5 Request ID propagation

1. Gateway gera `X-Request-Id` (UUID v4) se não presente
2. Propagado para todos os serviços downstream via header HTTP
3. Incluído em todos os logs do request
4. Retornado ao cliente no response header
5. Armazenado em AsyncLocalStorage para acesso em qualquer camada

### 3.6 Campos redatados automaticamente

`password`, `token`, `accessToken`, `refreshToken`, `authorization`, `secret`, `apiKey`, `creditCard`, `ssn`, `cpf`

### 3.7 Agregação de logs

| Ambiente | Destino |
|----------|---------|
| local | stdout (pretty print) |
| ci | stdout (JSON) |
| staging | stdout → Docker logs → Loki (opcional) |
| production | stdout → Docker logs → Loki |

Queries de log via Grafana (staging/production) ou `docker compose logs` (local).

---

## 4. Métricas

### 4.1 Prometheus

Cada serviço NestJS expõe endpoint `GET /metrics` com formato Prometheus.

### 4.2 Métricas obrigatórias (todos os serviços)

| Métrica | Tipo | Labels |
|---------|------|--------|
| `http_requests_total` | Counter | method, path, status, service |
| `http_request_duration_seconds` | Histogram | method, path, service |
| `http_requests_in_flight` | Gauge | service |
| `process_cpu_seconds_total` | Counter | service |
| `process_resident_memory_bytes` | Gauge | service |
| `nodejs_eventloop_lag_seconds` | Gauge | service |

### 4.3 Métricas de negócio

| Serviço | Métrica | Tipo |
|---------|---------|------|
| Auth | `auth_logins_total` | Counter (success/failure) |
| Auth | `auth_tokens_issued_total` | Counter |
| HelpDesk | `tickets_created_total` | Counter |
| HelpDesk | `tickets_resolved_total` | Counter |
| HelpDesk | `ticket_resolution_duration_seconds` | Histogram |
| Notification | `notifications_sent_total` | Counter (channel, status) |
| Notification | `notification_queue_size` | Gauge |
| Chat | `chat_messages_total` | Counter |
| Chat | `chat_active_connections` | Gauge |
| Analytics | `analytics_queries_total` | Counter |
| Analytics | `analytics_query_duration_seconds` | Histogram |

### 4.4 Métricas de infraestrutura

| Métrica | Fonte |
|---------|-------|
| PostgreSQL connections | postgres_exporter |
| Redis memory usage | redis_exporter |
| BullMQ queue depth | Custom exporter |
| Docker container stats | cAdvisor |

### 4.5 Grafana dashboards

| Dashboard | Conteúdo |
|-----------|----------|
| Platform Overview | Health, request rate, error rate, latency P50/P95/P99 |
| Service Detail | Métricas por serviço individual |
| Business Metrics | Tickets, logins, notifications, chat |
| Infrastructure | CPU, memory, disk, connections |
| BullMQ Queues | Queue depth, processing rate, failures |

---

## 5. Distributed tracing

### 5.1 OpenTelemetry

| Componente | Tecnologia |
|------------|------------|
| SDK | @opentelemetry/sdk-node |
| Auto-instrumentation | HTTP, NestJS, Prisma, Redis, BullMQ |
| Exporter | OTLP (staging/production) |
| Collector | OpenTelemetry Collector (staging/production) |
| Backend | Jaeger ou Grafana Tempo |

### 5.2 Spans

Cada request HTTP gera um trace com spans:

```
[Gateway] POST /api/v1/tickets
  ├─ [Gateway] JWT validation
  ├─ [Gateway] Route to helpdesk-api
  ├─ [HelpDesk] CreateTicketUseCase
  │   ├─ [HelpDesk] Prisma insert
  │   └─ [HelpDesk] BullMQ publish notification
  └─ [Gateway] Response 201
```

### 5.3 Propagação

- W3C Trace Context (`traceparent`, `tracestate` headers)
- Propagado automaticamente entre serviços via HTTP client instrumentado

### 5.4 Sampling

| Ambiente | Taxa |
|----------|------|
| local | 100% |
| staging | 100% |
| production | 10% (head-based) |
| errors | 100% (always sample errors) |

---

## 6. Error tracking

### 6.1 Sentry

| Propriedade | Valor |
|-------------|-------|
| SDK | @sentry/node (backend), @sentry/nextjs (frontend) |
| Ambientes | staging, production |
| Source maps | Upload em CI |
| Release tracking | Tag de versão |
| User context | userId, tenantId (sem PII) |

### 6.2 Captura

- Exceções não tratadas
- Promise rejections
- Erros HTTP 5xx
- Erros de frontend (React error boundaries)

### 6.3 Alertas Sentry

| Condição | Canal |
|----------|-------|
| Nova issue | Email |
| Regressão | Email |
| Spike (>10 eventos em 5 min) | Email |

---

## 7. Health checks

### 7.1 Endpoints

Cada serviço expõe:

| Endpoint | Propósito | Kubernetes equivalente |
|----------|-----------|----------------------|
| `GET /health/live` | Processo está vivo | livenessProbe |
| `GET /health/ready` | Pronto para receber tráfego | readinessProbe |
| `GET /health` | Status detalhado (admin only) | — |

### 7.2 Readiness checks

| Dependência | Verificação |
|-------------|-------------|
| PostgreSQL | Query `SELECT 1` |
| Redis | `PING` |
| BullMQ | Queue connection status |
| Serviços downstream (Gateway) | Health de serviços roteados |

### 7.3 Health agregado (Gateway)

`GET /health` no Gateway retorna status de todos os serviços:

| Status | Condição |
|--------|----------|
| `healthy` | Todos os serviços ready |
| `degraded` | Serviço não-crítico down |
| `unhealthy` | Serviço crítico down (Auth, Gateway) |

---

## 8. Alertas

### 8.1 Regras de alerta

| Alerta | Condição | Severidade | Canal |
|--------|----------|------------|-------|
| HighErrorRate | 5xx > 5% por 5 min | Critical | Email |
| HighLatency | P95 > 500ms por 5 min | Warning | Email |
| ServiceDown | Health check fail por 2 min | Critical | Email |
| HighMemory | Memory > 85% por 10 min | Warning | Email |
| QueueBacklog | Queue depth > 1000 por 15 min | Warning | Email |
| DiskSpaceLow | Disk > 90% | Critical | Email |
| SSLExpiry | < 14 dias | Warning | Email |
| FailedLogins | > 50 falhas/min | Warning | Email |

### 8.2 Escalation (futuro)

v1.0: alertas por email. v1.1: PagerDuty ou Opsgenie para P0.

---

## 9. SLIs e SLOs

| SLI | SLO | Medição |
|-----|-----|---------|
| Availability | 99.5% | Uptime de /health/ready |
| Latency (P95) | < 200ms | http_request_duration_seconds |
| Error rate | < 1% | 5xx / total requests |
| Notification delivery | 99% em 5 min | Job completion rate |

Error budget: 0.5% de downtime mensal (~3.6 horas).

---

## 10. Implementação por serviço

### 10.1 Checklist de observabilidade

Todo serviço deve implementar:

- [ ] `@portfolio/logger` configurado com service name
- [ ] Request ID middleware
- [ ] HTTP request logging interceptor
- [ ] `/metrics` endpoint com métricas obrigatórias
- [ ] `/health/live` e `/health/ready` endpoints
- [ ] OpenTelemetry instrumentation
- [ ] Sentry SDK configurado
- [ ] Error handling com logging estruturado
- [ ] Métricas de negócio específicas do domínio

### 10.2 Frontend

- Sentry para error tracking
- Web Vitals reporting (LCP, FID, CLS)
- TanStack Query devtools (local/staging)
- Performance monitoring via Sentry

---

## 11. Ambiente local

| Ferramenta | Acesso | Propósito |
|------------|--------|-----------|
| Docker logs | `docker compose logs -f {service}` | Logs em tempo real |
| Prometheus | `http://localhost:9090` | Métricas (opcional em local) |
| Grafana | `http://localhost:3000` | Dashboards (opcional em local) |
| Jaeger | `http://localhost:16686` | Traces (opcional em local) |

Stack de observabilidade opcional em local via profile Docker Compose: `docker compose --profile observability up`.

---

## 12. Retenção de dados de observabilidade

| Dado | Retenção |
|------|----------|
| Logs | 90 dias |
| Métricas | 30 dias (Prometheus) |
| Traces | 7 dias |
| Sentry events | 90 dias (free tier) |
| Alertas histórico | 1 ano |

---

## 13. Referências cruzadas

| Tópico | Documento |
|--------|-----------|
| Tech stack | [02-Tech-Stack.md](./02-Tech-Stack.md) |
| DevOps | [06-DevOps.md](./06-DevOps.md) |
| Segurança | [07-Security.md](./07-Security.md) |
| Runbooks | [21-Runbooks.md](./21-Runbooks.md) |
| Logger package | [15-Monorepo-Structure.md](./15-Monorepo-Structure.md) |
