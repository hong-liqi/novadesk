# Deploy no CapRover — NovaDesk

Guia passo a passo para publicar o monorepo inteiro no CapRover usando **deploy via Git webhook** (Método 3).

## Visão geral

| Tipo                | Quantidade  | Apps                                                               |
| ------------------- | ----------- | ------------------------------------------------------------------ |
| Infraestrutura      | 2           | `novadesk-postgres`, `novadesk-redis`                              |
| Backends (NestJS)   | 6           | gateway, auth, notification, helpdesk-api, analytics-api, chat-api |
| Frontends (Next.js) | 5           | helpdesk, analytics, admin, website, chat                          |
| **Total**           | **13 apps** |                                                                    |

**Banco de dados:** um único PostgreSQL 16 Alpine com 5 databases (`auth_db`, `notification_db`, `helpdesk_db`, `analytics_db`, `chat_db`). Dados persistem em volume do CapRover.

**Cache/filas:** Redis 7 Alpine com AOF (append-only) para persistência.

---

## Pré-requisitos

1. CapRover instalado com HTTPS (ex.: `captain.broom.magicsoft.site`)
2. Repositório no GitHub: `git@github.com:hong-liqi/novadesk.git`
3. DNS configurado para os subdomínios que você vai usar (ou use `*.seu-dominio.com` wildcard)
4. SMTP para e-mails em produção (SendGrid, SES, Mailgun, etc.)

---

## Passo 1 — Gerar chaves JWT (auth-service)

No seu computador, na raiz do projeto:

```bash
./infrastructure/scripts/generate-jwt-keys.sh /tmp/novadesk-jwt
```

Guarde `jwt-private.pem` e `jwt-public.pem`. Você vai colar o conteúdo nas variáveis `JWT_PRIVATE_KEY` e `JWT_PUBLIC_KEY` do app `novadesk-auth`.

> **Importante:** use o formato de uma linha com `\n` entre as linhas do PEM (o script já imprime nesse formato).

---

## Passo 2 — Criar as 13 apps no CapRover

Em **Apps → Create New App**, crie cada app abaixo. Use exatamente estes nomes (o hostname interno do CapRover depende deles).

### Infraestrutura (não expor publicamente)

| App                 | Captain Definition Path                               |
| ------------------- | ----------------------------------------------------- |
| `novadesk-postgres` | `infrastructure/caprover/postgres/captain-definition` |
| `novadesk-redis`    | `infrastructure/caprover/redis/captain-definition`    |

### Backends (não expor publicamente)

| App                      | Captain Definition Path                            |
| ------------------------ | -------------------------------------------------- |
| `novadesk-gateway`       | `services/gateway/captain-definition`              |
| `novadesk-auth`          | `services/auth-service/captain-definition`         |
| `novadesk-notification`  | `services/notification-service/captain-definition` |
| `novadesk-helpdesk-api`  | `services/helpdesk-api/captain-definition`         |
| `novadesk-analytics-api` | `services/analytics-api/captain-definition`        |
| `novadesk-chat-api`      | `services/realtime-chat/captain-definition`        |

### Frontends (expor com domínio)

| App                  | Captain Definition Path                       | Porta container |
| -------------------- | --------------------------------------------- | --------------- |
| `novadesk-helpdesk`  | `apps/helpdesk-saas/captain-definition`       | 3010            |
| `novadesk-analytics` | `apps/analytics-dashboard/captain-definition` | 3011            |
| `novadesk-admin`     | `apps/admin-panel/captain-definition`         | 3012            |
| `novadesk-website`   | `website/captain-definition`                  | 3013            |
| `novadesk-chat`      | `apps/realtime-chat/captain-definition`       | 3014            |

---

## Passo 3 — Configurar deploy via Git (webhook)

Para **cada uma das 13 apps**, repita:

1. Abra a app → aba **Implantação** (Deployment)
2. Role até **Método 3: Implantar do Github/Bitbucket/Gitlab**
3. Preencha:
   - **Repository:** `git@github.com:hong-liqi/novadesk.git` (ou HTTPS)
   - **Branch:** `main`
   - **Chave SSH:** cole a deploy key do CapRover (ou usuário/senha)
4. Em **Captain Definition Path** (no final da página), informe o caminho da tabela acima
5. Clique em **Salvar & Reiniciar** (ou **Forçar build** na primeira vez)

### Deploy key no GitHub

1. CapRover → **Configurações** → copie a chave SSH pública do servidor
2. GitHub → repositório → **Settings → Deploy keys → Add deploy key**
3. Cole a chave pública, marque **Allow write access** apenas se precisar

### Webhook automático (opcional, recomendado)

Após salvar o deploy Git em cada app, copie a **Webhook URL** e adicione no GitHub:

- **Settings → Webhooks → Add webhook**
- Payload URL: a URL do CapRover
- Content type: `application/json`
- Events: **Just the push event**

> Um webhook por app, ou use um único push no `main` e faça **Forçar build** manualmente nas apps que mudaram.

---

## Passo 4 — Persistência de dados (CRÍTICO)

Sem isso, Postgres e Redis **perdem dados** a cada redeploy.

### `novadesk-postgres`

1. App → **Configs do App** (App Configs)
2. Marque **Não expor como app web** (Do not expose as web-app)
3. Em **Diretórios Persistentes** (Persistent Directories), adicione:

   | Path no container          | Label           |
   | -------------------------- | --------------- |
   | `/var/lib/postgresql/data` | `postgres-data` |

4. **Environment Variables:**

   ```env
   POSTGRES_USER=novadesk
   POSTGRES_PASSWORD=<SENHA_FORTE_AQUI>
   POSTGRES_DB=auth_db
   ```

5. **Port Mapping:** container `5432` (não precisa mapear para host se só apps internas usam)

### `novadesk-redis`

1. Marque **Não expor como app web**
2. Diretório persistente:

   | Path no container | Label        |
   | ----------------- | ------------ |
   | `/data`           | `redis-data` |

3. Nenhuma variável obrigatória (AOF já está no Dockerfile)

---

## Passo 5 — Variáveis de ambiente por app

Substitua:

- `<POSTGRES_PASSWORD>` pela senha definida no passo 4
- `<SEU_DOMINIO>` pelo domínio real (ex.: `broom.magicsoft.site`)
- `<JWT_*>` pelas chaves geradas no passo 1
- `<SMTP_*>` pelo seu provedor de e-mail

### `novadesk-auth`

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://novadesk:<POSTGRES_PASSWORD>@srv-captain--novadesk-postgres:5432/auth_db
REDIS_URL=redis://srv-captain--novadesk-redis:6379
JWT_PRIVATE_KEY=<JWT_PRIVATE_KEY>
JWT_PUBLIC_KEY=<JWT_PUBLIC_KEY>
JWT_KID=prod-1
JWT_ISSUER=novadesk-auth
JWT_AUDIENCE=novadesk
ACCESS_TOKEN_TTL=900
REFRESH_TOKEN_TTL=604800
```

### `novadesk-notification`

```env
NODE_ENV=production
PORT=3002
DATABASE_URL=postgresql://novadesk:<POSTGRES_PASSWORD>@srv-captain--novadesk-postgres:5432/notification_db
REDIS_URL=redis://srv-captain--novadesk-redis:6379
SMTP_HOST=<SMTP_HOST>
SMTP_PORT=587
SMTP_FROM=noreply@<SEU_DOMINIO>
```

### `novadesk-helpdesk-api`

```env
NODE_ENV=production
PORT=3003
DATABASE_URL=postgresql://novadesk:<POSTGRES_PASSWORD>@srv-captain--novadesk-postgres:5432/helpdesk_db
REDIS_URL=redis://srv-captain--novadesk-redis:6379
```

### `novadesk-analytics-api`

```env
NODE_ENV=production
PORT=3004
DATABASE_URL=postgresql://novadesk:<POSTGRES_PASSWORD>@srv-captain--novadesk-postgres:5432/analytics_db
REDIS_URL=redis://srv-captain--novadesk-redis:6379
```

### `novadesk-chat-api`

```env
NODE_ENV=production
PORT=3005
DATABASE_URL=postgresql://novadesk:<POSTGRES_PASSWORD>@srv-captain--novadesk-postgres:5432/chat_db
REDIS_URL=redis://srv-captain--novadesk-redis:6379
JWT_ISSUER=novadesk-auth
JWT_AUDIENCE=novadesk
AUTH_JWKS_URL=http://srv-captain--novadesk-auth:3001/.well-known/jwks.json
```

### `novadesk-gateway`

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

**HTTP Settings do gateway:**

- Enable HTTPS + Force HTTPS
- Domínio: `api.<SEU_DOMINIO>`
- **WebSocket Support: ON** (necessário para chat via `/socket.io`)

### Frontends

Todos precisam de:

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.<SEU_DOMINIO>/api/v1
```

Mais a porta de cada app:

| App                  | PORT | Domínio sugerido          | Variáveis extras                                                                                |
| -------------------- | ---- | ------------------------- | ----------------------------------------------------------------------------------------------- |
| `novadesk-helpdesk`  | 3010 | `helpdesk.<SEU_DOMINIO>`  | `NEXT_PUBLIC_APP_URL=https://helpdesk.<SEU_DOMINIO>`                                            |
| `novadesk-analytics` | 3011 | `analytics.<SEU_DOMINIO>` | `NEXT_PUBLIC_APP_URL=https://analytics.<SEU_DOMINIO>`                                           |
| `novadesk-admin`     | 3012 | `admin.<SEU_DOMINIO>`     | `NEXT_PUBLIC_APP_URL=https://admin.<SEU_DOMINIO>`                                               |
| `novadesk-website`   | 3013 | `<SEU_DOMINIO>`           | `NEXT_PUBLIC_SITE_URL=https://<SEU_DOMINIO>`, `NEXT_PUBLIC_CONTACT_EMAIL=contato@<SEU_DOMINIO>` |
| `novadesk-chat`      | 3014 | `chat.<SEU_DOMINIO>`      | `NEXT_PUBLIC_APP_URL=https://chat.<SEU_DOMINIO>`                                                |

---

## Passo 6 — Ordem de deploy

Faça o primeiro build nesta ordem (infra → backends → gateway → frontends):

```
1. novadesk-postgres
2. novadesk-redis
3. novadesk-auth
4. novadesk-notification
5. novadesk-helpdesk-api
6. novadesk-analytics-api
7. novadesk-chat-api
8. novadesk-gateway
9. novadesk-website
10. novadesk-helpdesk
11. novadesk-analytics
12. novadesk-admin
13. novadesk-chat
```

Aguarde cada app ficar **Running** antes da próxima que depende dela.

---

## Passo 7 — Migrations do banco

Após os backends estarem no ar, aplique os schemas Prisma.

### Opção A — Da sua máquina (mais simples)

Exponha temporariamente a porta 5432 do Postgres (Port Mapping no CapRover) ou use túnel SSH, depois:

```bash
# Ajuste as URLs para apontar ao Postgres de produção
export DATABASE_URL="postgresql://novadesk:<POSTGRES_PASSWORD>@<IP_SERVIDOR>:5432/auth_db"
cd services/auth-service && pnpm db:push

export DATABASE_URL="postgresql://novadesk:<POSTGRES_PASSWORD>@<IP_SERVIDOR>:5432/notification_db"
cd services/notification-service && pnpm db:push

export DATABASE_URL="postgresql://novadesk:<POSTGRES_PASSWORD>@<IP_SERVIDOR>:5432/helpdesk_db"
cd services/helpdesk-api && pnpm db:push

export DATABASE_URL="postgresql://novadesk:<POSTGRES_PASSWORD>@<IP_SERVIDOR>:5432/analytics_db"
cd services/analytics-api && pnpm db:push

export DATABASE_URL="postgresql://novadesk:<POSTGRES_PASSWORD>@<IP_SERVIDOR>:5432/chat_db"
cd services/realtime-chat && pnpm db:push
```

### Opção B — Script local (se tiver acesso de rede ao Postgres)

Edite temporariamente as `DATABASE_URL` no `.env` de cada serviço e rode:

```bash
./infrastructure/scripts/migrate-all.sh
```

### Seed do HelpDesk (opcional)

```bash
cd services/helpdesk-api
DATABASE_URL="postgresql://novadesk:<POSTGRES_PASSWORD>@<IP>:5432/helpdesk_db" pnpm db:seed
```

---

## Passo 8 — Validar

| URL                                       | Esperado             |
| ----------------------------------------- | -------------------- |
| `https://api.<SEU_DOMINIO>/api/v1/health` | `{ "status": "ok" }` |
| `https://<SEU_DOMINIO>`                   | Website              |
| `https://helpdesk.<SEU_DOMINIO>`          | App HelpDesk         |
| `https://admin.<SEU_DOMINIO>`             | Painel admin         |

Teste login, criação de ticket e chat em tempo real.

---

## Apps internas vs públicas

| App                                                       | Expor na web?     |
| --------------------------------------------------------- | ----------------- |
| postgres, redis                                           | **Não**           |
| auth, notification, helpdesk-api, analytics-api, chat-api | **Não**           |
| gateway                                                   | **Sim** (`api.*`) |
| website + 4 frontends                                     | **Sim**           |

Apps internas se comunicam pelo hostname `srv-captain--<nome-da-app>:<porta>`.

---

## Troubleshooting

| Problema                      | Solução                                                                                                               |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Build falha no monorepo       | Verifique se o **Captain Definition Path** está correto. O contexto de build é a raiz do repo.                        |
| 502 Bad Gateway               | Confira `PORT` nas env vars e se a app está Running. Veja logs no CapRover.                                           |
| Postgres perdeu dados         | Confirme diretório persistente `/var/lib/postgresql/data` **antes** do primeiro deploy.                               |
| `database "X" does not exist` | Recrie o Postgres (só se vazio) ou crie o DB manualmente via `psql`. O init script roda só na primeira inicialização. |
| JWT inválido                  | `JWT_ISSUER`, `JWT_AUDIENCE` e chaves devem ser iguais em auth e gateway.                                             |
| WebSocket do chat cai         | Habilite **WebSocket Support** no gateway.                                                                            |
| E-mail não envia              | Configure SMTP real no `novadesk-notification`.                                                                       |

---

## Atualizações futuras

Push no branch `main` → webhook dispara rebuild. Para deploy seletivo, use **Forçar build** só nas apps alteradas.

---

## Referências no repositório

- `infrastructure/caprover/postgres/` — PostgreSQL 16 Alpine + init dos 5 databases
- `infrastructure/caprover/redis/` — Redis 7 Alpine com persistência AOF
- `infrastructure/caprover/README.md` — documentação técnica complementar
- `infrastructure/docker/docker-compose.yml` — paridade com ambiente local
