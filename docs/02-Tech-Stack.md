# 02 — Tech Stack

**Versão:** 1.0  
**Status:** Aprovado  
**Última atualização:** 2026-07-03  
**Relacionado:** [01-Architecture.md](./01-Architecture.md), [03-Coding-Standards.md](./03-Coding-Standards.md), [06-DevOps.md](./06-DevOps.md)

---

## 1. Princípios de seleção tecnológica

Toda tecnologia neste stack foi escolhida para:

1. **Coesão** — TypeScript de ponta a ponta elimina context switching
2. **Maturidade** — ecossistemas estáveis com comunidade ativa
3. **Empregabilidade** — stack alinhada ao mercado brasileiro e internacional
4. **Testabilidade** — ferramentas de teste de primeira classe
5. **Operabilidade** — suporte a containerização, observabilidade e CI/CD
6. **Documentação** — cada ferramenta possui documentação oficial robusta

Alterações de stack exigem ADR. Ver [templates/adr-template.md](./templates/adr-template.md).

---

## 2. Linguagem e runtime

| Componente | Tecnologia | Versão mínima | Versão alvo | Justificativa |
|------------|------------|---------------|-------------|---------------|
| Linguagem | TypeScript | 5.4 | 5.5+ | Tipagem estática, ecossistema unificado |
| Runtime | Node.js | 20 LTS | 22 LTS | LTS para produção, performance V8 |
| Package manager | pnpm | 9.x | 9.x | Workspaces nativos, eficiência de disco |
| Monorepo orchestrator | Turborepo | 2.x | 2.x | Cache de build, pipeline paralelo |

### 2.1 Política de versões

- Node.js: sempre LTS ativo ou maintenance LTS
- TypeScript: minor versions atualizadas trimestralmente após validação em CI
- Dependências: Renovate ou Dependabot com auto-merge para patches
- Breaking changes de dependências: exigem ADR e atualização de testes

---

## 3. Frontend

| Componente | Tecnologia | Versão alvo | Uso |
|------------|------------|-------------|-----|
| Framework | Next.js | 14.x (App Router) | SSR, SSG, routing, API routes mínimas |
| UI Library | React | 18.x | Componentes, hooks |
| Styling | Tailwind CSS | 3.x | Utility-first CSS |
| Component primitives | Radix UI | Latest stable | Acessibilidade, headless components |
| State server | TanStack Query | 5.x | Cache, sync, mutations |
| Forms | React Hook Form | 7.x | Formulários performáticos |
| Validation | Zod | 3.x | Schema validation client/server |
| Icons | Lucide React | Latest | Ícones consistentes |
| Charts | Recharts | 2.x | Analytics Dashboard |
| Date handling | date-fns | 3.x | Manipulação de datas |
| Testing unit | Vitest | 1.x | Testes de componentes e hooks |
| Testing E2E | Playwright | 1.x | Testes end-to-end |
| Linting | ESLint | 9.x | Via pacote `eslint` |
| Formatting | Prettier | 3.x | Formatação consistente |

### 3.1 Convenções frontend

- App Router exclusivamente (sem Pages Router)
- Server Components por padrão; Client Components apenas quando necessário
- Data fetching via TanStack Query em Client Components ou Server Components com fetch nativo
- Estilos via Tailwind; CSS modules apenas para casos excepcionais
- Componentes de `packages/ui` são framework-agnostic quando possível

Detalhamento em [03-Coding-Standards.md](./03-Coding-Standards.md).

---

## 4. Backend

| Componente | Tecnologia | Versão alvo | Uso |
|------------|------------|-------------|-----|
| Framework | NestJS | 10.x | Microsserviços, DI, modules |
| ORM | Prisma | 5.x | Migrations, queries type-safe |
| Validation | class-validator + class-transformer | Latest | DTOs NestJS |
| Validation (shared) | Zod | 3.x | Schemas compartilhados com frontend |
| API docs | @nestjs/swagger | Latest | OpenAPI generation |
| HTTP client | Axios via @nestjs/axios | Latest | Chamadas inter-serviços |
| WebSocket | @nestjs/websockets + Socket.IO | Latest | Realtime Chat |
| Scheduling | @nestjs/schedule | Latest | Cron jobs leves |
| Config | @nestjs/config | Latest | Variáveis de ambiente |
| Testing unit | Jest | 29.x | Testes de use cases e controllers |
| Testing integration | Jest + Supertest | Latest | Testes de API |
| Testing containers | Testcontainers | Latest | PostgreSQL e Redis em CI |

### 4.1 Convenções backend

- Um módulo NestJS por bounded context
- DTOs com validação em toda entrada HTTP
- Prisma Client injetado via provider customizado
- Controllers finos; lógica em use cases
- Exceções de domínio mapeadas para HTTP via Exception Filters

---

## 5. Banco de dados e persistência

| Componente | Tecnologia | Versão alvo | Uso |
|------------|------------|-------------|-----|
| RDBMS | PostgreSQL | 16.x | Persistência principal |
| Connection pool | PgBouncer | 1.21+ | Pooling em staging/production |
| Migrations | Prisma Migrate | 5.x | Versionamento de schema |
| Cache | Redis | 7.x | Cache, sessões, pub/sub, rate limit |
| Queue | BullMQ | 5.x | Jobs assíncronos |
| Search (futuro) | PostgreSQL FTS | — | Busca full-text v1.0; Elasticsearch em v2.0 |

Detalhamento em [17-Data-Architecture.md](./17-Data-Architecture.md).

---

## 6. Infraestrutura e DevOps

| Componente | Tecnologia | Versão alvo | Uso |
|------------|------------|-------------|-----|
| Containerização | Docker | 24.x+ | Build e runtime |
| Orquestração local | Docker Compose | 2.x | Ambiente de desenvolvimento |
| Reverse proxy | Nginx | 1.25+ | TLS, routing, load balance |
| CI/CD | GitHub Actions | — | Lint, test, build, deploy |
| Secrets | GitHub Secrets + .env | — | Credenciais por ambiente |
| SSL | Let's Encrypt (Certbot) | — | Certificados em staging/production |
| IaC (futuro) | Terraform | 1.7+ | Provisionamento v1.2+ |

Detalhamento em [06-DevOps.md](./06-DevOps.md).

---

## 7. Observabilidade

| Componente | Tecnologia | Versão alvo | Uso |
|------------|------------|-------------|-----|
| Logging | Pino | 8.x | Logging estruturado JSON |
| Log aggregation (local) | Docker logs + Loki (opcional) | — | Agregação em staging |
| Metrics | Prometheus + prom-client | Latest | Métricas de aplicação |
| Dashboards | Grafana | 10.x | Visualização de métricas |
| Tracing | OpenTelemetry | 1.x | Distributed tracing |
| Error tracking | Sentry (free tier) | — | Captura de exceções |
| Health | @nestjs/terminus | Latest | Health checks |

Detalhamento em [08-Observability.md](./08-Observability.md).

---

## 8. Segurança

| Componente | Tecnologia | Uso |
|------------|------------|-----|
| JWT | jsonwebtoken + jwks-rsa | Tokens RS256 |
| Password hashing | bcrypt | Hash de senhas (cost factor 12) |
| Rate limiting | @nestjs/throttler + Redis | Proteção contra abuse |
| CORS | NestJS built-in | Política por ambiente |
| Helmet | helmet | Security headers |
| Dependency scanning | npm audit + Snyk/GitHub Dependabot | Vulnerabilidades |
| SAST | ESLint security plugins | Análise estática |

Detalhamento em [07-Security.md](./07-Security.md).

---

## 9. Ferramentas de desenvolvimento

| Ferramenta | Uso |
|------------|-----|
| VS Code / Cursor | IDE principal |
| Docker Desktop / Colima | Containers locais |
| Prisma Studio | Inspeção de banco |
| Swagger UI | Teste de APIs |
| Redis Insight | Inspeção de Redis |
| pgAdmin / DBeaver | Administração PostgreSQL |
| Bruno / Insomnia | Coleções de API para testes manuais |
| Turborepo | Build pipeline monorepo |
| Husky | Git hooks |
| lint-staged | Lint em pre-commit |
| commitlint | Validação Conventional Commits |

---

## 10. Matriz de tecnologia por serviço

| Serviço | NestJS | Prisma | Redis | BullMQ | WebSocket | Next.js |
|---------|--------|--------|-------|--------|-----------|---------|
| Auth Service | ✓ | ✓ | ✓ | ✓ | — | — |
| API Gateway | ✓ | — | ✓ | — | — | — |
| Notification Service | ✓ | ✓ | ✓ | ✓ | — | — |
| HelpDesk API | ✓ | ✓ | ✓ | ✓ | — | — |
| Analytics API | ✓ | ✓ | ✓ | ✓ | — | — |
| Realtime Chat | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| HelpDesk SaaS | — | — | — | — | — | ✓ |
| Analytics Dashboard | — | — | — | — | — | ✓ |
| Admin Portal | — | — | — | — | — | ✓ |
| Portfolio Website | — | — | — | — | — | ✓ |

---

## 11. Pacotes compartilhados e suas tecnologias

| Pacote | Tecnologias principais |
|--------|------------------------|
| `typescript` | tsconfig bases (strict, node, react) |
| `eslint` | ESLint flat config, regras compartilhadas |
| `config` | Zod schemas para variáveis de ambiente |
| `shared` | Tipos, constantes, enums, utils puros |
| `logger` | Pino wrapper, request context |
| `auth` | JWT utils, guards compartilhados, client auth |
| `sdk` | Client HTTP tipado gerado/manual por serviço |
| `ui` | React, Tailwind, Radix, Storybook |

---

## 12. Compatibilidade e browsers

### 12.1 Browsers suportados (frontend)

| Browser | Versão mínima |
|---------|---------------|
| Chrome | Últimas 2 versões |
| Firefox | Últimas 2 versões |
| Safari | Últimas 2 versões |
| Edge | Últimas 2 versões |

### 12.2 Node.js engines

Definido em `package.json` root: Node.js `>=20.0.0`, pnpm `>=9.0.0`.

---

## 13. Alternativas consideradas e descartadas

| Categoria | Alternativa | Motivo da rejeição |
|-----------|-------------|-------------------|
| Linguagem backend | Go, Python | Quebra coesão TypeScript full-stack |
| ORM | TypeORM, Drizzle | Prisma superior em DX e migrations |
| Frontend | Remix, Astro | Next.js mais alinhado a portfólio e mercado |
| Queue | RabbitMQ, Kafka | BullMQ suficiente para escala do portfólio |
| Monorepo | Nx | Turborepo mais simples para escopo atual |
| CSS | CSS Modules, Styled Components | Tailwind mais produtivo com `ui` package |
| E2E | Cypress | Playwright superior em multi-browser e speed |

Decisões formais documentadas em `docs/adr/`.

---

## 14. Roadmap tecnológico

| Fase | Adição planejada |
|------|------------------|
| v1.1 | OpenTelemetry collector dedicado, Loki para logs |
| v1.2 | Kubernetes (kind), Helm charts |
| v2.0 | Elasticsearch para busca avançada, feature flags (Unleash) |
| v2.1 | GraphQL federation (avaliar necessidade) |
| v3.0 | gRPC para comunicação inter-serviços de alta performance |

Ver [09-Roadmap.md](./09-Roadmap.md).

---

## 15. Referências cruzadas

| Tópico | Documento |
|--------|-----------|
| Arquitetura | [01-Architecture.md](./01-Architecture.md) |
| Padrões de código | [03-Coding-Standards.md](./03-Coding-Standards.md) |
| Estrutura monorepo | [15-Monorepo-Structure.md](./15-Monorepo-Structure.md) |
| DevOps | [06-DevOps.md](./06-DevOps.md) |
| Segurança | [07-Security.md](./07-Security.md) |
| Observabilidade | [08-Observability.md](./08-Observability.md) |
