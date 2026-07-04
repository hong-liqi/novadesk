# 10 — Backlog Detalhado

**Versão:** 1.0  
**Status:** Aprovado  
**Última atualização:** 2026-07-03  
**Total de itens:** 560  
**Relacionado:** [09-Roadmap.md](./09-Roadmap.md), [11-Definition-of-Done.md](./11-Definition-of-Done.md)

---

## Convenções

| Campo          | Descrição                                          |
| -------------- | -------------------------------------------------- |
| **ID**         | Identificador único: BL-{NNN}                      |
| **Milestone**  | M0–M13 conforme [09-Roadmap.md](./09-Roadmap.md)   |
| **Prioridade** | P0 (crítico) → P3 (baixo)                          |
| **Status**     | `Todo` / `In Progress` / `Done` / `Blocked`        |
| **Estimativa** | XS (< 2h), S (2-4h), M (4-8h), L (1-2d), XL (2-5d) |

---

## M0 — Fundação do Monorepo (BL-001 a BL-045)

| ID     | Tarefa                                                                 | Prioridade | Estimativa | Status |
| ------ | ---------------------------------------------------------------------- | ---------- | ---------- | ------ |
| BL-001 | Inicializar repositório Git com branch main e develop                  | P0         | XS         | Todo   |
| BL-002 | Criar package.json root com engines Node 20 e pnpm 9                   | P0         | XS         | Todo   |
| BL-003 | Configurar pnpm-workspace.yaml com paths de packages, services e apps  | P0         | XS         | Todo   |
| BL-004 | Configurar turbo.json com pipeline build, dev, lint, test, typecheck   | P0         | S          | Todo   |
| BL-005 | Criar tsconfig.json root com references                                | P0         | XS         | Todo   |
| BL-006 | Configurar .gitignore global do monorepo                               | P0         | XS         | Todo   |
| BL-007 | Configurar .prettierrc e .prettierignore na raiz                       | P0         | XS         | Todo   |
| BL-008 | Configurar commitlint.config.js com Conventional Commits               | P0         | S          | Todo   |
| BL-009 | Instalar e configurar Husky com hooks pre-commit, commit-msg, pre-push | P0         | S          | Todo   |
| BL-010 | Configurar lint-staged para ESLint e Prettier em arquivos staged       | P0         | S          | Todo   |
| BL-011 | Criar estrutura de diretórios 00-governance                            | P0         | XS         | Todo   |
| BL-012 | Criar estrutura de diretórios 02-packages                              | P0         | XS         | Todo   |
| BL-013 | Criar estrutura de diretórios 03-services                              | P0         | XS         | Todo   |
| BL-014 | Criar estrutura de diretórios 04-apps                                  | P0         | XS         | Todo   |
| BL-015 | Criar estrutura de diretórios 05-infra                                 | P0         | XS         | Todo   |
| BL-016 | Criar estrutura de diretórios 06-tools                                 | P0         | XS         | Todo   |
| BL-017 | Criar 00-governance/CONTRIBUTING.md                                    | P1         | S          | Todo   |
| BL-018 | Criar 00-governance/LICENSE (MIT)                                      | P1         | XS         | Todo   |
| BL-019 | Criar 00-governance/CODE_OF_CONDUCT.md                                 | P2         | XS         | Todo   |
| BL-020 | Criar 00-governance/SECURITY.md com política de reporte                | P1         | S          | Todo   |
| BL-021 | Criar .github/pull_request_template.md                                 | P0         | S          | Todo   |
| BL-022 | Criar .github/CODEOWNERS                                               | P2         | XS         | Todo   |
| BL-023 | Criar .github/workflows/ci.yml skeleton                                | P0         | M          | Todo   |
| BL-024 | Criar .github/workflows/dependency-review.yml                          | P1         | S          | Todo   |
| BL-025 | Criar .env.example na raiz com variáveis globais                       | P0         | S          | Todo   |
| BL-026 | Criar 05-infra/docker-compose.yml com PostgreSQL 16                    | P0         | M          | Todo   |
| BL-027 | Adicionar Redis 7 ao docker-compose.yml                                | P0         | S          | Todo   |
| BL-028 | Configurar networks Docker (frontend, backend, data)                   | P0         | S          | Todo   |
| BL-029 | Criar 05-infra/scripts/setup-local.sh                                  | P0         | M          | Todo   |
| BL-030 | Criar 05-infra/docker-compose.test.yml para CI                         | P0         | M          | Todo   |
| BL-031 | Configurar volumes persistentes para PostgreSQL e Redis                | P0         | S          | Todo   |
| BL-032 | Criar CHANGELOG.md na raiz                                             | P1         | XS         | Todo   |
| BL-033 | Criar README.md na raiz do repositório                                 | P0         | M          | Todo   |
| BL-034 | Configurar Renovate ou Dependabot para atualização de deps             | P1         | S          | Todo   |
| BL-035 | Validar pnpm install funciona na raiz                                  | P0         | XS         | Todo   |
| BL-036 | Validar turbo lint executa sem erros (skeleton)                        | P0         | XS         | Todo   |
| BL-037 | Validar docker compose up sobe PostgreSQL e Redis                      | P0         | S          | Todo   |
| BL-038 | Criar .editorconfig na raiz                                            | P2         | XS         | Todo   |
| BL-039 | Criar .nvmrc com versão Node 20                                        | P1         | XS         | Todo   |
| BL-040 | Configurar .vscode/settings.json e extensions.json recomendadas        | P2         | S          | Todo   |
| BL-041 | Criar symlink 07-case-studies → docs/case-studies                      | P2         | XS         | Todo   |
| BL-042 | Criar symlink 01-docs → docs                                           | P2         | XS         | Todo   |
| BL-043 | Validar CI pipeline executa em PR de teste                             | P0         | S          | Todo   |
| BL-044 | Documentar setup local no README.md root                               | P0         | S          | Todo   |
| BL-045 | Review e merge do milestone M0                                         | P0         | S          | Todo   |

---

## M1 — Pacotes Compartilhados (BL-046 a BL-100)

### @novadesk/typescript (BL-046 a BL-052)

| ID     | Tarefa                                                  | Prioridade | Estimativa | Status |
| ------ | ------------------------------------------------------- | ---------- | ---------- | ------ |
| BL-046 | Criar package @novadesk/typescript com package.json     | P0         | XS         | Todo   |
| BL-047 | Criar base.json com strict mode e regras compartilhadas | P0         | S          | Todo   |
| BL-048 | Criar node.json extends base para backend               | P0         | XS         | Todo   |
| BL-049 | Criar react.json extends base para frontend             | P0         | XS         | Todo   |
| BL-050 | Criar nestjs.json extends node com decorators           | P0         | XS         | Todo   |
| BL-051 | Publicar e validar import em package de teste           | P0         | XS         | Todo   |
| BL-052 | Criar README do pacote typescript                       | P2         | XS         | Todo   |

### @novadesk/eslint (BL-053 a BL-059)

| ID     | Tarefa                                                | Prioridade | Estimativa | Status |
| ------ | ----------------------------------------------------- | ---------- | ---------- | ------ |
| BL-053 | Criar package @novadesk/eslint com flat config        | P0         | S          | Todo   |
| BL-054 | Configurar base.js com regras TypeScript recomendadas | P0         | M          | Todo   |
| BL-055 | Configurar node.js para backend NestJS                | P0         | S          | Todo   |
| BL-056 | Configurar react.js para frontend Next.js             | P0         | S          | Todo   |
| BL-057 | Configurar nestjs.js com regras específicas           | P0         | S          | Todo   |
| BL-058 | Configurar import/no-restricted-paths para boundaries | P0         | M          | Todo   |
| BL-059 | Testar lint em projeto skeleton backend e frontend    | P0         | S          | Todo   |

### @novadesk/config (BL-060 a BL-066)

| ID     | Tarefa                                                 | Prioridade | Estimativa | Status |
| ------ | ------------------------------------------------------ | ---------- | ---------- | ------ |
| BL-060 | Criar package @novadesk/config                         | P0         | XS         | Todo   |
| BL-061 | Implementar base.config.ts (NODE_ENV, LOG_LEVEL, PORT) | P0         | S          | Todo   |
| BL-062 | Implementar database.config.ts (DATABASE_URL)          | P0         | S          | Todo   |
| BL-063 | Implementar redis.config.ts (REDIS_URL)                | P0         | S          | Todo   |
| BL-064 | Implementar auth.config.ts (JWT keys, TTL)             | P0         | S          | Todo   |
| BL-065 | Criar função validateConfig que parse e valida com Zod | P0         | M          | Todo   |
| BL-066 | Testes unitários para schemas de config                | P0         | M          | Todo   |

### @novadesk/shared (BL-067 a BL-075)

| ID     | Tarefa                                                              | Prioridade | Estimativa | Status |
| ------ | ------------------------------------------------------------------- | ---------- | ---------- | ------ |
| BL-067 | Criar package @novadesk/shared                                      | P0         | XS         | Todo   |
| BL-068 | Definir tipos base: User, Tenant, Pagination, ApiResponse           | P0         | M          | Todo   |
| BL-069 | Definir enums: Role, TicketStatus, TicketPriority, NotificationType | P0         | M          | Todo   |
| BL-070 | Definir constantes: MAX_PAGE_SIZE, TOKEN_TTL, RATE_LIMITS           | P0         | S          | Todo   |
| BL-071 | Criar Zod schemas compartilhados para entidades principais          | P0         | L          | Todo   |
| BL-072 | Criar Zod schemas para eventos (envelope padrão)                    | P0         | M          | Todo   |
| BL-073 | Implementar utils puros: date, string, pagination                   | P0         | M          | Todo   |
| BL-074 | Testes unitários para schemas e utils (≥ 90% cobertura)             | P0         | M          | Todo   |
| BL-075 | Criar README do pacote shared                                       | P2         | S          | Todo   |

### @novadesk/logger (BL-076 a BL-083)

| ID     | Tarefa                                             | Prioridade | Estimativa | Status |
| ------ | -------------------------------------------------- | ---------- | ---------- | ------ |
| BL-076 | Criar package @novadesk/logger com Pino            | P0         | S          | Todo   |
| BL-077 | Implementar createLogger com service name e nível  | P0         | M          | Todo   |
| BL-078 | Implementar AsyncLocalStorage para request context | P0         | M          | Todo   |
| BL-079 | Implementar redact de campos sensíveis             | P0         | M          | Todo   |
| BL-080 | Implementar child loggers por módulo               | P0         | S          | Todo   |
| BL-081 | Criar LoggerModule e LoggerInterceptor para NestJS | P0         | M          | Todo   |
| BL-082 | Configurar pretty print para desenvolvimento       | P1         | S          | Todo   |
| BL-083 | Testes unitários para logger e redact              | P0         | M          | Todo   |

### @novadesk/auth (BL-084 a BL-092)

| ID     | Tarefa                                                    | Prioridade | Estimativa | Status |
| ------ | --------------------------------------------------------- | ---------- | ---------- | ------ |
| BL-084 | Criar package @novadesk/auth                              | P0         | XS         | Todo   |
| BL-085 | Implementar JWT verify e decode utils                     | P0         | M          | Todo   |
| BL-086 | Implementar JWKS client com cache                         | P0         | M          | Todo   |
| BL-087 | Criar JwtAuthGuard para NestJS                            | P0         | M          | Todo   |
| BL-088 | Criar RolesGuard e @Roles decorator                       | P0         | M          | Todo   |
| BL-089 | Criar @CurrentUser e @Public decorators                   | P0         | S          | Todo   |
| BL-090 | Implementar AuthProvider React context                    | P0         | M          | Todo   |
| BL-091 | Implementar useAuth hook e token-manager com auto-refresh | P0         | L          | Todo   |
| BL-092 | Testes unitários para guards e JWT utils                  | P0         | M          | Todo   |

### @novadesk/sdk (BL-093 a BL-096)

| ID     | Tarefa                                                           | Prioridade | Estimativa | Status |
| ------ | ---------------------------------------------------------------- | ---------- | ---------- | ------ |
| BL-093 | Criar package @novadesk/sdk com HTTP client base (axios)         | P0         | M          | Todo   |
| BL-094 | Implementar interceptors: auth token, request ID, error handling | P0         | M          | Todo   |
| BL-095 | Implementar response wrapper tipado (data, meta, error)          | P0         | S          | Todo   |
| BL-096 | Testes unitários para client e interceptors                      | P0         | M          | Todo   |

### @novadesk/ui (BL-097 a BL-115)

| ID     | Tarefa                                                         | Prioridade | Estimativa | Status |
| ------ | -------------------------------------------------------------- | ---------- | ---------- | ------ |
| BL-097 | Criar package @novadesk/ui com Tailwind config e design tokens | P0         | L          | Todo   |
| BL-098 | Implementar componente Button (variants, sizes, loading)       | P0         | M          | Todo   |
| BL-099 | Implementar componente Input (label, error, disabled)          | P0         | M          | Todo   |
| BL-100 | Implementar componente Select                                  | P0         | M          | Todo   |
| BL-101 | Implementar componente Modal/Dialog (Radix)                    | P0         | M          | Todo   |
| BL-102 | Implementar componente Table (sortable, paginated)             | P0         | L          | Todo   |
| BL-103 | Implementar componente Card                                    | P0         | S          | Todo   |
| BL-104 | Implementar componente Badge                                   | P1         | S          | Todo   |
| BL-105 | Implementar componente Avatar                                  | P1         | S          | Todo   |
| BL-106 | Implementar componente Dropdown Menu                           | P0         | M          | Todo   |
| BL-107 | Implementar componente Toast/Notification                      | P0         | M          | Todo   |
| BL-108 | Implementar componente Spinner/Loading                         | P0         | S          | Todo   |
| BL-109 | Implementar componente Sidebar e DashboardLayout               | P0         | L          | Todo   |
| BL-110 | Implementar componente AuthLayout                              | P0         | M          | Todo   |
| BL-111 | Implementar componente Form (React Hook Form integration)      | P0         | M          | Todo   |
| BL-112 | Configurar Storybook para documentação visual                  | P1         | L          | Todo   |
| BL-113 | Testes de componente com Vitest e Testing Library              | P0         | L          | Todo   |
| BL-114 | Configurar dark mode via class strategy                        | P1         | M          | Todo   |
| BL-115 | Review e merge do milestone M1                                 | P0         | S          | Todo   |

---

## M2 — Auth Service (BL-116 a BL-163)

| ID     | Tarefa                                                               | Prioridade | Estimativa | Status |
| ------ | -------------------------------------------------------------------- | ---------- | ---------- | ------ |
| BL-116 | Scaffold auth-service em 03-services com NestJS CLI                  | P0         | S          | Todo   |
| BL-117 | Configurar Prisma com schema auth_db                                 | P0         | M          | Todo   |
| BL-118 | Criar model User com campos definidos em Data Architecture           | P0         | M          | Todo   |
| BL-119 | Criar model Tenant e UserTenant (relação many-to-many)               | P0         | M          | Todo   |
| BL-120 | Criar model RefreshToken, PasswordResetToken, EmailVerificationToken | P0         | M          | Todo   |
| BL-121 | Criar model Role, AuditLog, OutboxEvent                              | P0         | M          | Todo   |
| BL-122 | Gerar e aplicar migration inicial                                    | P0         | S          | Todo   |
| BL-123 | Implementar domain entity User com regras de validação               | P0         | M          | Todo   |
| BL-124 | Implementar domain entity Tenant                                     | P0         | M          | Todo   |
| BL-125 | Implementar value object Email                                       | P0         | S          | Todo   |
| BL-126 | Implementar value object Password com policy                         | P0         | M          | Todo   |
| BL-127 | Implementar port UserRepository (interface)                          | P0         | S          | Todo   |
| BL-128 | Implementar PrismaUserRepository                                     | P0         | M          | Todo   |
| BL-129 | Implementar PrismaTenantRepository                                   | P0         | M          | Todo   |
| BL-130 | Implementar RegisterUseCase                                          | P0         | L          | Todo   |
| BL-131 | Implementar LoginUseCase com bcrypt validation                       | P0         | L          | Todo   |
| BL-132 | Implementar JwtService com RS256 (sign e verify)                     | P0         | L          | Todo   |
| BL-133 | Implementar RefreshTokenUseCase com rotation                         | P0         | L          | Todo   |
| BL-134 | Implementar LogoutUseCase com token revocation                       | P0         | M          | Todo   |
| BL-135 | Implementar ForgotPasswordUseCase                                    | P0         | M          | Todo   |
| BL-136 | Implementar ResetPasswordUseCase                                     | P0         | M          | Todo   |
| BL-137 | Implementar VerifyEmailUseCase                                       | P0         | M          | Todo   |
| BL-138 | Implementar GetMeUseCase                                             | P0         | S          | Todo   |
| BL-139 | Implementar CreateUserUseCase (admin)                                | P0         | M          | Todo   |
| BL-140 | Implementar ListUsersUseCase com paginação                           | P0         | M          | Todo   |
| BL-141 | Implementar CreateTenantUseCase                                      | P0         | M          | Todo   |
| BL-142 | Implementar ListTenantsUseCase                                       | P0         | M          | Todo   |
| BL-143 | Implementar AuthController com todos os endpoints                    | P0         | L          | Todo   |
| BL-144 | Implementar UsersController                                          | P0         | M          | Todo   |
| BL-145 | Implementar TenantsController                                        | P0         | M          | Todo   |
| BL-146 | Implementar JWKS endpoint (/.well-known/jwks.json)                   | P0         | M          | Todo   |
| BL-147 | Implementar Redis storage para refresh tokens                        | P0         | M          | Todo   |
| BL-148 | Implementar refresh token reuse detection                            | P0         | M          | Todo   |
| BL-149 | Implementar rate limiting para login e register                      | P0         | M          | Todo   |
| BL-150 | Implementar account lockout após 5 tentativas falhas                 | P0         | M          | Todo   |
| BL-151 | Implementar OutboxEvent publisher para notification-queue            | P0         | M          | Todo   |
| BL-152 | Implementar OutboxProcessor worker (BullMQ)                          | P0         | M          | Todo   |
| BL-153 | Implementar AuditLogService para eventos de segurança                | P0         | M          | Todo   |
| BL-154 | Implementar health checks (live, ready)                              | P0         | S          | Todo   |
| BL-155 | Configurar Swagger/OpenAPI para todos os endpoints                   | P0         | M          | Todo   |
| BL-156 | Criar seed.ts com super_admin, tenants e users demo                  | P0         | M          | Todo   |
| BL-157 | Testes unitários para todos os use cases                             | P0         | L          | Todo   |
| BL-158 | Testes de integração para AuthController                             | P0         | L          | Todo   |
| BL-159 | Criar Dockerfile multi-stage para auth-service                       | P0         | M          | Todo   |
| BL-160 | Adicionar auth-service ao docker-compose.yml                         | P0         | S          | Todo   |
| BL-161 | Criar README profissional do auth-service                            | P0         | M          | Todo   |
| BL-162 | Criar ADR-001 (database-per-service) e ADR-002 (JWT RS256)           | P0         | M          | Todo   |
| BL-163 | Review e merge do milestone M2                                       | P0         | S          | Todo   |

---

## M3 — API Gateway (BL-164 a BL-190)

| ID     | Tarefa                                                         | Prioridade | Estimativa | Status |
| ------ | -------------------------------------------------------------- | ---------- | ---------- | ------ |
| BL-164 | Scaffold api-gateway em 03-services com NestJS                 | P0         | S          | Todo   |
| BL-165 | Implementar ProxyMiddleware para roteamento por path prefix    | P0         | L          | Todo   |
| BL-166 | Configurar rotas: /api/v1/auth/* → auth-service:3001           | P0         | S          | Todo   |
| BL-167 | Implementar JwtValidationGuard com JWKS do Auth Service        | P0         | L          | Todo   |
| BL-168 | Implementar cache JWKS em Redis                                | P0         | M          | Todo   |
| BL-169 | Implementar injeção de headers X-User-Id, X-Tenant-Id, X-Roles | P0         | M          | Todo   |
| BL-170 | Implementar @Public() decorator para endpoints sem auth        | P0         | S          | Todo   |
| BL-171 | Implementar RequestIdMiddleware (gerar e propagar)             | P0         | M          | Todo   |
| BL-172 | Implementar RateLimitGuard com Redis sliding window            | P0         | L          | Todo   |
| BL-173 | Implementar CircuitBreakerService para serviços downstream     | P0         | L          | Todo   |
| BL-174 | Implementar health agregado GET /health                        | P0         | M          | Todo   |
| BL-175 | Implementar CORS por ambiente                                  | P0         | S          | Todo   |
| BL-176 | Implementar Helmet security headers                            | P0         | S          | Todo   |
| BL-177 | Implementar timeout de 10s para proxy requests                 | P0         | S          | Todo   |
| BL-178 | Implementar retry com exponential backoff (3 tentativas)       | P1         | M          | Todo   |
| BL-179 | Implementar logging de requests via @novadesk/logger           | P0         | M          | Todo   |
| BL-180 | Implementar /metrics endpoint com prom-client                  | P0         | M          | Todo   |
| BL-181 | Configurar Swagger com documentação do Gateway                 | P1         | M          | Todo   |
| BL-182 | Testes unitários para guards e middleware                      | P0         | M          | Todo   |
| BL-183 | Testes de integração para roteamento e auth                    | P0         | L          | Todo   |
| BL-184 | Criar Dockerfile multi-stage para api-gateway                  | P0         | M          | Todo   |
| BL-185 | Adicionar api-gateway ao docker-compose.yml                    | P0         | S          | Todo   |
| BL-186 | Configurar Nginx upstream para api-gateway                     | P1         | M          | Todo   |
| BL-187 | Criar README do api-gateway                                    | P0         | M          | Todo   |
| BL-188 | Validar fluxo: client → gateway → auth-service → response      | P0         | M          | Todo   |
| BL-189 | Validar fluxo: request sem token em endpoint protegido → 401   | P0         | S          | Todo   |
| BL-190 | Review e merge do milestone M3                                 | P0         | S          | Todo   |

---

## M4 — Notification Service (BL-191 a BL-228)

| ID     | Tarefa                                                                         | Prioridade | Estimativa | Status |
| ------ | ------------------------------------------------------------------------------ | ---------- | ---------- | ------ |
| BL-191 | Scaffold notification-service em 03-services                                   | P0         | S          | Todo   |
| BL-192 | Configurar Prisma com schema notification_db                                   | P0         | M          | Todo   |
| BL-193 | Criar models: NotificationTemplate, Notification, NotificationLog, OutboxEvent | P0         | M          | Todo   |
| BL-194 | Gerar e aplicar migration inicial                                              | P0         | S          | Todo   |
| BL-195 | Implementar TemplateEngine para e-mails HTML                                   | P0         | L          | Todo   |
| BL-196 | Criar template: email-verification                                             | P0         | M          | Todo   |
| BL-197 | Criar template: password-reset                                                 | P0         | M          | Todo   |
| BL-198 | Criar template: ticket-created                                                 | P0         | M          | Todo   |
| BL-199 | Criar template: ticket-assigned                                                | P0         | M          | Todo   |
| BL-200 | Criar template: ticket-resolved                                                | P0         | M          | Todo   |
| BL-201 | Criar template: ticket-comment                                                 | P0         | M          | Todo   |
| BL-202 | Criar template: chat-message-offline                                           | P1         | M          | Todo   |
| BL-203 | Implementar SendEmailUseCase com SMTP                                          | P0         | L          | Todo   |
| BL-204 | Implementar CreateInAppNotificationUseCase                                     | P0         | M          | Todo   |
| BL-205 | Implementar ListNotificationsUseCase com paginação                             | P0         | M          | Todo   |
| BL-206 | Implementar MarkAsReadUseCase                                                  | P0         | S          | Todo   |
| BL-207 | Implementar GetUnreadCountUseCase                                              | P0         | S          | Todo   |
| BL-208 | Implementar NotificationController                                             | P0         | M          | Todo   |
| BL-209 | Implementar BullMQ consumer para notification-queue                            | P0         | L          | Todo   |
| BL-210 | Implementar handlers por event type (user.registered, ticket.*, etc.)          | P0         | L          | Todo   |
| BL-211 | Implementar delivery tracking e retry logic                                    | P0         | M          | Todo   |
| BL-212 | Implementar rate limiting de envio de e-mail                                   | P0         | M          | Todo   |
| BL-213 | Configurar SMTP para local (Mailhog/Mailpit)                                   | P0         | S          | Todo   |
| BL-214 | Implementar health checks                                                      | P0         | S          | Todo   |
| BL-215 | Configurar Swagger/OpenAPI                                                     | P0         | M          | Todo   |
| BL-216 | Testes unitários para use cases e template engine                              | P0         | L          | Todo   |
| BL-217 | Testes de integração para controller e consumer                                | P0         | L          | Todo   |
| BL-218 | Criar Dockerfile multi-stage                                                   | P0         | M          | Todo   |
| BL-219 | Adicionar ao docker-compose.yml                                                | P0         | S          | Todo   |
| BL-220 | Adicionar Mailpit ao docker-compose para dev                                   | P1         | S          | Todo   |
| BL-221 | Criar README do notification-service                                           | P0         | M          | Todo   |
| BL-222 | Validar fluxo: auth register → evento → e-mail enviado                         | P0         | M          | Todo   |
| BL-223 | Validar in-app notification CRUD via API                                       | P0         | M          | Todo   |
| BL-224 | Implementar /metrics endpoint                                                  | P1         | S          | Todo   |
| BL-225 | Implementar logging estruturado                                                | P0         | S          | Todo   |
| BL-226 | Criar seed com templates padrão                                                | P1         | S          | Todo   |
| BL-227 | Adicionar rota notification no Gateway                                         | P0         | S          | Todo   |
| BL-228 | Review e merge do milestone M4                                                 | P0         | S          | Todo   |

---

## M5 — HelpDesk SaaS (BL-229 a BL-293)

### HelpDesk API (BL-229 a BL-262)

| ID     | Tarefa                                                                               | Prioridade | Estimativa | Status |
| ------ | ------------------------------------------------------------------------------------ | ---------- | ---------- | ------ |
| BL-229 | Scaffold helpdesk-api em 03-services                                                 | P0         | S          | Todo   |
| BL-230 | Configurar Prisma com schema helpdesk_db                                             | P0         | M          | Todo   |
| BL-231 | Criar models: Ticket, TicketComment, TicketHistory, Category, SlaPolicy, OutboxEvent | P0         | L          | Todo   |
| BL-232 | Gerar e aplicar migration inicial                                                    | P0         | S          | Todo   |
| BL-233 | Configurar RLS (Row-Level Security) para tenant isolation                            | P0         | L          | Todo   |
| BL-234 | Implementar Prisma middleware para injetar tenant_id                                 | P0         | M          | Todo   |
| BL-235 | Implementar domain entity Ticket com workflow validation                             | P0         | L          | Todo   |
| BL-236 | Implementar domain entity TicketComment                                              | P0         | M          | Todo   |
| BL-237 | Implementar CreateTicketUseCase                                                      | P0         | L          | Todo   |
| BL-238 | Implementar ListTicketsUseCase com filtros e paginação cursor                        | P0         | L          | Todo   |
| BL-239 | Implementar GetTicketUseCase                                                         | P0         | M          | Todo   |
| BL-240 | Implementar UpdateTicketUseCase                                                      | P0         | M          | Todo   |
| BL-241 | Implementar AddCommentUseCase                                                        | P0         | M          | Todo   |
| BL-242 | Implementar AssignTicketUseCase                                                      | P0         | M          | Todo   |
| BL-243 | Implementar GetTicketHistoryUseCase                                                  | P0         | M          | Todo   |
| BL-244 | Implementar ticket status transition validation (workflow)                           | P0         | M          | Todo   |
| BL-245 | Implementar CreateCategoryUseCase                                                    | P0         | M          | Todo   |
| BL-246 | Implementar ListCategoriesUseCase                                                    | P0         | S          | Todo   |
| BL-247 | Implementar ListAgentsUseCase                                                        | P0         | M          | Todo   |
| BL-248 | Implementar SlaPolicyService com cálculo de due dates                                | P0         | L          | Todo   |
| BL-249 | Implementar BullMQ worker: check-sla-breach                                          | P0         | M          | Todo   |
| BL-250 | Implementar BullMQ worker: auto-assign-ticket                                        | P1         | M          | Todo   |
| BL-251 | Implementar OutboxEvent publisher para notification e analytics queues               | P0         | M          | Todo   |
| BL-252 | Implementar TicketsController com todos endpoints                                    | P0         | L          | Todo   |
| BL-253 | Implementar CategoriesController                                                     | P0         | M          | Todo   |
| BL-254 | Implementar AgentsController                                                         | P0         | M          | Todo   |
| BL-255 | Implementar Redis cache para listagem de tickets                                     | P1         | M          | Todo   |
| BL-256 | Implementar health checks, metrics, logging                                          | P0         | M          | Todo   |
| BL-257 | Configurar Swagger/OpenAPI                                                           | P0         | M          | Todo   |
| BL-258 | Testes unitários para use cases e domain                                             | P0         | L          | Todo   |
| BL-259 | Testes de integração para controllers                                                | P0         | L          | Todo   |
| BL-260 | Testes de tenant isolation (cross-tenant access denied)                              | P0         | M          | Todo   |
| BL-261 | Criar Dockerfile e adicionar ao docker-compose                                       | P0         | M          | Todo   |
| BL-262 | Adicionar rotas helpdesk no Gateway                                                  | P0         | S          | Todo   |

### HelpDesk App (BL-263 a BL-293)

| ID     | Tarefa                                                                 | Prioridade | Estimativa | Status |
| ------ | ---------------------------------------------------------------------- | ---------- | ---------- | ------ |
| BL-263 | Scaffold helpdesk app em 04-apps com Next.js App Router                | P0         | S          | Todo   |
| BL-264 | Configurar Tailwind com @novadesk/ui tokens                            | P0         | S          | Todo   |
| BL-265 | Implementar layout com Sidebar e AuthLayout                            | P0         | M          | Todo   |
| BL-266 | Implementar página de login                                            | P0         | M          | Todo   |
| BL-267 | Implementar AuthProvider integration                                   | P0         | M          | Todo   |
| BL-268 | Implementar SDK client para HelpDesk API                               | P0         | M          | Todo   |
| BL-269 | Implementar feature: ticket list com filtros e paginação               | P0         | L          | Todo   |
| BL-270 | Implementar feature: ticket detail com comments thread                 | P0         | L          | Todo   |
| BL-271 | Implementar feature: create ticket form                                | P0         | M          | Todo   |
| BL-272 | Implementar feature: ticket status actions (agent)                     | P0         | M          | Todo   |
| BL-273 | Implementar feature: assign ticket (agent/admin)                       | P0         | M          | Todo   |
| BL-274 | Implementar feature: add comment (user e agent)                        | P0         | M          | Todo   |
| BL-275 | Implementar feature: categories management (admin)                     | P1         | M          | Todo   |
| BL-276 | Implementar dashboard view para agentes (ticket stats)                 | P1         | M          | Todo   |
| BL-277 | Implementar notifications bell (in-app)                                | P1         | M          | Todo   |
| BL-278 | Implementar loading, error e empty states em todas views               | P0         | M          | Todo   |
| BL-279 | Implementar responsive design mobile                                   | P0         | M          | Todo   |
| BL-280 | Testes de componente para features críticas                            | P0         | L          | Todo   |
| BL-281 | Configurar Playwright e2e: login → create ticket                       | P0         | L          | Todo   |
| BL-282 | Configurar Playwright e2e: agent resolve ticket                        | P0         | L          | Todo   |
| BL-283 | Criar Dockerfile para helpdesk app                                     | P0         | M          | Todo   |
| BL-284 | Adicionar ao docker-compose e Nginx routing                            | P0         | S          | Todo   |
| BL-285 | Criar seed com 50 tickets demo                                         | P1         | M          | Todo   |
| BL-286 | Criar README do helpdesk app                                           | P0         | M          | Todo   |
| BL-287 | Criar README do helpdesk-api                                           | P0         | M          | Todo   |
| BL-288 | Validar fluxo completo: user cria ticket → agent resolve → notificação | P0         | M          | Todo   |
| BL-289 | Validar SLA breach detection e alerta                                  | P1         | M          | Todo   |
| BL-290 | Validar tenant isolation na UI                                         | P0         | M          | Todo   |
| BL-291 | Screenshots para README                                                | P1         | S          | Todo   |
| BL-292 | Criar ADR-003 para decisões do HelpDesk                                | P1         | M          | Todo   |
| BL-293 | Review e merge do milestone M5                                         | P0         | S          | Todo   |

---

## M6 — Analytics Dashboard (BL-294 a BL-336)

### Analytics API (BL-294 a BL-314)

| ID     | Tarefa                                                                         | Prioridade | Estimativa | Status |
| ------ | ------------------------------------------------------------------------------ | ---------- | ---------- | ------ |
| BL-294 | Scaffold analytics-api em 03-services                                          | P0         | S          | Todo   |
| BL-295 | Configurar Prisma com schema analytics_db                                      | P0         | M          | Todo   |
| BL-296 | Criar models: TicketMetricsDaily, AgentMetricsDaily, SlaMetricsDaily, EventLog | P0         | M          | Todo   |
| BL-297 | Gerar e aplicar migration inicial                                              | P0         | S          | Todo   |
| BL-298 | Configurar RLS para tenant isolation                                           | P0         | M          | Todo   |
| BL-299 | Implementar BullMQ consumer para analytics-queue                               | P0         | L          | Todo   |
| BL-300 | Implementar handler: process-ticket-event                                      | P0         | M          | Todo   |
| BL-301 | Implementar worker: aggregate-daily-metrics (cron)                             | P0         | L          | Todo   |
| BL-302 | Implementar GetOverviewUseCase (KPIs)                                          | P0         | L          | Todo   |
| BL-303 | Implementar GetTicketMetricsUseCase                                            | P0         | M          | Todo   |
| BL-304 | Implementar GetAgentMetricsUseCase                                             | P0         | M          | Todo   |
| BL-305 | Implementar GetSlaMetricsUseCase                                               | P0         | M          | Todo   |
| BL-306 | Implementar GetTrendsUseCase                                                   | P0         | M          | Todo   |
| BL-307 | Implementar ExportReportUseCase (CSV)                                          | P1         | L          | Todo   |
| BL-308 | Implementar AnalyticsController                                                | P0         | M          | Todo   |
| BL-309 | Implementar Redis cache para queries de dashboard                              | P0         | M          | Todo   |
| BL-310 | Configurar Swagger, health, metrics, logging                                   | P0         | M          | Todo   |
| BL-311 | Testes unitários e de integração                                               | P0         | L          | Todo   |
| BL-312 | Criar Dockerfile e adicionar ao docker-compose                                 | P0         | M          | Todo   |
| BL-313 | Adicionar rotas analytics no Gateway                                           | P0         | S          | Todo   |
| BL-314 | Criar README do analytics-api                                                  | P0         | M          | Todo   |

### Analytics App (BL-315 a BL-336)

| ID     | Tarefa                                              | Prioridade | Estimativa | Status |
| ------ | --------------------------------------------------- | ---------- | ---------- | ------ |
| BL-315 | Scaffold analytics app em 04-apps com Next.js       | P0         | S          | Todo   |
| BL-316 | Implementar layout com dashboard sidebar            | P0         | M          | Todo   |
| BL-317 | Implementar SDK client para Analytics API           | P0         | M          | Todo   |
| BL-318 | Implementar overview page com KPI cards             | P0         | L          | Todo   |
| BL-319 | Implementar ticket metrics charts (Recharts)        | P0         | L          | Todo   |
| BL-320 | Implementar agent performance table                 | P0         | M          | Todo   |
| BL-321 | Implementar SLA compliance chart                    | P0         | M          | Todo   |
| BL-322 | Implementar trends line chart com date range filter | P0         | L          | Todo   |
| BL-323 | Implementar export button (CSV download)            | P1         | M          | Todo   |
| BL-324 | Implementar date range picker filter                | P0         | M          | Todo   |
| BL-325 | Implementar loading, error states e empty data      | P0         | M          | Todo   |
| BL-326 | Implementar responsive design                       | P0         | M          | Todo   |
| BL-327 | Testes de componente para charts e filters          | P0         | M          | Todo   |
| BL-328 | Playwright e2e: login → view dashboard → filter     | P0         | L          | Todo   |
| BL-329 | Criar Dockerfile e Nginx routing                    | P0         | M          | Todo   |
| BL-330 | Criar README do analytics app                       | P0         | M          | Todo   |
| BL-331 | Validar dados corretos após eventos de ticket       | P0         | M          | Todo   |
| BL-332 | Validar cache invalidation após novos eventos       | P1         | M          | Todo   |
| BL-333 | Screenshots para README                             | P1         | S          | Todo   |
| BL-334 | Implementar /metrics e logging no analytics-api     | P1         | S          | Todo   |
| BL-335 | Seed de métricas demo para staging                  | P1         | M          | Todo   |
| BL-336 | Review e merge do milestone M6                      | P0         | S          | Todo   |

---

## M7 — Realtime Chat (BL-337 a BL-374)

| ID     | Tarefa                                                            | Prioridade | Estimativa | Status |
| ------ | ----------------------------------------------------------------- | ---------- | ---------- | ------ |
| BL-337 | Scaffold realtime-chat em 03-services                             | P0         | S          | Todo   |
| BL-338 | Configurar Prisma com schema chat_db                              | P0         | M          | Todo   |
| BL-339 | Criar models: ChatRoom, ChatMessage, ChatParticipant, OutboxEvent | P0         | M          | Todo   |
| BL-340 | Gerar e aplicar migration inicial                                 | P0         | S          | Todo   |
| BL-341 | Implementar Socket.IO gateway com JWT auth no handshake           | P0         | L          | Todo   |
| BL-342 | Configurar Redis adapter para Socket.IO multi-instance            | P0         | M          | Todo   |
| BL-343 | Implementar CreateRoomUseCase (por ticket)                        | P0         | M          | Todo   |
| BL-344 | Implementar JoinRoomUseCase                                       | P0         | M          | Todo   |
| BL-345 | Implementar SendMessageUseCase                                    | P0         | M          | Todo   |
| BL-346 | Implementar GetMessageHistoryUseCase com paginação                | P0         | M          | Todo   |
| BL-347 | Implementar ListRoomsUseCase                                      | P0         | M          | Todo   |
| BL-348 | Implementar presence tracking (online/offline) via Redis          | P0         | M          | Todo   |
| BL-349 | Implementar typing indicators                                     | P1         | M          | Todo   |
| BL-350 | Implementar ChatController (REST endpoints)                       | P0         | M          | Todo   |
| BL-351 | Implementar ChatGateway (WebSocket events)                        | P0         | L          | Todo   |
| BL-352 | Implementar BullMQ worker: notify-offline-user                    | P0         | M          | Todo   |
| BL-353 | Implementar OutboxEvent publisher                                 | P0         | M          | Todo   |
| BL-354 | Configurar Nginx WebSocket proxy (/ws/*)                          | P0         | M          | Todo   |
| BL-355 | Adicionar rotas chat no Gateway                                   | P0         | S          | Todo   |
| BL-356 | Implementar health, metrics, logging                              | P0         | M          | Todo   |
| BL-357 | Testes unitários para use cases                                   | P0         | L          | Todo   |
| BL-358 | Testes de integração para WebSocket events                        | P0         | L          | Todo   |
| BL-359 | Criar Dockerfile e adicionar ao docker-compose                    | P0         | M          | Todo   |
| BL-360 | Implementar chat widget component em @novadesk/ui                 | P0         | L          | Todo   |
| BL-361 | Integrar chat widget no HelpDesk ticket detail page               | P0         | L          | Todo   |
| BL-362 | Implementar chat hook useChat com Socket.IO client                | P0         | M          | Todo   |
| BL-363 | Playwright e2e: send message → receive in realtime                | P0         | L          | Todo   |
| BL-364 | Validar offline notification via Notification Service             | P1         | M          | Todo   |
| BL-365 | Validar reconexão automática após disconnect                      | P1         | M          | Todo   |
| BL-366 | Criar README do realtime-chat                                     | P0         | M          | Todo   |
| BL-367 | Criar ADR-004 para WebSocket library decision                     | P1         | M          | Todo   |
| BL-368 | Testes de componente para chat widget                             | P0         | M          | Todo   |
| BL-369 | Implementar message validation com Zod                            | P0         | S          | Todo   |
| BL-370 | Implementar heartbeat ping/pong (30s)                             | P0         | S          | Todo   |
| BL-371 | Seed de chat rooms e messages demo                                | P1         | M          | Todo   |
| BL-372 | Screenshots de chat para README                                   | P1         | S          | Todo   |
| BL-373 | Validar chat com múltiplos participantes                          | P0         | M          | Todo   |
| BL-374 | Review e merge do milestone M7                                    | P0         | S          | Todo   |

---

## M8 — Admin Portal (BL-375 a BL-407)

| ID     | Tarefa                                                    | Prioridade | Estimativa | Status |
| ------ | --------------------------------------------------------- | ---------- | ---------- | ------ |
| BL-375 | Scaffold admin-portal em 04-apps com Next.js              | P0         | S          | Todo   |
| BL-376 | Implementar layout admin com sidebar navigation           | P0         | M          | Todo   |
| BL-377 | Implementar auth com role super_admin e admin check       | P0         | M          | Todo   |
| BL-378 | Implementar SDK clients para Auth, Analytics APIs         | P0         | M          | Todo   |
| BL-379 | Implementar feature: tenants list com CRUD                | P0         | L          | Todo   |
| BL-380 | Implementar feature: create tenant form                   | P0         | M          | Todo   |
| BL-381 | Implementar feature: tenant detail e settings             | P0         | M          | Todo   |
| BL-382 | Implementar feature: users list com filtros               | P0         | L          | Todo   |
| BL-383 | Implementar feature: create user com role assignment      | P0         | M          | Todo   |
| BL-384 | Implementar feature: user detail e edit                   | P0         | M          | Todo   |
| BL-385 | Implementar feature: invite user by email                 | P1         | M          | Todo   |
| BL-386 | Implementar dashboard overview (platform KPIs)            | P0         | L          | Todo   |
| BL-387 | Implementar audit log viewer com filtros                  | P0         | L          | Todo   |
| BL-388 | Implementar service health dashboard                      | P1         | M          | Todo   |
| BL-389 | Implementar loading, error states em todas views          | P0         | M          | Todo   |
| BL-390 | Implementar responsive design                             | P0         | M          | Todo   |
| BL-391 | Testes de componente para features críticas               | P0         | M          | Todo   |
| BL-392 | Playwright e2e: admin login → create tenant → create user | P0         | L          | Todo   |
| BL-393 | Criar Dockerfile e Nginx routing (/admin/*)               | P0         | M          | Todo   |
| BL-394 | Criar README do admin-portal                              | P0         | M          | Todo   |
| BL-395 | Validar RBAC: agent não acessa admin portal               | P0         | M          | Todo   |
| BL-396 | Validar super_admin acessa todos tenants                  | P0         | M          | Todo   |
| BL-397 | Validar admin acessa apenas seu tenant                    | P0         | M          | Todo   |
| BL-398 | Screenshots para README                                   | P1         | S          | Todo   |
| BL-399 | Implementar breadcrumbs navigation                        | P2         | S          | Todo   |
| BL-400 | Implementar confirmation dialogs para ações destrutivas   | P0         | S          | Todo   |
| BL-401 | Implementar toast notifications para actions              | P0         | S          | Todo   |
| BL-402 | Implementar search/filter em tabelas                      | P1         | M          | Todo   |
| BL-403 | Implementar pagination em todas listagens                 | P0         | M          | Todo   |
| BL-404 | Integrar analytics overview no dashboard                  | P1         | M          | Todo   |
| BL-405 | Implementar dark mode                                     | P1         | M          | Todo   |
| BL-406 | Adicionar admin-portal ao docker-compose                  | P0         | S          | Todo   |
| BL-407 | Review e merge do milestone M8                            | P0         | S          | Todo   |

---

## M9 — NovaDesk Website (BL-408 a BL-435)

| ID     | Tarefa                                                      | Prioridade | Estimativa | Status |
| ------ | ----------------------------------------------------------- | ---------- | ---------- | ------ |
| BL-408 | Scaffold novadesk-website em 04-apps com Next.js            | P0         | S          | Todo   |
| BL-409 | Implementar landing page com hero section                   | P0         | L          | Todo   |
| BL-410 | Implementar about section                                   | P0         | M          | Todo   |
| BL-411 | Implementar skills/tech stack section                       | P0         | M          | Todo   |
| BL-412 | Implementar projects showcase section (NovaDesk featured)   | P0         | L          | Todo   |
| BL-413 | Implementar case studies section com links                  | P0         | M          | Todo   |
| BL-414 | Implementar experience/timeline section                     | P0         | M          | Todo   |
| BL-415 | Implementar contact section com formulário                  | P0         | M          | Todo   |
| BL-416 | Implementar contact form submission via API Gateway         | P0         | M          | Todo   |
| BL-417 | Implementar SEO: meta tags, Open Graph, Twitter cards       | P0         | M          | Todo   |
| BL-418 | Implementar sitemap.xml e robots.txt                        | P0         | S          | Todo   |
| BL-419 | Implementar structured data (JSON-LD)                       | P1         | M          | Todo   |
| BL-420 | Implementar responsive design mobile-first                  | P0         | M          | Todo   |
| BL-421 | Implementar animations e transitions sutis                  | P1         | M          | Todo   |
| BL-422 | Otimizar imagens com next/image                             | P0         | M          | Todo   |
| BL-423 | Configurar SSG para todas as páginas                        | P0         | M          | Todo   |
| BL-424 | Lighthouse performance score ≥ 90                           | P0         | M          | Todo   |
| BL-425 | Lighthouse accessibility score ≥ 90                         | P0         | M          | Todo   |
| BL-426 | Testes de componente para sections                          | P1         | M          | Todo   |
| BL-427 | Playwright e2e: navegação e formulário de contato           | P0         | L          | Todo   |
| BL-428 | Criar Dockerfile e Nginx routing (/*)                       | P0         | M          | Todo   |
| BL-429 | Criar README do novadesk-website                            | P0         | M          | Todo   |
| BL-430 | Criar favicon e OG image                                    | P1         | S          | Todo   |
| BL-431 | Implementar footer com links sociais                        | P1         | S          | Todo   |
| BL-432 | Implementar 404 page customizada                            | P1         | S          | Todo   |
| BL-433 | Validar formulário de contato envia e-mail via Notification | P0         | M          | Todo   |
| BL-434 | Screenshots e demo GIF para README                          | P1         | M          | Todo   |
| BL-435 | Review e merge do milestone M9                              | P0         | S          | Todo   |

---

## M10 — Infraestrutura e DevOps (BL-436 a BL-478)

| ID     | Tarefa                                                      | Prioridade | Estimativa | Status |
| ------ | ----------------------------------------------------------- | ---------- | ---------- | ------ |
| BL-436 | Configurar Nginx completo com todos os server blocks        | P0         | L          | Todo   |
| BL-437 | Configurar SSL/TLS com Let's Encrypt (Certbot)              | P0         | L          | Todo   |
| BL-438 | Configurar gzip compression no Nginx                        | P0         | S          | Todo   |
| BL-439 | Configurar security headers no Nginx                        | P0         | M          | Todo   |
| BL-440 | Configurar WebSocket proxy no Nginx                         | P0         | M          | Todo   |
| BL-441 | Criar docker-compose.staging.yml                            | P0         | M          | Todo   |
| BL-442 | Criar docker-compose.prod.yml                               | P0         | M          | Todo   |
| BL-443 | Otimizar Dockerfiles para production (distroless, non-root) | P0         | L          | Todo   |
| BL-444 | Configurar PgBouncer para connection pooling                | P1         | L          | Todo   |
| BL-445 | Implementar CI pipeline completo (ci.yml)                   | P0         | L          | Todo   |
| BL-446 | Implementar deploy-staging.yml                              | P0         | L          | Todo   |
| BL-447 | Implementar deploy-production.yml                           | P0         | L          | Todo   |
| BL-448 | Implementar release.yml para tags                           | P0         | M          | Todo   |
| BL-449 | Configurar GHCR para container registry                     | P0         | M          | Todo   |
| BL-450 | Implementar smoke tests pós-deploy                          | P0         | M          | Todo   |
| BL-451 | Criar script backup-db.sh com pg_dump automatizado          | P0         | M          | Todo   |
| BL-452 | Criar script restore-db.sh                                  | P0         | M          | Todo   |
| BL-453 | Criar script migrate-all.sh                                 | P0         | M          | Todo   |
| BL-454 | Criar script health-check.sh                                | P0         | S          | Todo   |
| BL-455 | Configurar cron para backup diário                          | P0         | S          | Todo   |
| BL-456 | Provisionar VPS para staging                                | P0         | M          | Todo   |
| BL-457 | Deploy staging completo com todos os serviços               | P0         | L          | Todo   |
| BL-458 | Validar staging acessível via HTTPS                         | P0         | M          | Todo   |
| BL-459 | Configurar DNS para staging.novadesk.dev                    | P0         | S          | Todo   |
| BL-460 | Implementar CodeQL workflow                                 | P1         | M          | Todo   |
| BL-461 | Configurar Turborepo remote cache                           | P1         | M          | Todo   |
| BL-462 | Validar deploy independente por serviço                     | P0         | M          | Todo   |
| BL-463 | Documentar procedimento de deploy em 06-DevOps.md           | P0         | M          | Todo   |
| BL-464 | Validar rollback de deploy funciona                         | P0         | M          | Todo   |
| BL-465 | Configurar Docker health checks em todos os containers      | P0         | M          | Todo   |
| BL-466 | Implementar graceful shutdown em todos os serviços          | P0         | M          | Todo   |
| BL-467 | Configurar log rotation para Docker logs                    | P1         | S          | Todo   |
| BL-468 | Criar 06-tools/cli com commands básicos                     | P1         | L          | Todo   |
| BL-469 | Implementar generate-service command no CLI                 | P1         | L          | Todo   |
| BL-470 | Implementar generate-module command no CLI                  | P2         | M          | Todo   |
| BL-471 | Validar CI executa apenas pacotes afetados (Turborepo)      | P0         | M          | Todo   |
| BL-472 | Validar build time CI < 15 min                              | P1         | M          | Todo   |
| BL-473 | Configurar secrets no GitHub para deploy                    | P0         | M          | Todo   |
| BL-474 | Testar deploy staging end-to-end                            | P0         | L          | Todo   |
| BL-475 | Criar docker-compose profile observability                  | P1         | M          | Todo   |
| BL-476 | Validar todos os serviços sobem com docker compose up       | P0         | M          | Todo   |
| BL-477 | Validar paridade entre local e staging                      | P0         | M          | Todo   |
| BL-478 | Review e merge do milestone M10                             | P0         | S          | Todo   |

---

## M11 — Observabilidade e Segurança (BL-479 a BL-511)

| ID     | Tarefa                                                      | Prioridade | Estimativa | Status |
| ------ | ----------------------------------------------------------- | ---------- | ---------- | ------ |
| BL-479 | Configurar Prometheus com scrape de todos os serviços       | P0         | L          | Todo   |
| BL-480 | Configurar Grafana com datasource Prometheus                | P0         | M          | Todo   |
| BL-481 | Criar dashboard: Platform Overview                          | P0         | L          | Todo   |
| BL-482 | Criar dashboard: per-service detail                         | P0         | M          | Todo   |
| BL-483 | Criar dashboard: Business Metrics                           | P0         | L          | Todo   |
| BL-484 | Criar dashboard: Infrastructure                             | P1         | M          | Todo   |
| BL-485 | Criar dashboard: BullMQ Queues                              | P1         | M          | Todo   |
| BL-486 | Configurar OpenTelemetry Collector                          | P0         | L          | Todo   |
| BL-487 | Instrumentar todos os serviços com OTel SDK                 | P0         | L          | Todo   |
| BL-488 | Configurar Jaeger ou Grafana Tempo para traces              | P0         | M          | Todo   |
| BL-489 | Configurar Sentry para todos os serviços backend            | P0         | M          | Todo   |
| BL-490 | Configurar Sentry para todos os apps frontend               | P0         | M          | Todo   |
| BL-491 | Configurar alert rules no Prometheus                        | P0         | M          | Todo   |
| BL-492 | Configurar alertas: HighErrorRate                           | P0         | S          | Todo   |
| BL-493 | Configurar alertas: HighLatency                             | P0         | S          | Todo   |
| BL-494 | Configurar alertas: ServiceDown                             | P0         | S          | Todo   |
| BL-495 | Configurar alertas: DiskSpaceLow                            | P1         | S          | Todo   |
| BL-496 | Configurar notification channel (email) para alertas        | P0         | M          | Todo   |
| BL-497 | Executar npm audit e resolver critical/high                 | P0         | M          | Todo   |
| BL-498 | Executar CodeQL e resolver findings                         | P0         | M          | Todo   |
| BL-499 | Executar OWASP ZAP baseline scan em staging                 | P1         | L          | Todo   |
| BL-500 | Validar rate limiting em todos os endpoints                 | P0         | M          | Todo   |
| BL-501 | Validar CORS em staging e production                        | P0         | S          | Todo   |
| BL-502 | Validar security headers via securityheaders.com            | P0         | S          | Todo   |
| BL-503 | Validar tenant isolation com testes automatizados           | P0         | M          | Todo   |
| BL-504 | Validar JWT expiration e refresh flow                       | P0         | M          | Todo   |
| BL-505 | Validar password policy enforcement                         | P0         | S          | Todo   |
| BL-506 | Validar audit logging para eventos de segurança             | P0         | M          | Todo   |
| BL-507 | Validar PII redaction em logs                               | P0         | M          | Todo   |
| BL-508 | Documentar resultados do security audit                     | P0         | M          | Todo   |
| BL-509 | Configurar Web Vitals reporting no frontend                 | P1         | M          | Todo   |
| BL-510 | Validar SLOs em staging (availability, latency, error rate) | P0         | L          | Todo   |
| BL-511 | Review e merge do milestone M11                             | P0         | S          | Todo   |

---

## M12 — Case Studies e Documentação Final (BL-512 a BL-533)

| ID     | Tarefa                                                     | Prioridade | Estimativa | Status |
| ------ | ---------------------------------------------------------- | ---------- | ---------- | ------ |
| BL-512 | Finalizar case study Spell                                 | P0         | L          | Todo   |
| BL-513 | Finalizar case study Broom                                 | P0         | L          | Todo   |
| BL-514 | Finalizar case study Teste de Perfil                       | P0         | L          | Todo   |
| BL-515 | Revisar consistência entre todos os docs de engenharia     | P0         | L          | Todo   |
| BL-516 | Atualizar README.md root com badges e screenshots          | P0         | M          | Todo   |
| BL-517 | Atualizar CHANGELOG.md para v1.0.0                         | P0         | M          | Todo   |
| BL-518 | Criar ADRs pendentes (ADR-003 a ADR-005)                   | P0         | M          | Todo   |
| BL-519 | Validar todos os READMEs de serviços estão completos       | P0         | M          | Todo   |
| BL-520 | Validar todos os OpenAPI specs estão publicados            | P0         | M          | Todo   |
| BL-521 | Gravar demo video ou criar GIF animado                     | P1         | L          | Todo   |
| BL-522 | Atualizar NovaDesk Website com case studies                | P0         | M          | Todo   |
| BL-523 | Revisar e corrigir links cruzados entre documentos         | P0         | M          | Todo   |
| BL-524 | Validar glossário está completo                            | P1         | S          | Todo   |
| BL-525 | Validar runbooks estão testados                            | P0         | M          | Todo   |
| BL-526 | Criar diagrama de arquitetura final atualizado             | P0         | M          | Todo   |
| BL-527 | Publicar Storybook do @novadesk/ui                         | P1         | M          | Todo   |
| BL-528 | Documentar lições aprendidas do desenvolvimento            | P1         | M          | Todo   |
| BL-529 | Retrospectiva milestone M0-M11                             | P1         | M          | Todo   |
| BL-530 | Verificar todos os 511 backlog items anteriores estão Done | P0         | M          | Todo   |
| BL-531 | Atualizar Service Catalog com status final                 | P0         | S          | Todo   |
| BL-532 | Atualizar Data Architecture com schemas finais             | P0         | S          | Todo   |
| BL-533 | Review e merge do milestone M12                            | P0         | S          | Todo   |

---

## M13 — Production Readiness (BL-534 a BL-560)

| ID     | Tarefa                                             | Prioridade | Estimativa | Status |
| ------ | -------------------------------------------------- | ---------- | ---------- | ------ |
| BL-534 | Provisionar VPS para production                    | P0         | M          | Todo   |
| BL-535 | Configurar DNS para novadesk.dev                   | P0         | S          | Todo   |
| BL-536 | Deploy production com todos os serviços            | P0         | L          | Todo   |
| BL-537 | Configurar SSL production com Let's Encrypt        | P0         | M          | Todo   |
| BL-538 | Executar migrations em production                  | P0         | M          | Todo   |
| BL-539 | Executar seed super_admin em production            | P0         | S          | Todo   |
| BL-540 | Smoke tests em production                          | P0         | M          | Todo   |
| BL-541 | E2E tests contra production                        | P0         | L          | Todo   |
| BL-542 | Validar performance SLOs em production             | P0         | L          | Todo   |
| BL-543 | Validar security headers em production             | P0         | S          | Todo   |
| BL-544 | Validar backup automatizado funciona em production | P0         | M          | Todo   |
| BL-545 | Configurar monitoring e alertas em production      | P0         | M          | Todo   |
| BL-546 | Testar rollback em production                      | P0         | M          | Todo   |
| BL-547 | Testar recovery de backup em staging               | P0         | L          | Todo   |
| BL-548 | Validar todos os 8 apps acessíveis em production   | P0         | M          | Todo   |
| BL-549 | Validar integração end-to-end em production        | P0         | L          | Todo   |
| BL-550 | Criar GitHub Release v1.0.0                        | P0         | M          | Todo   |
| BL-551 | Publicar CHANGELOG v1.0.0                          | P0         | S          | Todo   |
| BL-552 | Atualizar NovaDesk Website com links de production | P0         | S          | Todo   |
| BL-553 | Gravar demo final do ecossistema completo          | P1         | L          | Todo   |
| BL-554 | Atualizar screenshots de todos os serviços         | P1         | M          | Todo   |
| BL-555 | Verificar Lighthouse scores em production          | P0         | M          | Todo   |
| BL-556 | Documentar post-mortem de production deploy        | P1         | M          | Todo   |
| BL-557 | Marcar todos os 560 backlog items como Done        | P0         | S          | Todo   |
| BL-558 | Marcar todos os milestones M0-M13 como completos   | P0         | S          | Todo   |
| BL-559 | Atualizar Roadmap com status final                 | P0         | S          | Todo   |
| BL-560 | Celebrar release v1.0.0 do NovaDesk                | P0         | XS         | Todo   |

---

## Resumo por milestone

| Milestone         | Items   | ID range        | Estimativa      |
| ----------------- | ------- | --------------- | --------------- |
| M0 — Fundação     | 45      | BL-001 – BL-045 | 2 semanas       |
| M1 — Pacotes      | 70      | BL-046 – BL-115 | 3 semanas       |
| M2 — Auth         | 48      | BL-116 – BL-163 | 3 semanas       |
| M3 — Gateway      | 27      | BL-164 – BL-190 | 1 semana        |
| M4 — Notification | 38      | BL-191 – BL-228 | 2 semanas       |
| M5 — HelpDesk     | 65      | BL-229 – BL-293 | 4 semanas       |
| M6 — Analytics    | 43      | BL-294 – BL-336 | 2 semanas       |
| M7 — Chat         | 38      | BL-337 – BL-374 | 2 semanas       |
| M8 — Admin        | 33      | BL-375 – BL-407 | 2 semanas       |
| M9 — Website      | 28      | BL-408 – BL-435 | 2 semanas       |
| M10 — Infra       | 43      | BL-436 – BL-478 | 2 semanas       |
| M11 — Obs/Sec     | 33      | BL-479 – BL-511 | 2 semanas       |
| M12 — Docs        | 22      | BL-512 – BL-533 | 1 semana        |
| M13 — Production  | 27      | BL-534 – BL-560 | 2 semanas       |
| **Total**         | **560** |                 | **~30 semanas** |

---

## Referências cruzadas

| Tópico             | Documento                                              |
| ------------------ | ------------------------------------------------------ |
| Roadmap            | [09-Roadmap.md](./09-Roadmap.md)                       |
| Definition of Done | [11-Definition-of-Done.md](./11-Definition-of-Done.md) |
| Arquitetura        | [01-Architecture.md](./01-Architecture.md)             |
| Git workflow       | [04-Git-Workflow.md](./04-Git-Workflow.md)             |
