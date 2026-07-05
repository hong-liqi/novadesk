# Deploy no CapRover — NovaDesk

Guia passo a passo para publicar o monorepo inteiro no CapRover usando **deploy via Git webhook** (Método 3).

## Visão geral

| Tipo                | Quantidade  | Apps                                                               |
| ------------------- | ----------- | ------------------------------------------------------------------ |
| Infraestrutura      | 2           | `novadesk-postgres`, `novadesk-redis`                              |
| Backends (NestJS)   | 6           | gateway, auth, notification, helpdesk-api, analytics-api, chat-api |
| Frontends (Next.js) | 5           | helpdesk, analytics, admin, website, chat                          |
| **Total**           | **13 apps** |                                                                    |

## Visão geral — dois tipos de deploy

As 13 apps **não** seguem o mesmo processo de build. Existem **dois tipos**:

| Tipo               | Apps                                  | O que acontece no build                                                                                               | Processo que sobe                       | Porta       |
| ------------------ | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ----------- |
| **Infraestrutura** | `novadesk-postgres`, `novadesk-redis` | Imagem Docker mínima em cima de `postgres:16-alpine` / `redis:7-alpine`. **Sem Node, sem pnpm, sem compilar código.** | Daemon do Postgres ou Redis             | 5432 / 6379 |
| **Aplicações**     | gateway, auth, frontends… (11 apps)   | Build do monorepo (`pnpm install` + `turbo build`) via Dockerfile multi-stage                                         | `node dist/main.js` ou `node server.js` | 3000–3014   |

**Banco de dados:** um único PostgreSQL 16 Alpine com 5 databases (`auth_db`, `notification_db`, `helpdesk_db`, `analytics_db`, `chat_db`). O script de init cria os 4 databases extras na **primeira inicialização** do volume vazio.

**Cache/filas:** Redis 7 Alpine com AOF (`--appendonly yes`) para persistência.

---

## Pré-requisitos

1. CapRover instalado com HTTPS (ex.: `captain.broom.magicsoft.site`)
2. Repositório no GitHub: `https://github.com/hong-liqi/portifolio.git`
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

| App                 | Captain Definition Path                |
| ------------------- | -------------------------------------- |
| `novadesk-postgres` | `captain-definition.novadesk-postgres` |
| `novadesk-redis`    | `captain-definition.novadesk-redis`    |

### Backends (não expor publicamente)

| App                      | Captain Definition Path                     |
| ------------------------ | ------------------------------------------- |
| `novadesk-gateway`       | `captain-definition.novadesk-gateway`       |
| `novadesk-auth`          | `captain-definition.novadesk-auth`          |
| `novadesk-notification`  | `captain-definition.novadesk-notification`  |
| `novadesk-helpdesk-api`  | `captain-definition.novadesk-helpdesk-api`  |
| `novadesk-analytics-api` | `captain-definition.novadesk-analytics-api` |
| `novadesk-chat-api`      | `captain-definition.novadesk-chat-api`      |

### Frontends (expor com domínio)

| App                  | Captain Definition Path                 | Porta container |
| -------------------- | --------------------------------------- | --------------- |
| `novadesk-helpdesk`  | `captain-definition.novadesk-helpdesk`  | 3010            |
| `novadesk-analytics` | `captain-definition.novadesk-analytics` | 3011            |
| `novadesk-admin`     | `captain-definition.novadesk-admin`     | 3012            |
| `novadesk-website`   | `captain-definition.novadesk-website`   | 3013            |
| `novadesk-chat`      | `captain-definition.novadesk-chat`      | 3014            |

---

## Como cada app sabe o que buildar e executar?

Todas as 13 apps usam o **mesmo repositório e branch**, mas cada uma aponta para um **Captain Definition Path diferente** no CapRover. Os arquivos ficam na **raiz do repo** (`captain-definition.novadesk-*`) porque o CapRover resolve o `dockerfilePath` relativo à pasta do captain-definition — se o arquivo estiver em subpastas, os caminhos se duplicam e o build quebra.

Exemplo (`captain-definition.novadesk-postgres` na raiz):

```json
{
  "schemaVersion": 2,
  "dockerfilePath": "./infrastructure/caprover/postgres/Dockerfile"
}
```

### Tipo A — Infraestrutura (Postgres e Redis)

**Não há build de aplicação Node.** O Dockerfile só empacota a imagem oficial + configuração mínima.

**Postgres** (`infrastructure/caprover/postgres/`):

```
CapRover app "novadesk-postgres"
  └─ Captain Definition Path: captain-definition.novadesk-postgres
       └─ dockerfilePath → ./infrastructure/caprover/postgres/Dockerfile
            FROM postgres:16-alpine
            COPY init-databases.sh → /docker-entrypoint-initdb.d/
            EXPOSE 5432
       └─ Ao subir (primeira vez, volume vazio):
            Postgres executa init-databases.sh
            → cria notification_db, helpdesk_db, analytics_db, chat_db
       └─ Processo final: postgres (daemon TCP na porta 5432)
```

Arquivos no repositório:

| Arquivo                                              | Função                                           |
| ---------------------------------------------------- | ------------------------------------------------ |
| `captain-definition.novadesk-postgres` (raiz)        | Aponta para o Dockerfile do Postgres             |
| `infrastructure/caprover/postgres/Dockerfile`        | `FROM postgres:16-alpine` + copia script de init |
| `infrastructure/caprover/postgres/init-databases.sh` | Cria os 4 databases além do `auth_db`            |

**Redis** (`infrastructure/caprover/redis/`):

```
CapRover app "novadesk-redis"
  └─ Captain Definition Path: captain-definition.novadesk-redis
       └─ dockerfilePath → ./infrastructure/caprover/redis/Dockerfile
            FROM redis:7-alpine
            CMD ["redis-server", "--appendonly", "yes"]
            EXPOSE 6379
       └─ Processo final: redis-server (daemon TCP na porta 6379)
```

**Diferenças importantes vs apps de aplicação:**

|                         | Postgres / Redis                                           | Apps Node (gateway, auth…)               |
| ----------------------- | ---------------------------------------------------------- | ---------------------------------------- |
| Build                   | ~10 segundos, só `docker build` da imagem base             | Minutos (`pnpm install` + `turbo build`) |
| Env `PORT`              | **Não usa** — portas fixas 5432 / 6379                     | Obrigatório (`3000`, `3001`…)            |
| HTTP Settings / domínio | **Não configurar** — marcar "Não expor como app web"       | Habilitar HTTPS + domínio                |
| Persistência            | **Obrigatório** antes do 1º deploy (Passo 4)               | Não precisa de volume                    |
| Acesso                  | Só apps internas via `srv-captain--novadesk-postgres:5432` | Gateway/frontends expostos publicamente  |

### Tipo B — Aplicações (11 apps Node/Next.js)

```
CapRover app "novadesk-gateway"
  └─ Captain Definition Path: captain-definition.novadesk-gateway
       └─ dockerfilePath → ./services/gateway/Dockerfile
                 ├─ build: --filter @novadesk/gateway
                 ├─ EXPOSE 3000
                 └─ CMD ["node", "dist/main.js"]

CapRover app "novadesk-auth"
  └─ Captain Definition Path: captain-definition.novadesk-auth
       └─ dockerfilePath → ./services/auth-service/Dockerfile
                 ├─ build: --filter @novadesk/auth-service
                 ├─ EXPOSE 3001
                 └─ CMD ["node", "dist/main.js"]
```

| Camada                      | O que define                               | Exemplo (gateway)                             |
| --------------------------- | ------------------------------------------ | --------------------------------------------- |
| **Captain Definition Path** | Qual app buildar (arquivo na raiz do repo) | `captain-definition.novadesk-gateway`         |
| **Dockerfile**              | Dependências, build e binário final        | `pnpm turbo build --filter=@novadesk/gateway` |
| **EXPOSE + CMD**            | Porta e processo que sobe no container     | `EXPOSE 3000` + `node dist/main.js`           |
| **Env `PORT`**              | Porta em que o processo escuta             | `PORT=3000` (Passo 5)                         |
| **HTTP Settings**           | CapRover encaminha tráfego para essa porta | Container HTTP Port = `3000`                  |

> O contexto de build do Docker é a **raiz do monorepo**. Os arquivos `captain-definition.novadesk-*` ficam na raiz para que o `dockerfilePath` aponte corretamente para cada Dockerfile.

**Onde o processo escuta:** backends NestJS leem `PORT` em `main.ts` (`app.listen(port)`). Frontends Next.js usam `PORT` + `HOSTNAME=0.0.0.0`.

---

## Passo 3 — Configurar deploy via Git (webhook)

O repositório, branch e SSH key são os mesmos para todas as apps. O que muda é o **Captain Definition Path** e a **configuração pós-build** (env vars, volumes, domínio).

### 3A — Deploy do Postgres (`novadesk-postgres`) — faça primeiro

> **Antes do build:** configure o diretório persistente (Passo 4). Sem isso, os dados serão perdidos.

1. Crie a app `novadesk-postgres` no CapRover
2. **Configs do App** → marque **Não expor como app web**
3. **Configs do App** → **Diretórios Persistentes** → adicione `/var/lib/postgresql/data` (label: `postgres-data`)
4. **Configs do App** → **Environment Variables**:

   ```env
   POSTGRES_USER=novadesk
   POSTGRES_PASSWORD=<SENHA_FORTE_AQUI>
   POSTGRES_DB=auth_db
   ```

5. Aba **Implantação** → **Método 3**:
   - **Repository:** `https://github.com/hong-liqi/portifolio.git`
   - **Branch:** `main`
   - **Chave SSH:** deploy key do CapRover
   - **Captain Definition Path:** `captain-definition.novadesk-postgres`
6. Clique em **Salvar & Reiniciar** (ou **Forçar build**)

**O que o CapRover faz neste build:**

1. Clona o monorepo
2. Lê `infrastructure/caprover/postgres/captain-definition` → aponta para o Dockerfile em `infrastructure/caprover/postgres/`
3. Executa `docker build` — baixa `postgres:16-alpine`, copia `init-databases.sh` (não compila Node)
4. Sobe o container — Postgres inicia na porta **5432**
5. Na **primeira vez** (volume vazio): roda `init-databases.sh` e cria `notification_db`, `helpdesk_db`, `analytics_db`, `chat_db`

**Validar:** App fica **Running**. Nos logs, procure por `database system is ready to accept connections`.

**Hostname interno** (usado nas `DATABASE_URL` dos backends):

```
srv-captain--novadesk-postgres:5432
```

---

### 3B — Deploy do Redis (`novadesk-redis`) — faça em seguida

> **Antes do build:** configure o diretório persistente (Passo 4).

1. Crie a app `novadesk-redis`
2. **Configs do App** → marque **Não expor como app web**
3. **Configs do App** → **Diretórios Persistentes** → adicione `/data` (label: `redis-data`)
4. Aba **Implantação** → **Método 3**:
   - Mesmo repo, branch e SSH do Postgres
   - **Captain Definition Path:** `captain-definition.novadesk-redis`
5. **Salvar & Reiniciar**

**O que o CapRover faz neste build:**

1. Clona o monorepo
2. Lê `infrastructure/caprover/redis/captain-definition`
3. Executa `docker build` — baixa `redis:7-alpine`, define `CMD redis-server --appendonly yes`
4. Sobe o container — Redis escuta na porta **6379**

**Validar:** App fica **Running**. Logs devem mostrar `Ready to accept connections`.

**Hostname interno:**

```
srv-captain--novadesk-redis:6379
```

---

### 3C — Deploy das 11 aplicações (gateway, auth, frontends…)

Para **cada uma das 11 apps de aplicação**, repita:

1. Abra a app → aba **Implantação** (Deployment)
2. **Método 3: Implantar do Github/Bitbucket/Gitlab**
3. Preencha:
   - **Repository:** `https://github.com/hong-liqi/portifolio.git` (ou HTTPS)
   - **Branch:** `main`
   - **Chave SSH:** mesma deploy key
4. **Captain Definition Path:** caminho da tabela do Passo 2 (ex.: `captain-definition.novadesk-gateway`)
5. **Salvar & Reiniciar**

Depois do build, configure as **env vars** (Passo 5) e, para gateway/frontends, **HTTP Settings** com domínio e HTTPS.

> Apps de aplicação **dependem** do Postgres e Redis já estarem Running antes do primeiro deploy.

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

## Passo 4 — Persistência de dados (CRÍTICO — só Postgres e Redis)

Este passo é **exclusivo das apps de infraestrutura**. Apps Node não precisam de volume persistente.

Sem volume, Postgres e Redis **perdem dados** a cada redeploy.

### `novadesk-postgres`

Configure **antes do primeiro build** (Passo 3A):

| Configuração           | Valor                                                       |
| ---------------------- | ----------------------------------------------------------- |
| Não expor como app web | ✅ marcado                                                  |
| Diretório persistente  | `/var/lib/postgresql/data` → label `postgres-data`          |
| Env vars               | `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB=auth_db` |

### `novadesk-redis`

Configure **antes do primeiro build** (Passo 3B):

| Configuração           | Valor                        |
| ---------------------- | ---------------------------- |
| Não expor como app web | ✅ marcado                   |
| Diretório persistente  | `/data` → label `redis-data` |
| Env vars               | nenhuma obrigatória          |

---

## Passo 5 — Variáveis de ambiente por app

Substitua:

- `<POSTGRES_PASSWORD>` pela senha definida no passo 4
- `<SEU_DOMINIO>` pelo domínio real (ex.: `broom.magicsoft.site`)
- `<JWT_*>` pelas chaves geradas no passo 1
- `<SMTP_*>` pelo seu provedor de e-mail

> **Senha com `+`, `#`, `@` etc.?** Gere a `DATABASE_URL` já codificada:
>
> ```bash
> ./infrastructure/scripts/generate-database-url.sh 'SUA_SENHA' auth_db
> ```
>
> Hostname interno do Postgres: `srv-captain--novadesk-postgres` (dois hífens: `captain--novadesk`).

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
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d
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
- Domínio: `api.<SEU_DOMINIO>` (ou `novadesk-gateway.<SEU_DOMINIO>`)
- **Container HTTP Port: `3000`** ← obrigatório (padrão do CapRover é 80; sem isso → 502)
- **WebSocket Support: ON** (necessário para chat via `/socket.io`)

Teste: `https://api.<SEU_DOMINIO>/api/v1/health/live` → `{ "status": "ok" }`

### Frontends

Todos precisam de:

```env
NODE_ENV=production
NOVADESK_API_URL=https://novadesk-gateway.<SEU_DOMINIO>/api/v1
NEXT_PUBLIC_API_URL=https://novadesk-gateway.<SEU_DOMINIO>/api/v1
```

> `NOVADESK_API_URL` é lida em runtime (Salvar & Reiniciar basta). `NEXT_PUBLIC_API_URL` é fallback no build.

Mais a porta de cada app:

| App                  | PORT | Container HTTP Port | Domínio sugerido          | Variáveis extras                                      |
| -------------------- | ---- | ------------------- | ------------------------- | ----------------------------------------------------- |
| `novadesk-helpdesk`  | 3010 | **3010**            | `helpdesk.<SEU_DOMINIO>`  | `NEXT_PUBLIC_APP_URL=https://helpdesk.<SEU_DOMINIO>`  |
| `novadesk-analytics` | 3011 | **3011**            | `analytics.<SEU_DOMINIO>` | `NEXT_PUBLIC_APP_URL=https://analytics.<SEU_DOMINIO>` |
| `novadesk-admin`     | 3012 | **3012**            | `admin.<SEU_DOMINIO>`     | `NEXT_PUBLIC_APP_URL=https://admin.<SEU_DOMINIO>`     |
| `novadesk-website`   | 3013 | **3013**            | `<SEU_DOMINIO>`           | `NEXT_PUBLIC_SITE_URL`, `NOVADESK_*_URL` (ver abaixo) |
| `novadesk-chat`      | 3014 | **3014**            | `chat.<SEU_DOMINIO>`      | `NEXT_PUBLIC_APP_URL=https://chat.<SEU_DOMINIO>`      |

**HTTP Settings de cada frontend** (em **HTTP Settings** da app, não só env vars):

1. Enable HTTPS + Force HTTPS
2. Domínio (ex.: `novadesk-helpdesk.li.magicsoft.site`)
3. **Container HTTP Port** = mesma porta da coluna acima (`3010`, `3011`…)
4. **Não** marque "Não expor como app web"

> **502 Bad Gateway?** Quase sempre é `Container HTTP Port` errado (80 em vez de 3010/3000…). A env `PORT` sozinha não basta — o Nginx do CapRover precisa saber para qual porta encaminhar.
>
> **Links do website quebrados?** No CapRover cada frontend tem **subdomínio próprio**. Os frontends atuais usam `basePath` vazio — acesse a **raiz** do subdomínio (sem `/helpdesk`).
>
> No **`novadesk-website`**, use `NOVADESK_*_URL` (lidas em runtime; **Salvar & Reiniciar** basta após o deploy deste código):
>
> ```env
> NOVADESK_HELPDESK_URL=https://novadesk-helpdesk.<SEU_DOMINIO>
> NOVADESK_ANALYTICS_URL=https://novadesk-analytics.<SEU_DOMINIO>
> NOVADESK_ADMIN_URL=https://novadesk-admin.<SEU_DOMINIO>
> NOVADESK_CHAT_URL=https://novadesk-chat.<SEU_DOMINIO>
> NEXT_PUBLIC_SITE_URL=https://<SEU_DOMINIO>
> NEXT_PUBLIC_CONTACT_EMAIL=contato@<SEU_DOMINIO>
> ```
>
> **Não** inclua `/helpdesk`, `/admin`, etc. no final das URLs. **Salvar & Reiniciar** não rebuilfa — após mudar código, use **Forçar build** uma vez.

---

## Passo 6 — Ordem de deploy

```
Fase 1 — Infraestrutura (build rápido, sem Node):
  1. novadesk-postgres   ← Passo 3A (volume + env ANTES do build)
  2. novadesk-redis      ← Passo 3B (volume ANTES do build)

Fase 2 — Backends (build lento, monorepo):
  3. novadesk-auth
  4. novadesk-notification
  5. novadesk-helpdesk-api
  6. novadesk-analytics-api
  7. novadesk-chat-api
  8. novadesk-gateway

Fase 3 — Frontends:
  9. novadesk-website
  10. novadesk-helpdesk
  11. novadesk-analytics
  12. novadesk-admin
  13. novadesk-chat
```

Aguarde cada app ficar **Running** antes da próxima que depende dela. Postgres e Redis devem estar prontos antes de qualquer backend.

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

| Problema                      | Solução                                                                                                                                                                                      |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build falha no monorepo       | Verifique se o **Captain Definition Path** está correto. O contexto de build é a raiz do repo.                                                                                               |
| 502 Bad Gateway               | Em **HTTP Settings**, defina **Container HTTP Port** = `PORT` da app (`3000` gateway, `3010`–`3014` frontends). Confira env `PORT` e logs. Gateway: teste `/api/v1/health/live`, não `/`.    |
| Postgres perdeu dados         | Confirme diretório persistente `/var/lib/postgresql/data` **antes** do primeiro deploy.                                                                                                      |
| `database "X" does not exist` | Recrie o Postgres (só se vazio) ou crie o DB manualmente via `psql`. O init script roda só na primeira inicialização.                                                                        |
| JWT inválido                  | `JWT_ISSUER`, `JWT_AUDIENCE` e chaves devem ser iguais em auth e gateway.                                                                                                                    |
| WebSocket do chat cai         | Habilite **WebSocket Support** no gateway.                                                                                                                                                   |
| Links do site → 404           | URLs devem apontar para a **raiz** do subdomínio (`https://novadesk-helpdesk.<domínio>`, sem `/helpdesk`). Configure `NOVADESK_*_URL` no website e **Forçar build** após atualizar o código. |
| Frontend no subdomínio → 404  | Com `basePath` vazio, use a raiz do subdomínio. `/helpdesk` no subdomínio só funciona em builds antigos.                                                                                     |
| E-mail não envia              | Configure SMTP real no `novadesk-notification`.                                                                                                                                              |

---

## Atualizações futuras

Push no branch `main` → webhook dispara rebuild. Para deploy seletivo, use **Forçar build** só nas apps alteradas.

---

## Referências no repositório

- `infrastructure/caprover/postgres/` — PostgreSQL 16 Alpine + init dos 5 databases
- `infrastructure/caprover/redis/` — Redis 7 Alpine com persistência AOF
- `infrastructure/caprover/README.md` — documentação técnica complementar
- `infrastructure/docker/docker-compose.yml` — paridade com ambiente local
