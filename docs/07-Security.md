# 07 — Segurança

**Versão:** 1.0  
**Status:** Aprovado  
**Última atualização:** 2026-07-03  
**Relacionado:** [01-Architecture.md](./01-Architecture.md), [06-DevOps.md](./06-DevOps.md), [18-API-Design-Standards.md](./18-API-Design-Standards.md)

---

## 1. Objetivo

Definir a estratégia de segurança do NovaDesk: autenticação, autorização, proteção de dados, comunicação segura, gestão de secrets, threat model e práticas de secure development.

---

## 2. Princípios de segurança

| Princípio                   | Implementação                                      |
| --------------------------- | -------------------------------------------------- |
| Defense in depth            | Múltiplas camadas: Nginx, Gateway, serviços, banco |
| Least privilege             | Roles mínimos, scopes granulares                   |
| Fail secure                 | Erro de auth → deny, nunca allow                   |
| Zero trust (inter-serviços) | Validação de token mesmo em rede interna           |
| Secure by default           | HTTPS, headers, CORS restritivo em production      |
| No secrets in code          | Variáveis de ambiente + GitHub Secrets             |
| Input validation everywhere | Toda entrada validada na fronteira                 |

---

## 3. Threat model

### 3.1 Ativos

| Ativo                          | Criticidade |
| ------------------------------ | ----------- |
| Credenciais de usuário         | Crítica     |
| Tokens JWT (private key)       | Crítica     |
| Dados de tickets (HelpDesk)    | Alta        |
| Dados de analytics             | Média       |
| Mensagens de chat              | Alta        |
| Configuração de infraestrutura | Alta        |
| Código fonte                   | Média       |

### 3.2 Vetores de ameaça

| Vetor                         | Mitigação                                     |
| ----------------------------- | --------------------------------------------- |
| Injection (SQL, XSS, command) | Prisma ORM, input validation, output encoding |
| Broken authentication         | JWT RS256, refresh rotation, rate limiting    |
| Broken access control         | RBAC + tenant isolation + RLS                 |
| Sensitive data exposure       | HTTPS, encryption at rest, log sanitization   |
| SSRF                          | Whitelist de URLs em HTTP clients             |
| DoS                           | Rate limiting (Nginx + Gateway + Throttler)   |
| CSRF                          | SameSite cookies, CSRF tokens em forms        |
| Dependency vulnerabilities    | npm audit, Dependabot, Snyk                   |

### 3.3 STRIDE por componente

| Componente   | Spoofing         | Tampering          | Repudiation        | Info Disclosure     | DoS              | Elevation        |
| ------------ | ---------------- | ------------------ | ------------------ | ------------------- | ---------------- | ---------------- |
| Auth Service | JWT + MFA futuro | Signed tokens      | Audit log          | Key protection      | Rate limit       | RBAC             |
| Gateway      | Token validation | Request ID         | Access log         | Header sanitization | Rate limit       | Scope check      |
| HelpDesk     | Tenant auth      | Input validation   | Ticket audit trail | Tenant isolation    | Pagination       | Role check       |
| Chat         | WS auth          | Message validation | Message log        | Room isolation      | Connection limit | Room permissions |

---

## 4. Autenticação

### 4.1 Arquitetura

Auth Service (APP-01) é o **Identity Provider** centralizado.

| Responsabilidade         | Auth Service          |
| ------------------------ | --------------------- |
| Registro de usuário      | Sim                   |
| Login (email + password) | Sim                   |
| Emissão JWT              | Sim                   |
| Refresh token            | Sim                   |
| Logout / revogação       | Sim                   |
| Password reset           | Sim                   |
| Verificação de e-mail    | Sim                   |
| Gestão de roles          | Sim                   |
| Gestão de tenants        | Sim                   |
| OAuth2/OIDC (futuro)     | v1.1 (Google, GitHub) |
| MFA (futuro)             | v1.2 (TOTP)           |

### 4.2 JWT — Access Token

| Propriedade | Valor                                                              |
| ----------- | ------------------------------------------------------------------ |
| Algoritmo   | RS256 (RSA + SHA-256)                                              |
| TTL         | 15 minutos                                                         |
| Issuer      | `novadesk-auth`                                                    |
| Audience    | `novadesk`                                                         |
| Claims      | `sub`, `email`, `roles`, `tenant_id`, `scope`, `iat`, `exp`, `jti` |

### 4.3 JWT — Refresh Token

| Propriedade          | Valor                                                      |
| -------------------- | ---------------------------------------------------------- |
| Formato              | Opaque token (UUID v4)                                     |
| TTL                  | 7 dias                                                     |
| Armazenamento server | Redis: `refresh:{token_hash}` → metadata                   |
| Armazenamento client | httpOnly, Secure, SameSite=Strict cookie                   |
| Rotação              | Novo refresh token a cada uso; anterior invalidado         |
| Reuse detection      | Se refresh usado duas vezes → revogar todos tokens do user |

### 4.4 Password policy

| Regra              | Valor                                       |
| ------------------ | ------------------------------------------- |
| Comprimento mínimo | 8 caracteres                                |
| Complexidade       | 1 maiúscula, 1 minúscula, 1 número          |
| Hashing            | bcrypt, cost factor 12                      |
| Histórico          | Últimas 5 senhas não reutilizáveis (futuro) |
| Brute force        | Lock após 5 tentativas em 15 min            |
| Reset              | Token por e-mail, TTL 1 hora, single use    |

### 4.5 JWKS

- Auth Service expõe `GET /.well-known/jwks.json`
- Gateway e serviços consomem JWKS para validar assinatura
- JWKS cacheado em Redis (TTL 1 hora)
- Rotação de chaves com `kid` header; suporte a múltiplas chaves ativas

### 4.6 Fluxo de autenticação web

1. Usuário submete credenciais
2. Auth Service valida, retorna access token (body) + refresh token (httpOnly cookie)
3. Frontend armazena access token em memória (não localStorage)
4. SDK (`packages/auth`) gerencia refresh automático antes da expiração
5. Logout: invalida refresh token no Redis, limpa cookie

### 4.7 Service-to-service authentication

| Mecanismo   | Uso                                                     |
| ----------- | ------------------------------------------------------- |
| Service JWT | Comunicação inter-serviços com scope `service:*`        |
| Emissão     | Auth Service endpoint interno (não exposto via Gateway) |
| TTL         | 5 minutos                                               |
| Validação   | Gateway ou serviço destino via JWKS                     |

---

## 5. Autorização

### 5.1 RBAC — Roles

| Role          | Descrição                   | Acesso                     |
| ------------- | --------------------------- | -------------------------- |
| `super_admin` | Administrador da plataforma | Tudo                       |
| `admin`       | Administrador de tenant     | Tenant completo            |
| `agent`       | Agente de suporte           | Tickets do tenant          |
| `user`        | Usuário final               | Próprios tickets, chat     |
| `guest`       | Não autenticado             | NovaDesk website, registro |

### 5.2 Permissões granulares (HelpDesk)

| Permissão          | Roles              |
| ------------------ | ------------------ |
| `ticket:create`    | user, agent, admin |
| `ticket:read:own`  | user               |
| `ticket:read:all`  | agent, admin       |
| `ticket:update`    | agent, admin       |
| `ticket:delete`    | admin              |
| `ticket:assign`    | agent, admin       |
| `tenant:manage`    | admin, super_admin |
| `user:manage`      | admin, super_admin |
| `analytics:view`   | admin, super_admin |
| `analytics:export` | admin              |

### 5.3 Implementação

| Camada   | Mecanismo                                  |
| -------- | ------------------------------------------ |
| Gateway  | Valida JWT, injeta headers de identidade   |
| Serviço  | Guard NestJS `@Roles()` + `@Permissions()` |
| Banco    | Row-Level Security (RLS) PostgreSQL        |
| Frontend | Route guards + conditional rendering       |

### 5.4 Tenant isolation

- `tenant_id` extraído do JWT em todo request autenticado
- Middleware Prisma filtra automaticamente por `tenant_id`
- RLS como safety net: `USING (tenant_id = current_setting('app.tenant_id')::uuid)`
- Testes de integração validam cross-tenant access denial

---

## 6. Comunicação segura

### 6.1 TLS

| Ambiente   | TLS                             |
| ---------- | ------------------------------- |
| local      | HTTP (exceção aceita)           |
| staging    | HTTPS (Let's Encrypt)           |
| production | HTTPS (Let's Encrypt), TLS 1.2+ |

### 6.2 Headers de segurança

Configurados via Nginx e Helmet:

| Header                      | Valor                                      |
| --------------------------- | ------------------------------------------ |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains`      |
| `X-Content-Type-Options`    | `nosniff`                                  |
| `X-Frame-Options`           | `DENY`                                     |
| `X-XSS-Protection`          | `0` (desabilitado, CSP é preferido)        |
| `Content-Security-Policy`   | Política restritiva por app                |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`          |
| `Permissions-Policy`        | Restringir camera, microphone, geolocation |

### 6.3 CORS

| Ambiente   | Origins permitidos             |
| ---------- | ------------------------------ |
| local      | `http://localhost:*`           |
| staging    | `https://staging.novadesk.dev` |
| production | `https://novadesk.dev`         |

---

## 7. Proteção de dados

### 7.1 Classificação

| Classificação | Exemplos               | Proteção                             |
| ------------- | ---------------------- | ------------------------------------ |
| Pública       | NovaDesk content, docs | Nenhuma especial                     |
| Interna       | Configuração, logs     | Acesso restrito                      |
| Confidencial  | E-mails, tickets, chat | Encryption at rest, access control   |
| Restrita      | Senhas, tokens, keys   | Hashing, encryption, secrets manager |

### 7.2 Encryption

| Tipo              | Mecanismo                                  |
| ----------------- | ------------------------------------------ |
| At rest (DB)      | PostgreSQL volume encryption (LUKS no VPS) |
| At rest (secrets) | GitHub Secrets, .env gitignored            |
| In transit        | TLS 1.2+                                   |
| Passwords         | bcrypt                                     |
| PII em logs       | Mascarado (email: `j***@example.com`)      |

### 7.3 Data retention

| Dado                     | Retenção | Após retenção         |
| ------------------------ | -------- | --------------------- |
| Tickets resolvidos       | 2 anos   | Anonimização          |
| Logs de aplicação        | 90 dias  | Deleção               |
| Audit logs               | 1 ano    | Arquivo               |
| Refresh tokens expirados | 7 dias   | Deleção automática    |
| Contas inativas          | 1 ano    | Notificação + deleção |

### 7.4 LGPD (práticas alinhadas)

- Consentimento no registro
- Endpoint de exportação de dados pessoais
- Endpoint de deleção de conta (right to erasure)
- Dados sintéticos em ambientes não-produção
- DPO não necessário (portfólio, sem operação comercial)

---

## 8. Rate limiting

| Camada                    | Limite               | Janela |
| ------------------------- | -------------------- | ------ |
| Nginx (global)            | 100 req/s por IP     | 1s     |
| Gateway (autenticado)     | 60 req/min por user  | 1 min  |
| Gateway (não autenticado) | 20 req/min por IP    | 1 min  |
| Auth login                | 5 req/min por IP     | 1 min  |
| Auth register             | 3 req/min por IP     | 1 min  |
| Password reset            | 3 req/hora por email | 1 hora |

Implementação: Redis sliding window.

---

## 9. Input validation e sanitização

| Camada               | Mecanismo                                     |
| -------------------- | --------------------------------------------- |
| HTTP                 | class-validator DTOs, Zod schemas             |
| SQL                  | Prisma ORM (parameterized queries)            |
| HTML (user content)  | DOMPurify no frontend, sanitização no backend |
| File upload (futuro) | Whitelist de MIME types, size limit, scan     |
| WebSocket            | Schema validation em cada mensagem            |

---

## 10. Audit logging

Eventos auditados:

| Evento                | Dados registrados                      |
| --------------------- | -------------------------------------- |
| Login (sucesso/falha) | userId, IP, userAgent, timestamp       |
| Logout                | userId, timestamp                      |
| Password change       | userId, timestamp                      |
| Role change           | userId, targetUserId, oldRole, newRole |
| Tenant create/update  | userId, tenantId, action               |
| Ticket status change  | userId, ticketId, oldStatus, newStatus |
| Data export           | userId, scope, timestamp               |
| Account deletion      | userId, timestamp                      |

Audit logs são append-only, armazenados em tabela dedicada, retidos por 1 ano.

---

## 11. Dependency security

| Ferramenta               | Frequência | Ação                            |
| ------------------------ | ---------- | ------------------------------- |
| npm audit                | Cada PR    | Bloqueia se critical            |
| Dependabot               | Diário     | Auto-PR para patches            |
| GitHub Dependency Review | Cada PR    | Bloqueia novas vulnerabilidades |
| CodeQL                   | Semanal    | Alertas de segurança            |

---

## 12. Incident response

### 12.1 Severidades

| Severidade    | Exemplo                   | Tempo de resposta |
| ------------- | ------------------------- | ----------------- |
| P0 — Critical | Data breach, auth bypass  | 1 hora            |
| P1 — High     | XSS, privilege escalation | 4 horas           |
| P2 — Medium   | Information disclosure    | 24 horas          |
| P3 — Low      | Missing security header   | 1 semana          |

### 12.2 Procedimento

1. Detectar (monitoring, report)
2. Conter (disable endpoint, rotate keys)
3. Investigar (logs, audit trail)
4. Remediar (fix, deploy)
5. Documentar (post-mortem)
6. Prevenir (atualizar threat model)

---

## 13. Security checklist por serviço

Todo serviço deve implementar:

- [ ] Input validation em todos endpoints
- [ ] Authentication guard em endpoints protegidos
- [ ] Authorization check por recurso
- [ ] Rate limiting
- [ ] CORS configurado
- [ ] Helmet/security headers
- [ ] Logging sem PII
- [ ] Error messages sem stack traces em production
- [ ] Dependencies auditadas
- [ ] Secrets em variáveis de ambiente
- [ ] Health check sem informação sensível

---

## 14. Referências cruzadas

| Tópico          | Documento                                                  |
| --------------- | ---------------------------------------------------------- |
| Arquitetura     | [01-Architecture.md](./01-Architecture.md)                 |
| APIs            | [18-API-Design-Standards.md](./18-API-Design-Standards.md) |
| DevOps          | [06-DevOps.md](./06-DevOps.md)                             |
| Observabilidade | [08-Observability.md](./08-Observability.md)               |
| Testes          | [05-Testing-Strategy.md](./05-Testing-Strategy.md)         |
| Runbooks        | [21-Runbooks.md](./21-Runbooks.md)                         |
