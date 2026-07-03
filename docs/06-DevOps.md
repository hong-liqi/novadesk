# 06 — DevOps

**Versão:** 1.0  
**Status:** Aprovado  
**Última atualização:** 2026-07-03  
**Relacionado:** [02-Tech-Stack.md](./02-Tech-Stack.md), [04-Git-Workflow.md](./04-Git-Workflow.md), [08-Observability.md](./08-Observability.md)

---

## 1. Objetivo

Definir infraestrutura, containerização, orquestração local, pipelines CI/CD, estratégia de deploy, gestão de ambientes e procedimentos operacionais do Portfolio OS.

---

## 2. Princípios DevOps

| Princípio | Implementação |
|-----------|---------------|
| Infrastructure as Code | Docker Compose, Dockerfiles, GitHub Actions |
| Automate everything | Build, test, deploy sem intervenção manual |
| Immutable infrastructure | Containers recriados a cada deploy |
| Environment parity | Mesma configuração local/staging/production |
| Fail fast | CI bloqueia merge em falha |
| Shift left | Testes e lint antes do merge |
| Observability by default | Health checks, logging, metrics em todo serviço |

---

## 3. Ambientes

| Ambiente | Propósito | URL padrão | Deploy |
|----------|-----------|------------|--------|
| local | Desenvolvimento | `localhost` | Manual (`docker compose up`) |
| ci | Testes automatizados | — | GitHub Actions |
| staging | Pré-produção, demos | `staging.portfolio-os.dev` | Auto em merge para `develop` |
| production | Portfólio público | `portfolio-os.dev` | Auto em merge para `main` |

### 3.1 Variáveis por ambiente

Toda variável definida e validada em `packages/config`. Arquivos:

| Arquivo | Ambiente |
|---------|----------|
| `.env` | local (gitignored) |
| `.env.example` | Template commitado |
| `.env.staging` | Referência (secrets no GitHub) |
| `.env.production` | Referência (secrets no GitHub) |

---

## 4. Docker

### 4.1 Estratégia de containerização

Todo serviço e app frontend possui:

- `Dockerfile` multi-stage na raiz do pacote
- `.dockerignore`
- Health check no Dockerfile
- Non-root user em produção

### 4.2 Stages do Dockerfile

| Stage | Base | Propósito |
|-------|------|-----------|
| `deps` | node:20-alpine | Instalar dependências |
| `build` | node:20-alpine | Compilar TypeScript/Next.js |
| `production` | node:20-alpine ou distroless | Runtime mínimo |

### 4.3 Docker Compose

Arquivos em `05-infra/`:

| Arquivo | Uso |
|---------|-----|
| `docker-compose.yml` | Desenvolvimento local completo |
| `docker-compose.test.yml` | Testes de integração |
| `docker-compose.staging.yml` | Override para staging |
| `docker-compose.prod.yml` | Override para produção |

### 4.4 Serviços no Compose (local)

| Serviço | Imagem/Build | Porta interna | Porta exposta |
|---------|-------------|---------------|---------------|
| nginx | nginx:1.25 | 80, 443 | 80, 443 |
| api-gateway | build | 3000 | — |
| auth-service | build | 3001 | — |
| notification-service | build | 3002 | — |
| helpdesk-api | build | 3003 | — |
| analytics-api | build | 3004 | — |
| realtime-chat | build | 3005 | — |
| helpdesk-app | build | 3010 | — |
| analytics-app | build | 3011 | — |
| admin-portal | build | 3012 | — |
| portfolio-website | build | 3013 | — |
| postgres-auth | postgres:16 | 5432 | — |
| postgres-notification | postgres:16 | 5432 | — |
| postgres-helpdesk | postgres:16 | 5432 | — |
| postgres-analytics | postgres:16 | 5432 | — |
| postgres-chat | postgres:16 | 5432 | — |
| redis | redis:7-alpine | 6379 | 6379 |
| pgbouncer | pgbouncer | 6432 | — |

Nginx é o único serviço com portas expostas externamente.

### 4.5 Networks

| Network | Serviços |
|---------|----------|
| `frontend` | nginx, apps Next.js |
| `backend` | api-gateway, serviços NestJS |
| `data` | postgres, redis, pgbouncer |

Backend services não são acessíveis diretamente de fora do Compose.

---

## 5. Nginx

### 5.1 Responsabilidades

- TLS termination (staging/production)
- Reverse proxy para API Gateway e apps frontend
- Rate limiting global (complementar ao Gateway)
- Gzip compression
- Static asset caching
- WebSocket proxy para Realtime Chat
- Security headers

### 5.2 Roteamento

| Path | Destino |
|------|---------|
| `/api/*` | api-gateway:3000 |
| `/ws/*` | realtime-chat:3005 |
| `/admin/*` | admin-portal:3012 |
| `/helpdesk/*` | helpdesk-app:3010 |
| `/analytics/*` | analytics-app:3011 |
| `/*` | portfolio-website:3013 |

### 5.3 Configuração

Arquivos em `05-infra/nginx/`:

- `nginx.conf` — configuração global
- `conf.d/default.conf` — server blocks
- `conf.d/upstream.conf` — upstream definitions
- `snippets/ssl.conf` — TLS config
- `snippets/security-headers.conf` — headers de segurança

---

## 6. CI/CD — GitHub Actions

### 6.1 Workflows

| Workflow | Trigger | Ações |
|----------|---------|-------|
| `ci.yml` | PR para develop/main | Lint, typecheck, test, build |
| `deploy-staging.yml` | Push para develop | Build images, deploy staging |
| `deploy-production.yml` | Push para main | Build images, deploy production |
| `release.yml` | Tag v* | Changelog, GitHub Release |
| `dependency-review.yml` | PR | Audit de dependências |
| `codeql.yml` | Schedule + PR | Análise estática de segurança |

Arquivos em `.github/workflows/`.

### 6.2 Pipeline CI (ci.yml)

```
Trigger: pull_request
│
├─ detect-changes (Turborepo affected packages)
│
├─ lint (ESLint + Prettier check)
│
├─ typecheck (tsc --noEmit)
│
├─ test-unit (Jest/Vitest per affected package)
│
├─ test-integration (Jest + Testcontainers)
│   ├─ service: postgres:16
│   └─ service: redis:7
│
├─ build (Turborepo build affected)
│
├─ coverage-check (threshold validation)
│
└─ docker-build (build images, no push)
```

### 6.3 Pipeline Deploy Staging

```
Trigger: push to develop
│
├─ ci (reutiliza jobs de CI)
│
├─ docker-build-push (GHCR)
│   └─ tags: sha, develop, latest-staging
│
├─ deploy (SSH ou PaaS)
│   ├─ pull images
│   ├─ docker compose up -d
│   └─ health check wait
│
├─ smoke-test (curl health endpoints)
│
└─ notify (status para commit)
```

### 6.4 Pipeline Deploy Production

```
Trigger: push to main
│
├─ ci (full suite)
│
├─ docker-build-push (GHCR)
│   └─ tags: sha, v{version}, latest
│
├─ deploy (rolling update)
│   ├─ pull images
│   ├─ docker compose up -d --no-deps {service}
│   └─ health check wait per service
│
├─ smoke-test
│
├─ e2e-test (Playwright contra production ou canary)
│
└─ notify
```

### 6.5 Container Registry

- GitHub Container Registry (ghcr.io)
- Naming: `ghcr.io/{owner}/portfolio-{service}:{tag}`
- Autenticação via `GITHUB_TOKEN` em CI

---

## 7. Estratégia de deploy

### 7.1 Modelo

**Rolling update** via Docker Compose em VPS.

Cada serviço é atualizado independentemente com `docker compose up -d --no-deps {service}`.

### 7.2 Ordem de deploy

1. Databases (migrations)
2. Redis
3. Auth Service
4. Notification Service
5. HelpDesk API, Analytics API, Realtime Chat (paralelo)
6. API Gateway
7. Frontend apps (paralelo)
8. Nginx (se config mudou)

### 7.3 Migrations

- Executadas como step separado antes do deploy do serviço
- `npx prisma migrate deploy` em container one-shot
- Rollback de migration: migration reversa (nunca editar migration aplicada)
- Backup automático do banco antes de migration em production

### 7.4 Rollback

1. Identificar última versão estável (tag ou sha)
2. `docker compose pull` com tag anterior
3. `docker compose up -d` com tag anterior
4. Reverter migration se necessário (com backup)
5. Smoke test
6. Post-mortem se rollback em production

---

## 8. Secrets management

| Ambiente | Mecanismo |
|----------|-----------|
| local | `.env` file (gitignored) |
| ci | GitHub Secrets |
| staging | GitHub Secrets + `.env` no servidor |
| production | GitHub Secrets + `.env` no servidor |

### 8.1 Secrets obrigatórios

| Secret | Serviços |
|--------|----------|
| `JWT_PRIVATE_KEY` | Auth Service |
| `JWT_PUBLIC_KEY` | Auth Service, Gateway |
| `DATABASE_URL_*` | Cada serviço com banco |
| `REDIS_URL` | Todos os serviços backend |
| `SMTP_*` | Notification Service |
| `SENTRY_DSN_*` | Todos os serviços |
| `DEPLOY_SSH_KEY` | CI deploy |
| `DEPLOY_HOST` | CI deploy |

### 8.2 Rotação

- JWT keys: rotação a cada 90 dias
- Database passwords: rotação a cada 180 dias
- Deploy keys: rotação a cada 365 dias

---

## 9. Backup e disaster recovery

### 9.1 Backup

| Recurso | Frequência | Retenção | Mecanismo |
|---------|------------|----------|-----------|
| PostgreSQL (cada DB) | Diário | 30 dias | pg_dump automatizado |
| Redis | Diário | 7 dias | RDB snapshot |
| Configuração | A cada deploy | 90 dias | Git (infra/) |
| Docker volumes | Semanal | 30 dias | Volume snapshot |

### 9.2 Recovery

| Cenário | RTO | RPO | Procedimento |
|---------|-----|-----|--------------|
| Serviço crash | 5 min | 0 | Auto-restart Docker |
| Database corruption | 1 hora | 24 horas | Restore pg_dump |
| VPS failure | 4 horas | 24 horas | Provisionar novo VPS, restore |
| Full disaster | 8 horas | 24 horas | Restore completo |

Runbooks em [21-Runbooks.md](./21-Runbooks.md).

---

## 10. Monitoramento de infraestrutura

| Métrica | Alerta |
|---------|--------|
| CPU > 80% por 5 min | Warning |
| Memory > 85% por 5 min | Warning |
| Disk > 90% | Critical |
| Container restart > 3 em 10 min | Critical |
| SSL expiry < 14 dias | Warning |

---

## 11. Turborepo — build pipeline

### 11.1 Configuração

```json
{
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**", ".next/**"] },
    "test": { "dependsOn": ["build"] },
    "test:integration": { "dependsOn": ["build"] },
    "lint": {},
    "typecheck": { "dependsOn": ["^build"] },
    "dev": { "cache": false, "persistent": true }
  }
}
```

### 11.2 Cache

- Remote cache via Turborepo (Vercel ou self-hosted)
- Cache invalidado em mudança de dependências

---

## 12. Desenvolvimento local

### 12.1 Setup

1. Clone repositório
2. Instalar Node.js 20 LTS e pnpm 9
3. `pnpm install`
4. Copiar `.env.example` para `.env`
5. `docker compose up -d` (infra: postgres, redis)
6. `pnpm turbo dev` (todos os serviços em dev mode)
7. Acessar `http://localhost`

### 12.2 Comandos principais

| Comando | Ação |
|---------|------|
| `pnpm turbo dev` | Inicia todos os serviços em dev |
| `pnpm turbo build` | Build de todos os pacotes |
| `pnpm turbo test` | Testes unitários |
| `pnpm turbo lint` | Lint |
| `pnpm turbo typecheck` | Type check |
| `docker compose up -d` | Infra local |
| `docker compose down -v` | Destruir infra local |

---

## 13. Futuro (v1.2+)

| Item | Descrição |
|------|-----------|
| Kubernetes | kind/k3s local, Helm charts |
| Terraform | Provisionamento VPS, DNS, SSL |
| ArgoCD | GitOps deploy |
| Preview environments | Um ambiente por PR |

---

## 14. Referências cruzadas

| Tópico | Documento |
|--------|-----------|
| Tech stack | [02-Tech-Stack.md](./02-Tech-Stack.md) |
| Git workflow | [04-Git-Workflow.md](./04-Git-Workflow.md) |
| Testes | [05-Testing-Strategy.md](./05-Testing-Strategy.md) |
| Segurança | [07-Security.md](./07-Security.md) |
| Observabilidade | [08-Observability.md](./08-Observability.md) |
| Runbooks | [21-Runbooks.md](./21-Runbooks.md) |
| Monorepo | [15-Monorepo-Structure.md](./15-Monorepo-Structure.md) |
