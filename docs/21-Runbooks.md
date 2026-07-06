# 21 — Runbooks Operacionais

**Versão:** 1.0  
**Status:** Aprovado  
**Última atualização:** 2026-07-03  
**Relacionado:** [06-DevOps.md](./06-DevOps.md), [08-Observability.md](./08-Observability.md), [07-Security.md](./07-Security.md)

---

## 1. Objetivo

Procedimentos operacionais para diagnóstico, resolução e prevenção de incidentes no NovaDesk.

---

## 2. Runbook: Serviço indisponível

### 2.1 Sintomas

- Health check retorna unhealthy
- Alerta ServiceDown disparado
- 502/503 no Gateway

### 2.2 Diagnóstico

1. Verificar status do container: `docker compose ps {service}`
2. Verificar logs: `docker compose logs --tail=100 {service}`
3. Verificar health endpoint: `curl http://localhost:{port}/health/ready`
4. Verificar dependências (PostgreSQL, Redis): health dos containers de data
5. Verificar métricas no Grafana: error rate, memory, CPU

### 2.3 Resolução

| Causa                      | Ação                                                  |
| -------------------------- | ----------------------------------------------------- |
| Container crash            | `docker compose restart {service}`                    |
| OOM (Out of Memory)        | Aumentar memory limit; investigar memory leak         |
| Database connection failed | Verificar PostgreSQL; verificar connection string     |
| Redis connection failed    | Verificar Redis; `docker compose restart redis`       |
| Migration pendente         | Executar `migrate-all.sh`                             |
| Bug em deploy recente      | Rollback para versão anterior (ver Runbook: Rollback) |

### 2.4 Escalação

Se não resolvido em 30 minutos: documentar em issue, notificar stakeholders.

---

## 3. Runbook: Rollback de deploy

### 3.1 Quando usar

- Erro 5xx spike após deploy
- Funcionalidade crítica quebrada
- Migration com problema

### 3.2 Procedimento

1. Identificar última versão estável: `git tag -l 'v*' --sort=-v:refname | head -5`
2. Identificar tag/sha da versão estável
3. No servidor: `export IMAGE_TAG={stable_tag}`
4. Pull images: `docker compose -f docker-compose.prod.yml pull`
5. Se migration problemática: restaurar backup (ver Runbook: Restore DB)
6. Deploy: `docker compose -f docker-compose.prod.yml up -d`
7. Smoke test: `./05-infra/scripts/health-check.sh`
8. Verificar Grafana: error rate normalizado
9. Documentar incidente

### 3.3 Tempo estimado

15–30 minutos.

---

## 4. Runbook: Backup de banco de dados

### 4.1 Backup manual

Executar o script `05-infra/scripts/backup-db.sh` no servidor de staging ou production.

### 4.2 O que o script faz

1. Para cada database (auth_db, notification_db, helpdesk_db, analytics_db, chat_db):
   - Executa `pg_dump` com compressão gzip
   - Salva em `/backups/{db_name}/{timestamp}.sql.gz`
2. Remove backups com mais de 30 dias
3. Loga resultado

### 4.3 Verificação

Listar arquivos em `/backups/*/` e inspecionar o cabeçalho do dump mais recente para validar integridade.

### 4.4 Frequência

- Automático: diário às 02:00 UTC (cron)
- Manual: antes de migrations em production

---

## 5. Runbook: Restore de banco de dados

### 5.1 Quando usar

- Corrupção de dados
- Migration com problema
- Disaster recovery

### 5.2 Procedimento

1. **Parar serviço** que usa o banco: `docker compose stop {service}`
2. **Identificar backup**: `ls -la /backups/{db_name}/`
3. **Restore:** executar `05-infra/scripts/restore-db.sh` passando o nome do banco e o arquivo de backup como argumentos.
4. **Verificar dados**: conectar via psql e validar tabelas
5. **Restart serviço**: `docker compose start {service}`
6. **Smoke test**: health check + operação básica
7. Documentar restore

### 5.3 RPO

24 horas (backup diário). Para RPO menor, implementar WAL archiving (futuro).

---

## 6. Runbook: Rotação de JWT keys

### 6.1 Frequência

A cada 90 dias ou imediatamente se comprometidas.

### 6.2 Procedimento

1. Gerar novo par RSA 2048
2. Adicionar nova chave ao JWKS com novo `kid`
3. Deploy Auth Service com nova private key
4. Manter chave antiga no JWKS por 24h (para tokens em circulação)
5. Após 24h, remover chave antiga do JWKS
6. Invalidar todos refresh tokens (forçar re-login)
7. Verificar login flow funciona
8. Documentar rotação

---

## 7. Runbook: High error rate

### 7.1 Sintomas

- Alerta HighErrorRate (> 5% 5xx por 5 min)
- Sentry spike

### 7.2 Diagnóstico

1. Identificar serviço afetado via Grafana
2. Verificar logs recentes: `docker compose logs --tail=200 {service} | grep ERROR`
3. Verificar Sentry para stack traces
4. Verificar se correlaciona com deploy recente
5. Verificar dependências (DB, Redis, downstream services)

### 7.3 Resolução

| Causa                          | Ação                                                 |
| ------------------------------ | ---------------------------------------------------- |
| Deploy recente                 | Rollback                                             |
| Database issue                 | Verificar connections, slow queries                  |
| Downstream service down        | Circuit breaker deve estar ativo; restart downstream |
| Rate limiting misconfiguration | Ajustar limites                                      |
| Bug específico                 | Hotfix branch → deploy                               |

---

## 8. Runbook: Disco cheio

### 8.1 Sintomas

- Alerta DiskSpaceLow (> 90%)
- Docker build failures
- Log write errors

### 8.2 Procedimento

1. Verificar uso: `df -h`
2. Limpar Docker: `docker system prune -a --volumes` (cuidado em production)
3. Limpar logs antigos: `truncate -s 0 /var/lib/docker/containers/*/*-json.log`
4. Limpar backups antigos: `find /backups -mtime +30 -delete`
5. Se insuficiente: expandir volume ou provisionar disco maior
6. Verificar alerta resolvido

---

## 9. Runbook: SSL certificate renewal

### 9.1 Frequência

Let's Encrypt renova automaticamente. Alerta 14 dias antes de expirar.

### 9.2 Procedimento manual

Executar renovação via Certbot com plugin Nginx, validar configuração do Nginx e recarregar o serviço.

### 9.3 Verificação

Verificar datas de validade do certificado SSL via OpenSSL client contra `novadesk.dev:443`.

---

## 10. Runbook: Onboarding de desenvolvedor

### 10.1 Setup local

1. Clone: `git clone {repo} && cd novadesk`
2. Node.js 20: `nvm use` (via .nvmrc)
3. pnpm: `corepack enable && corepack prepare pnpm@9 --activate`
4. Install: `pnpm install`
5. Env: `cp .env.example .env`
6. Infra: `docker compose up -d`
7. Migrations: `./05-infra/scripts/migrate-all.sh`
8. Seed: `pnpm turbo seed` (quando disponível)
9. Dev: `pnpm turbo dev`
10. Acessar: `http://localhost`

### 10.2 Leitura recomendada

1. [docs/README.md](./README.md) — ordem de leitura
2. [11-Definition-of-Done.md](./11-Definition-of-Done.md)
3. [03-Coding-Standards.md](./03-Coding-Standards.md)
4. [01-Architecture.md](./01-Architecture.md)

---

## 11. Contatos e escalação

| Severidade    | Tempo de resposta | Ação                   |
| ------------- | ----------------- | ---------------------- |
| P0 — Critical | 1 hora            | Resolver imediatamente |
| P1 — High     | 4 horas           | Resolver no mesmo dia  |
| P2 — Medium   | 24 horas          | Planejar correção      |
| P3 — Low      | 1 semana          | Backlog                |

---

## 12. Referências cruzadas

| Tópico          | Documento                                            |
| --------------- | ---------------------------------------------------- |
| DevOps          | [06-DevOps.md](./06-DevOps.md)                       |
| Observabilidade | [08-Observability.md](./08-Observability.md)         |
| Segurança       | [07-Security.md](./07-Security.md)                   |
| Backup          | [17-Data-Architecture.md](./17-Data-Architecture.md) |
