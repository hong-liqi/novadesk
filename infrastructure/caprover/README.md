# Deploy no CapRover — NovaDesk

Deploy de cada componente como **app separada** no CapRover, com build via **Git webhook** e `captain-definition`.

## Guia completo

Siga o passo a passo em **[DEPLOY-CAPROVER.md](../../DEPLOY-CAPROVER.md)** na raiz do projeto.

## Pré-requisitos

- CapRover instalado com HTTPS (Let's Encrypt)
- Repositório Git acessível pelo CapRover (GitHub/GitLab + deploy key ou token)
- Apps de infraestrutura no CapRover (definidas em `infrastructure/caprover/`):
  - **PostgreSQL** (`novadesk-postgres`) — instância única com 5 databases
  - **Redis** (`novadesk-redis`) — sessões, refresh tokens, rate limit
  - **SMTP** — e-mails transacionais (produção: SendGrid, SES, etc.)

## Mapa de apps CapRover

| App CapRover             | Captain Definition Path                               | Porta | Domínio sugerido           |
| ------------------------ | ----------------------------------------------------- | ----- | -------------------------- |
| `novadesk-postgres`      | `infrastructure/caprover/postgres/captain-definition` | 5432  | _(interno, persistente)_   |
| `novadesk-redis`         | `infrastructure/caprover/redis/captain-definition`    | 6379  | _(interno, persistente)_   |
| `novadesk-gateway`       | `services/gateway/captain-definition`                 | 3000  | `api.seudominio.com`       |
| `novadesk-auth`          | `services/auth-service/captain-definition`            | 3001  | _(interno)_                |
| `novadesk-notification`  | `services/notification-service/captain-definition`    | 3002  | _(interno)_                |
| `novadesk-helpdesk-api`  | `services/helpdesk-api/captain-definition`            | 3003  | _(interno)_                |
| `novadesk-analytics-api` | `services/analytics-api/captain-definition`           | 3004  | _(interno)_                |
| `novadesk-chat-api`      | `services/realtime-chat/captain-definition`           | 3005  | _(interno)_                |
| `novadesk-helpdesk`      | `apps/helpdesk-saas/captain-definition`               | 3010  | `helpdesk.seudominio.com`  |
| `novadesk-analytics`     | `apps/analytics-dashboard/captain-definition`         | 3011  | `analytics.seudominio.com` |
| `novadesk-admin`         | `apps/admin-panel/captain-definition`                 | 3012  | `admin.seudominio.com`     |
| `novadesk-chat`          | `apps/realtime-chat/captain-definition`               | 3014  | `chat.seudominio.com`      |
| `novadesk-website`       | `website/captain-definition`                          | 3013  | `seudominio.com`           |

> Hostnames internos CapRover: `http://srv-captain--novadesk-auth:3001` (substitua pelo nome exato da app).

## Configurar deploy via Git (webhook)

Para **cada app**:

1. CapRover → **Apps** → Create New App
2. **Deployment** → **Method 3: Deploy from GitHub/Bitbucket/GitLab**
3. Preencha:
   - **Repository URL** — URL do monorepo
   - **Branch** — `main` (ou `develop`)
   - **Username / Password** ou SSH key
   - **Captain Definition Path** — caminho da tabela acima (ex.: `services/gateway/captain-definition`)
4. **Save & Update** — CapRover clona o repo e builda o Dockerfile referenciado
5. Configure **Environment Variables** (aba abaixo)
6. Ative **Webhook** (opcional) — copie a URL e adicione no GitHub → Settings → Webhooks → push events

Push no branch configurado dispara rebuild automático.

## Variáveis de ambiente

### Gateway (`novadesk-gateway`)

```env
NODE_ENV=production
PORT=3000
REDIS_URL=redis://srv-captain--novadesk-redis:6379
AUTH_SERVICE_URL=http://srv-captain--novadesk-auth:3001
NOTIFICATION_SERVICE_URL=http://srv-captain--novadesk-notification:3002
HELPDESK_SERVICE_URL=http://srv-captain--novadesk-helpdesk-api:3003
ANALYTICS_SERVICE_URL=http://srv-captain--novadesk-analytics-api:3004
REALTIME_CHAT_SERVICE_URL=http://srv-captain--novadesk-chat-api:3005
AUTH_JWKS_URL=http://srv-captain--novadesk-auth:3001/.well-known/jwks.json
JWT_ISSUER=novadesk-auth
JWT_AUDIENCE=novadesk
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
```

**HTTP Settings:** Enable HTTPS, Force HTTPS. WebSocket support ON (para `/socket.io`).

### Auth Service (`novadesk-auth`)

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@srv-captain--novadesk-postgres:5432/auth_db
REDIS_URL=redis://srv-captain--novadesk-redis:6379
JWT_PRIVATE_KEY=<RSA PEM>
JWT_PUBLIC_KEY=<RSA PEM>
JWT_KID=prod-1
JWT_ISSUER=novadesk-auth
JWT_AUDIENCE=novadesk
```

### Notification Service

```env
DATABASE_URL=postgresql://.../notification_db
REDIS_URL=redis://...
SMTP_HOST=<smtp host>
SMTP_PORT=587
SMTP_FROM=noreply@seudominio.com
```

### HelpDesk API / Analytics API / Chat API

Cada um com `DATABASE_URL` do banco correspondente e `REDIS_URL` compartilhado.

### Frontends (Next.js)

```env
NODE_ENV=production
PORT=3010
NEXT_PUBLIC_API_URL=https://api.seudominio.com/api/v1
```

Ajuste `PORT` por app (3010–3014). Website:

```env
NEXT_PUBLIC_API_URL=https://api.seudominio.com/api/v1
NEXT_PUBLIC_CONTACT_EMAIL=contato@seudominio.com
NEXT_PUBLIC_SITE_URL=https://seudominio.com
```

## Roteamento público

Opções:

1. **Subdomínios** — cada frontend com domínio próprio (recomendado)
2. **Reverse proxy único** — nginx app no CapRover roteando `/helpdesk`, `/analytics`, etc. (espelha `infrastructure/nginx/`)

Gateway expõe `/api/v1/*` e `/socket.io/*`. Frontends usam `NEXT_PUBLIC_API_URL` apontando para o gateway.

## Migrations

Após primeiro deploy dos backends com Postgres:

```bash
# local ou one-off container
./infrastructure/scripts/migrate-all.sh
```

Ou rode `pnpm db:push` por serviço contra as URLs de produção.

## WebSocket / Chat

- Gateway faz proxy de `/socket.io` para `realtime-chat`
- CapRover: habilite **WebSocket Support** no app gateway
- Se múltiplas réplicas do chat, use sticky sessions ou Redis adapter (Socket.IO)

## Ordem de deploy sugerida

1. Postgres + Redis
2. auth-service → notification-service
3. helpdesk-api, analytics-api, chat-api
4. gateway (validar `/api/v1/health`)
5. Frontends + website
6. Migrations + seed (helpdesk demo data)

## Troubleshooting

| Problema                | Solução                                                                 |
| ----------------------- | ----------------------------------------------------------------------- |
| Build falha no monorepo | Verifique se o Dockerfile copia `packages/` e `pnpm-workspace.yaml`     |
| 502 no gateway          | Confirme URLs internas `srv-captain--*` e portas                        |
| JWT inválido            | `JWT_ISSUER`/`JWT_AUDIENCE` iguais em auth e gateway                    |
| Contact form 404        | Configure `NOTIFICATION_SERVICE_URL` no website (rede interna CapRover) |
| Contact form 401        | Rota `/api/v1/notifications/send` deve ser pública no gateway           |
| WebSocket cai           | WebSocket Support ON; uma réplica ou sticky session                     |

## Referências

- [CapRover — Deploy from Git](https://caprover.com/docs/deployment-methods.html)
- `infrastructure/docker/docker-compose.yml` — paridade local
- `docs/06-DevOps.md` — pipeline CI (lint/test/build)
