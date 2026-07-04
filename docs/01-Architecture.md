# 01 — Arquitetura do Portfolio OS

**Versão:** 1.0  
**Status:** Aprovado  
**Última atualização:** 2026-07-03  
**Relacionado:** [00-Vision.md](./00-Vision.md), [16-Service-Catalog.md](./16-Service-Catalog.md), [17-Data-Architecture.md](./17-Data-Architecture.md), [18-API-Design-Standards.md](./18-API-Design-Standards.md)

---

## 1. Visão arquitetural

O Portfolio OS adota uma arquitetura de **microsserviços orientada a domínio** com **API Gateway** como ponto de entrada único, **Auth Service** como provedor central de identidade e pacotes compartilhados para eliminar duplicação. Aplicações frontend consomem APIs exclusivamente via Gateway (exceto WebSocket do Realtime Chat, que passa pelo Gateway com upgrade de protocolo).

A arquitetura prioriza:

- **Separação de responsabilidades** por bounded context
- **Comunicação explícita** via contratos versionados
- **Falha isolada** — falha em um serviço não derruba o ecossistema inteiro
- **Observabilidade transversal** via pacote `logger` e correlação de request ID
- **Deploy independente** por serviço com CI/CD por path no monorepo

---

## 2. Diagrama de contexto (C4 — Nível 1)

```
                    ┌─────────────────────────────────────────┐
                    │           Usuários Externos              │
                    │  (Visitantes, Clientes, Agentes, Admin) │
                    └────────────────────┬────────────────────┘
                                         │
                    ┌────────────────────▼────────────────────┐
                    │         Portfolio Website (APP-08)       │
                    │              Next.js — Público             │
                    └────────────────────┬────────────────────┘
                                         │
         ┌───────────────────────────────┼───────────────────────────────┐
         │                               │                               │
         ▼                               ▼                               ▼
┌─────────────────┐           ┌─────────────────┐           ┌─────────────────┐
│  Admin Portal   │           │  HelpDesk SaaS  │           │ Analytics Dash  │
│    (APP-07)     │           │    (APP-04)     │           │    (APP-05)     │
│    Next.js      │           │    Next.js      │           │    Next.js      │
└────────┬────────┘           └────────┬────────┘           └────────┬────────┘
         │                             │                               │
         │              ┌──────────────┼──────────────┐                │
         │              │              │              │                │
         │              ▼              ▼              ▼                │
         │     ┌─────────────────────────────────────────────┐        │
         └────►│           API Gateway (APP-02)                 │◄───────┘
               │     Nginx + NestJS — Roteamento / Rate Limit  │
               └──────────────────────┬──────────────────────┘
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         │                            │                            │
         ▼                            ▼                            ▼
┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
│  Auth Service   │        │ Notification    │        │  HelpDesk API   │
│    (APP-01)     │        │  Service (APP-03)│        │  (parte APP-04) │
│    NestJS       │        │    NestJS       │        │    NestJS       │
└────────┬────────┘        └────────┬────────┘        └────────┬────────┘
         │                          │                          │
         │              ┌───────────┴───────────┐              │
         │              ▼                       ▼              │
         │     ┌─────────────────┐    ┌─────────────────┐     │
         │     │ Realtime Chat   │    │ Analytics API   │     │
         │     │  (APP-06)       │    │  (parte APP-05) │     │
         │     │  NestJS + WS    │    │  NestJS         │     │
         │     └────────┬────────┘    └────────┬────────┘     │
         │              │                        │              │
         └──────────────┼────────────────────────┼──────────────┘
                        │                        │
                        ▼                        ▼
              ┌─────────────────────────────────────────┐
              │     Infraestrutura de Dados              │
              │  PostgreSQL │ Redis │ BullMQ Queues     │
              └─────────────────────────────────────────┘
```

---

## 3. Diagrama de containers (C4 — Nível 2)

### 3.1 Camada de apresentação

| Container           | Tecnologia                    | Responsabilidade                           |
| ------------------- | ----------------------------- | ------------------------------------------ |
| Portfolio Website   | Next.js 14+ App Router        | Site público, SEO, showcase                |
| Admin Portal        | Next.js 14+ App Router        | Gestão de usuários, tenants, configurações |
| HelpDesk SaaS       | Next.js 14+ App Router        | Interface de tickets, agentes, clientes    |
| Analytics Dashboard | Next.js 14+ App Router        | Dashboards, gráficos, exportação           |
| Realtime Chat UI    | Integrado em HelpDesk e Admin | Widget de chat em tempo real               |

Todas as aplicações frontend utilizam pacotes `ui`, `sdk`, `auth` (client) e `shared`.

### 3.2 Camada de gateway

| Container            | Tecnologia  | Responsabilidade                                                                  |
| -------------------- | ----------- | --------------------------------------------------------------------------------- |
| Nginx                | Nginx 1.25+ | TLS termination, load balancing, static assets, proxy reverso                     |
| API Gateway (NestJS) | NestJS      | Roteamento dinâmico, autenticação JWT, rate limiting, request ID, circuit breaker |

O Gateway **não contém lógica de negócio**. Apenas cross-cutting concerns.

### 3.3 Camada de serviços

| Serviço              | Tipo          | Banco dedicado    | Fila dedicada        |
| -------------------- | ------------- | ----------------- | -------------------- |
| Auth Service         | Microsserviço | `auth_db`         | `auth-queue`         |
| Notification Service | Microsserviço | `notification_db` | `notification-queue` |
| HelpDesk API         | Microsserviço | `helpdesk_db`     | `helpdesk-queue`     |
| Analytics API        | Microsserviço | `analytics_db`    | `analytics-queue`    |
| Realtime Chat        | Microsserviço | `chat_db`         | `chat-queue`         |

Cada serviço possui schema PostgreSQL isolado (database-per-service). Redis é compartilhado com prefixo de namespace por serviço.

### 3.4 Camada de infraestrutura

| Componente     | Função                                 |
| -------------- | -------------------------------------- |
| PostgreSQL 16  | Persistência relacional                |
| Redis 7        | Cache, sessões, pub/sub, rate limiting |
| BullMQ         | Filas de jobs assíncronos              |
| Docker Compose | Orquestração local                     |
| GitHub Actions | CI/CD                                  |

Detalhamento em [17-Data-Architecture.md](./17-Data-Architecture.md) e [06-DevOps.md](./06-DevOps.md).

---

## 4. Padrões arquiteturais adotados

### 4.1 Backend — Clean Architecture adaptada

Cada serviço NestJS segue camadas:

| Camada         | Conteúdo                                                             | Dependências        |
| -------------- | -------------------------------------------------------------------- | ------------------- |
| Domain         | Entidades, value objects, regras de negócio puras                    | Nenhuma externa     |
| Application    | Use cases, DTOs de entrada/saída, interfaces de repositório          | Domain              |
| Infrastructure | Prisma repositories, Redis, BullMQ producers/consumers, HTTP clients | Application, Domain |
| Presentation   | Controllers, guards, pipes, filters, WebSocket gateways              | Application         |

Regra de dependência: camadas internas nunca importam camadas externas.

### 4.2 Frontend — Feature-Sliced Design simplificado

```
apps/{app}/src/
  app/          # Rotas Next.js App Router
  features/     # Funcionalidades por domínio
  entities/     # Modelos de domínio frontend
  shared/       # Utilitários locais à app
  widgets/      # Composições de UI reutilizáveis na app
```

Componentes visuais genéricos residem em `packages/ui`.

### 4.3 Comunicação entre serviços

| Padrão                    | Uso                                    | Protocolo                                  |
| ------------------------- | -------------------------------------- | ------------------------------------------ |
| Síncrona request-response | Operações que exigem resposta imediata | HTTP/REST via rede interna Docker          |
| Assíncrona event-driven   | Side effects, notificações, agregações | BullMQ jobs + Redis pub/sub                |
| Tempo real                | Chat, presença, notificações live      | WebSocket via Gateway                      |
| Service discovery         | Desenvolvimento e staging              | DNS Docker Compose / variáveis de ambiente |

Política: **evitar acoplamento síncrono em cadeia** (A→B→C). Preferir eventos para fluxos com mais de um hop.

Detalhamento em [16-Service-Catalog.md](./16-Service-Catalog.md#comunicação-entre-serviços).

### 4.4 API Gateway — Padrão Backend for Frontend (BFF) parcial

O Gateway agrega rotas mas **não agrega dados** de múltiplos serviços em um único endpoint na v1.0. Agregação fica responsabilidade do frontend via TanStack Query parallel queries. Exceção: endpoint de health agregado `/health`.

### 4.5 CQRS leve

Aplicado em Analytics API e HelpDesk API para operações de leitura pesada:

- Commands: escrita via use cases padrão
- Queries: endpoints de leitura podem usar views materializadas ou cache Redis

Não há event sourcing na v1.0.

### 4.6 Outbox Pattern

Serviços que publicam eventos para Notification Service utilizam tabela outbox no mesmo banco, processada por worker BullMQ, garantindo entrega at-least-once.

---

## 5. Autenticação e autorização

### 5.1 Modelo

- **Auth Service** é o único emissor de tokens JWT (RS256)
- Access token: TTL 15 minutos
- Refresh token: TTL 7 dias, rotacionado a cada uso, armazenado em Redis com fingerprint de device
- Gateway valida assinatura JWT com chave pública do Auth Service (JWKS endpoint)
- Serviços downstream confiam no Gateway ou revalidam token conforme criticidade

### 5.2 Fluxo de autenticação

1. Cliente envia credenciais para `POST /api/v1/auth/login` via Gateway
2. Gateway roteia para Auth Service
3. Auth Service valida credenciais, emite access + refresh tokens
4. Cliente armazena tokens conforme política do pacote `auth` (httpOnly cookie para web, secure storage para mobile futuro)
5. Requisições subsequentes incluem `Authorization: Bearer {access_token}`
6. Gateway valida, injeta headers `X-User-Id`, `X-Tenant-Id`, `X-Roles` para downstream

### 5.3 Autorização

| Mecanismo   | Escopo                                                                 |
| ----------- | ---------------------------------------------------------------------- |
| RBAC        | Roles globais: `super_admin`, `admin`, `agent`, `user`, `guest`        |
| ABAC leve   | Permissões por tenant no HelpDesk e Admin Portal                       |
| Scope-based | Tokens de serviço para comunicação inter-serviços (`service:*` scopes) |

Detalhamento completo em [07-Security.md](./07-Security.md).

---

## 6. Multi-tenancy

### 6.1 Estratégia

**Shared database, shared schema, tenant_id column** para HelpDesk e Analytics na v1.0.

- Toda query inclui filtro `tenant_id` obrigatório
- Middleware Prisma injeta `tenant_id` a partir do contexto de request
- Auth Service gerencia relação user↔tenant
- Admin Portal permite criação e gestão de tenants

### 6.2 Isolamento

- Row-level security (RLS) no PostgreSQL para HelpDesk e Analytics como camada adicional
- Testes de integração devem validar que tenant A não acessa dados de tenant B

---

## 7. Resiliência e tolerância a falhas

### 7.1 Padrões implementados

| Padrão            | Onde                    | Comportamento                                               |
| ----------------- | ----------------------- | ----------------------------------------------------------- |
| Circuit Breaker   | Gateway → serviços      | Abre após 5 falhas em 30s, half-open após 60s               |
| Retry com backoff | Chamadas inter-serviços | 3 tentativas, exponential backoff                           |
| Timeout           | Todas chamadas HTTP     | 10s default, 30s para exports                               |
| Bulkhead          | Workers BullMQ          | Concurrency limit por queue                                 |
| Graceful shutdown | Todos os serviços       | SIGTERM: parar de aceitar, drenar requests, fechar conexões |
| Health checks     | Todos os serviços       | `/health/live`, `/health/ready`                             |
| Dead Letter Queue | BullMQ                  | Jobs falhos após 5 retries vão para DLQ                     |

### 7.2 Degradação graciosa

| Cenário                           | Comportamento                                                  |
| --------------------------------- | -------------------------------------------------------------- |
| Notification Service indisponível | Operação principal completa; notificação enfileirada com retry |
| Analytics indisponível            | Dashboard exibe dados em cache ou estado degradado             |
| Chat indisponível                 | HelpDesk funciona sem chat; banner de indisponibilidade        |
| Redis indisponível                | Serviços operam sem cache; rate limit desabilitado com alerta  |

---

## 8. Escalabilidade

### 8.1 Horizontal

- Serviços NestJS: stateless, escaláveis via múltiplas réplicas Docker
- WebSocket (Chat): sticky sessions via Nginx ip_hash ou Redis adapter para Socket.IO
- Workers BullMQ: escalar consumers independentemente de APIs

### 8.2 Vertical (limites v1.0)

- PostgreSQL: instância única com connection pooling via PgBouncer
- Redis: instância única com maxmemory e política allkeys-lru

### 8.3 Performance

- Cache Redis para: sessões, JWKS, queries frequentes de Analytics, lista de tenants
- Paginação cursor-based em todas listagens
- Índices compostos incluindo `tenant_id` onde aplicável
- CDN para assets estáticos do Portfolio Website (fase de deploy)

---

## 9. Boundaries e contratos

### 9.1 Regras de acoplamento

| Permitido                          | Proibido                              |
| ---------------------------------- | ------------------------------------- |
| Frontend → Gateway → Serviço       | Frontend → Serviço direto             |
| Serviço → Serviço via HTTP interno | Serviço acessa banco de outro serviço |
| Serviço → BullMQ → Serviço         | Lógica de negócio no Gateway          |
| Pacote shared: tipos e constantes  | Pacote shared: lógica de negócio      |
| SDK: client HTTP tipado            | SDK: acesso direto a banco            |

### 9.2 Versionamento de API

- Prefixo: `/api/v1/`
- Breaking changes: nova versão `/api/v2/` com período de deprecação de 90 dias
- Contratos publicados em OpenAPI por serviço

---

## 10. Ambientes

| Ambiente   | Propósito                  | Infra                               |
| ---------- | -------------------------- | ----------------------------------- |
| local      | Desenvolvimento individual | Docker Compose                      |
| ci         | Testes automatizados       | GitHub Actions + service containers |
| staging    | Pré-produção, demos        | VPS Docker Compose ou PaaS          |
| production | Portfólio público          | VPS Docker Compose ou PaaS          |

Paridade entre staging e production é obrigatória para serviços e configuração.

---

## 11. Estrutura física do monorepo

```
portfolio/
├── 00-governance/          # Políticas, licenças, CONTRIBUTING
├── 01-docs/                # Symlink ou cópia de docs/ (governança)
├── docs/                   # Documentação de engenharia (este diretório)
├── packages/               # Pacotes compartilhados
│   ├── ui/
│   ├── config/
│   ├── eslint-config/
│   ├── tsconfig/
│   ├── shared/
│   ├── logger/
│   ├── auth/
│   └── sdk/
├── services/               # Microsserviços backend
│   ├── auth-service/
│   ├── api-gateway/
│   ├── notification-service/
│   ├── helpdesk-api/
│   ├── analytics-api/
│   └── realtime-chat/
├── apps/                   # Aplicações frontend
│   ├── helpdesk/
│   ├── analytics/
│   ├── admin-portal/
│   └── portfolio-website/
├── infrastructure/         # Docker, Nginx, scripts, compose
├── scripts/                # CLI interna, generators, scripts de manutenção
├── 07-case-studies/        # Case studies (symlink para docs/case-studies)
└── 08-website/             # Assets estáticos globais se necessário
```

Detalhamento em [15-Monorepo-Structure.md](./15-Monorepo-Structure.md).

---

## 12. Decisões arquiteturais pendentes (requerem ADR)

| ID      | Decisão                                    | Status                         |
| ------- | ------------------------------------------ | ------------------------------ |
| ADR-001 | Database-per-service vs schema-per-service | Aprovado: database-per-service |
| ADR-002 | JWT RS256 vs HS256                         | Aprovado: RS256                |
| ADR-003 | Monorepo tool: Turborepo vs Nx             | Pendente RFC                   |
| ADR-004 | WebSocket library: Socket.IO vs ws         | Pendente                       |
| ADR-005 | ORM: Prisma exclusivo vs alternativas      | Aprovado: Prisma               |

ADRs formais em `docs/adr/` usando [templates/adr-template.md](./templates/adr-template.md).

---

## 13. Riscos arquiteturais

| Risco                                      | Impacto | Mitigação                                                 |
| ------------------------------------------ | ------- | --------------------------------------------------------- |
| Complexidade operacional de microsserviços | Alto    | Docker Compose unificado, observabilidade centralizada    |
| Consistência eventual entre serviços       | Médio   | Outbox pattern, idempotência em consumers                 |
| Duplicação de lógica entre serviços        | Médio   | Pacote `shared` estrito, code review                      |
| Cold start em ambiente de portfólio        | Baixo   | Keep-alive em staging, health checks                      |
| Vendor lock-in GitHub Actions              | Baixo   | Pipelines documentados, portáveis para outras plataformas |

---

## 14. Referências cruzadas

| Tópico               | Documento                                                  |
| -------------------- | ---------------------------------------------------------- |
| Catálogo de serviços | [16-Service-Catalog.md](./16-Service-Catalog.md)           |
| Dados, cache, filas  | [17-Data-Architecture.md](./17-Data-Architecture.md)       |
| APIs                 | [18-API-Design-Standards.md](./18-API-Design-Standards.md) |
| Segurança            | [07-Security.md](./07-Security.md)                         |
| Observabilidade      | [08-Observability.md](./08-Observability.md)               |
| Tech stack           | [02-Tech-Stack.md](./02-Tech-Stack.md)                     |
| Testes               | [05-Testing-Strategy.md](./05-Testing-Strategy.md)         |
| Deploy               | [06-DevOps.md](./06-DevOps.md)                             |
