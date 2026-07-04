# 15 — Estrutura do Monorepo

**Versão:** 1.0  
**Status:** Aprovado  
**Última atualização:** 2026-07-03  
**Relacionado:** [01-Architecture.md](./01-Architecture.md), [02-Tech-Stack.md](./02-Tech-Stack.md), [03-Coding-Standards.md](./03-Coding-Standards.md)

---

## 1. Objetivo

Definir a estrutura física completa do monorepo NovaDesk: diretórios, pacotes, convenções de nomenclatura, boundaries, dependências permitidas e configuração de workspaces.

---

## 2. Visão geral

```
novadesk/
├── .github/                    # GitHub Actions, PR templates, CODEOWNERS
├── .husky/                     # Git hooks
├── 00-governance/              # Políticas, licenças, CONTRIBUTING
├── docs/                       # Documentação de engenharia
├── packages/                   # Pacotes compartilhados
├── services/                   # Microsserviços backend
├── apps/                       # Aplicações frontend
├── infrastructure/             # Infraestrutura (Docker, Nginx, scripts)
├── scripts/                    # Ferramentas internas, generators
├── 07-case-studies/            # Symlink → docs/case-studies
├── package.json                # Root workspace
├── pnpm-workspace.yaml         # Workspace config
├── turbo.json                  # Turborepo pipeline
├── tsconfig.json               # Root TypeScript config
├── .env.example                # Variáveis globais
├── .gitignore
├── .prettierrc
├── commitlint.config.js
└── NOVADESK_MASTER_SPEC.md
```

---

## 3. Workspaces (pnpm)

### 3.1 Configuração

O arquivo `pnpm-workspace.yaml` na raiz declara os globs `packages/*`, `services/*`, `apps/*` e `website` como workspaces do monorepo.

### 3.2 Naming convention

| Tipo    | Pattern            | Exemplo                  |
| ------- | ------------------ | ------------------------ |
| Package | `@novadesk/{name}` | `@novadesk/ui`           |
| Service | `@novadesk/{name}` | `@novadesk/auth-service` |
| App     | `@novadesk/{name}` | `@novadesk/helpdesk`     |

---

## 4. Pacotes compartilhados (`packages/`)

### 4.1 `@novadesk/typescript`

Configurações base de TypeScript.

```
packages/tsconfig/
├── package.json
├── base.json              # strict, esModuleInterop, etc.
├── node.json              # extends base, Node.js targets
├── react.json             # extends base, JSX, DOM
└── nestjs.json            # extends node, decorators
```

### 4.2 `@novadesk/eslint`

Configuração ESLint compartilhada (flat config).

```
packages/eslint-config/
├── package.json
├── base.js                # Regras base
├── node.js                # Backend rules
├── react.js               # Frontend rules
└── nestjs.js              # NestJS-specific rules
```

### 4.3 `@novadesk/config`

Schemas Zod para variáveis de ambiente.

```
packages/config/
├── package.json
├── src/
│   ├── index.ts
│   ├── base.config.ts         # NODE_ENV, LOG_LEVEL
│   ├── database.config.ts     # DATABASE_URL
│   ├── redis.config.ts        # REDIS_URL
│   ├── auth.config.ts         # JWT keys
│   └── app.config.ts          # Per-service configs
└── tsconfig.json
```

### 4.4 `@novadesk/shared`

Tipos, constantes, enums e utilitários puros compartilhados.

```
packages/shared/
├── package.json
├── src/
│   ├── index.ts
│   ├── types/                   # User, Tenant, Ticket, etc.
│   ├── enums/                   # TicketStatus, Role, etc.
│   ├── constants/               # MAX_PAGE_SIZE, etc.
│   ├── schemas/                 # Zod schemas compartilhados
│   └── utils/                   # Funções puras (date, string)
└── tsconfig.json
```

**Regra:** Nenhuma lógica de negócio. Nenhuma dependência de framework.

### 4.5 `@novadesk/logger`

Wrapper Pino com context propagation.

```
packages/logger/
├── package.json
├── src/
│   ├── index.ts
│   ├── logger.ts                # createLogger, child loggers
│   ├── context.ts               # AsyncLocalStorage request context
│   ├── redact.ts                # Campos sensíveis
│   └── nestjs/                  # LoggerModule, LoggerInterceptor
└── tsconfig.json
```

### 4.6 `@novadesk/auth`

Utilitários de autenticação compartilhados.

```
packages/auth/
├── package.json
├── src/
│   ├── index.ts
│   ├── jwt/                     # Verify, decode, JWKS client
│   ├── guards/                  # JwtAuthGuard, RolesGuard
│   ├── decorators/              # @CurrentUser, @Roles, @Public
│   ├── client/                  # Auth client para frontend
│   │   ├── auth-provider.tsx    # React context
│   │   ├── use-auth.ts          # Hook
│   │   └── token-manager.ts     # Refresh automático
│   └── types/                   # JwtPayload, AuthUser
└── tsconfig.json
```

### 4.7 `@novadesk/sdk`

Client HTTP tipado para consumo de APIs.

```
packages/sdk/
├── package.json
├── src/
│   ├── index.ts
│   ├── client.ts                # Base HTTP client (axios)
│   ├── auth/                    # Auth API client
│   ├── helpdesk/                # HelpDesk API client
│   ├── analytics/               # Analytics API client
│   ├── notification/            # Notification API client
│   └── chat/                    # Chat API client
└── tsconfig.json
```

### 4.8 `@novadesk/ui`

Design system e componentes visuais.

```
packages/ui/
├── package.json
├── tailwind.config.ts           # Design tokens
├── src/
│   ├── index.ts
│   ├── components/              # Button, Input, Modal, Table, etc.
│   ├── layouts/                 # DashboardLayout, AuthLayout
│   ├── hooks/                   # useMediaQuery, useDisclosure
│   └── styles/                  # Global CSS, Tailwind base
├── .storybook/                  # Storybook config
└── tsconfig.json
```

---

## 5. Microsserviços (`services/`)

### 5.1 Estrutura padrão de serviço

```
services/{service-name}/
├── package.json
├── tsconfig.json
├── nest-cli.json
├── Dockerfile
├── .dockerignore
├── .env.example
├── README.md
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── presentation/
└── test/
    ├── factories/
    ├── fixtures/
    └── integration/
```

### 5.2 Serviços

| Diretório               | Package name                     | Porta | Banco             |
| ----------------------- | -------------------------------- | ----- | ----------------- |
| `auth-service/`         | `@novadesk/auth-service`         | 3001  | `auth_db`         |
| `api-gateway/`          | `@novadesk/api-gateway`          | 3000  | —                 |
| `notification-service/` | `@novadesk/notification-service` | 3002  | `notification_db` |
| `helpdesk-api/`         | `@novadesk/helpdesk-api`         | 3003  | `helpdesk_db`     |
| `analytics-api/`        | `@novadesk/analytics-api`        | 3004  | `analytics_db`    |
| `realtime-chat/`        | `@novadesk/realtime-chat`        | 3005  | `chat_db`         |

---

## 6. Aplicações frontend (`apps/`)

### 6.1 Estrutura padrão de app

```
apps/{app-name}/
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── Dockerfile
├── .dockerignore
├── .env.example
├── README.md
├── public/
├── src/
│   ├── app/                     # Next.js App Router
│   ├── features/
│   ├── entities/
│   ├── widgets/
│   └── shared/
└── e2e/
    ├── pages/
    ├── tests/
    └── playwright.config.ts
```

### 6.2 Apps

| Diretório           | Package name                 | Porta | Rota Nginx     |
| ------------------- | ---------------------------- | ----- | -------------- |
| `helpdesk/`         | `@novadesk/helpdesk`         | 3010  | `/helpdesk/*`  |
| `analytics/`        | `@novadesk/analytics`        | 3011  | `/analytics/*` |
| `admin-portal/`     | `@novadesk/admin-portal`     | 3012  | `/admin/*`     |
| `novadesk-website/` | `@novadesk/novadesk-website` | 3013  | `/*`           |

---

## 7. Infraestrutura (`05-infra/`)

```
05-infra/
├── docker-compose.yml
├── docker-compose.test.yml
├── docker-compose.staging.yml
├── docker-compose.prod.yml
├── nginx/
│   ├── nginx.conf
│   ├── conf.d/
│   └── snippets/
├── scripts/
│   ├── setup-local.sh
│   ├── backup-db.sh
│   ├── restore-db.sh
│   ├── migrate-all.sh
│   └── health-check.sh
├── prometheus/
│   └── prometheus.yml
├── grafana/
│   └── dashboards/
└── otel/
    └── otel-collector.yml
```

---

## 8. Ferramentas (`scripts/`)

```
scripts/
├── cli/                         # CLI interna do monorepo
│   ├── package.json
│   └── src/
│       ├── commands/
│       │   ├── generate-service.ts
│       │   ├── generate-module.ts
│       │   └── migrate-all.ts
│       └── index.ts
└── generators/                  # Templates para scaffolding
    ├── service/
    ├── module/
    └── package/
```

---

## 9. Governança (`00-governance/`)

```
00-governance/
├── CONTRIBUTING.md
├── LICENSE
├── CODE_OF_CONDUCT.md
└── SECURITY.md
```

---

## 10. Grafo de dependências

### 10.1 Regras

| De                | Pode depender de                  | Não pode depender de                |
| ----------------- | --------------------------------- | ----------------------------------- |
| `apps/*`          | packages/*, sdk, ui, auth, shared | services/*, outros apps             |
| `services/*`      | packages/*                        | apps/*, outros services (HTTP only) |
| `packages/ui`     | shared                            | services, apps, auth                |
| `packages/sdk`    | shared, auth                      | services, apps, ui                  |
| `packages/auth`   | shared, logger                    | services, apps, sdk, ui             |
| `packages/shared` | — (zero deps internas)            | tudo                                |
| `packages/logger` | shared                            | services, apps                      |
| `packages/config` | shared                            | services, apps                      |

### 10.2 Enforcement

- ESLint `import/no-restricted-paths` para boundaries
- Turborepo `dependsOn: ["^build"]` para build order
- CI valida grafo de dependências

---

## 11. Path aliases

### 11.1 Backend (NestJS)

Path aliases por camada: `@domain/*`, `@application/*`, `@infrastructure/*`, `@presentation/*` mapeados para `src/{camada}/*`.

### 11.2 Frontend (Next.js)

Path aliases: `@/*` para `src/*`, `@features/*`, `@entities/*`, `@widgets/*`, `@shared/*` para respectivas pastas em `src/`.

---

## 12. Turborepo pipeline

O arquivo `turbo.json` na raiz define o pipeline com as tasks `build` (dependsOn: `^build`, outputs: `dist/**` e `.next/**`), `dev` (cache: false, persistent: true), `lint`, `typecheck` (dependsOn: `^build`), `test` e `test:integration` (dependsOn: `build`), e `test:e2e` (dependsOn: `build`).

---

## 13. Referências cruzadas

| Tópico           | Documento                                          |
| ---------------- | -------------------------------------------------- |
| Arquitetura      | [01-Architecture.md](./01-Architecture.md)         |
| Tech stack       | [02-Tech-Stack.md](./02-Tech-Stack.md)             |
| Coding standards | [03-Coding-Standards.md](./03-Coding-Standards.md) |
| Service catalog  | [16-Service-Catalog.md](./16-Service-Catalog.md)   |
| DevOps           | [06-DevOps.md](./06-DevOps.md)                     |
