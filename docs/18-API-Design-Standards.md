# 18 — Padrões de Design de API

**Versão:** 1.0  
**Status:** Aprovado  
**Última atualização:** 2026-07-03  
**Relacionado:** [16-Service-Catalog.md](./16-Service-Catalog.md), [07-Security.md](./07-Security.md), [03-Coding-Standards.md](./03-Coding-Standards.md)

---

## 1. Objetivo

Definir padrões obrigatórios para todas as APIs REST do NovaDesk: nomenclatura, versionamento, formatos, paginação, erros, autenticação e documentação OpenAPI.

---

## 2. Princípios

| Princípio     | Descrição                                   |
| ------------- | ------------------------------------------- |
| RESTful       | Recursos como nouns, verbos HTTP semânticos |
| Consistência  | Mesmos padrões em todos os serviços         |
| Versionamento | URL path versioning                         |
| Stateless     | Sem estado de sessão no servidor            |
| HATEOAS leve  | Links de paginação, não links de ações      |
| Documentação  | OpenAPI 3.1 obrigatória                     |
| Validação     | Toda entrada validada, toda saída tipada    |

---

## 3. URL structure

### 3.1 Formato

```
https://{host}/api/v{version}/{resource}[/{id}][/{sub-resource}]
```

### 3.2 Regras

| Regra                     | Exemplo correto             | Exemplo incorreto      |
| ------------------------- | --------------------------- | ---------------------- |
| Recursos em plural        | `/tickets`                  | `/ticket`              |
| Kebab-case                | `/ticket-comments`          | `/ticketComments`      |
| Sem verbos na URL         | `POST /tickets`             | `POST /create-ticket`  |
| IDs como path param       | `/tickets/{id}`             | `/tickets?id={id}`     |
| Sub-recursos aninhados    | `/tickets/{id}/comments`    | `/comments?ticket_id=` |
| Ações como sub-resource   | `POST /tickets/{id}/assign` | `POST /assign-ticket`  |
| Filtros como query params | `/tickets?status=open`      | `/tickets/open`        |

### 3.3 Versionamento

| Versão | Path       | Status                     |
| ------ | ---------- | -------------------------- |
| v1     | `/api/v1/` | Atual                      |
| v2     | `/api/v2/` | Futuro (quando necessário) |

Breaking changes exigem nova versão. Deprecation notice por 90 dias via header `Deprecation: true` e `Sunset: {date}`.

---

## 4. HTTP methods

| Método | Uso                   | Idempotente | Body |
| ------ | --------------------- | ----------- | ---- |
| GET    | Leitura               | Sim         | Não  |
| POST   | Criação, ações        | Não         | Sim  |
| PUT    | Substituição completa | Sim         | Sim  |
| PATCH  | Atualização parcial   | Não         | Sim  |
| DELETE | Remoção               | Sim         | Não  |

---

## 5. Request format

### 5.1 Headers obrigatórios

| Header          | Obrigatório                | Descrição               |
| --------------- | -------------------------- | ----------------------- |
| `Content-Type`  | Sim (com body)             | `application/json`      |
| `Authorization` | Sim (endpoints protegidos) | `Bearer {access_token}` |
| `X-Request-Id`  | Não (gerado se ausente)    | UUID de correlação      |
| `Accept`        | Recomendado                | `application/json`      |

### 5.2 Headers de resposta obrigatórios

| Header                  | Descrição          |
| ----------------------- | ------------------ |
| `X-Request-Id`          | UUID de correlação |
| `Content-Type`          | `application/json` |
| `X-RateLimit-Limit`     | Limite de requests |
| `X-RateLimit-Remaining` | Requests restantes |
| `X-RateLimit-Reset`     | Timestamp de reset |

---

## 6. Response format

### 6.1 Sucesso — recurso único

| Campo            | Tipo          | Descrição                   |
| ---------------- | ------------- | --------------------------- |
| `data`           | object        | Recurso solicitado          |
| `meta.requestId` | string (UUID) | Identificador de correlação |

### 6.2 Sucesso — coleção paginada

| Campo                     | Tipo          | Descrição                          |
| ------------------------- | ------------- | ---------------------------------- |
| `data`                    | array         | Lista de recursos                  |
| `meta.requestId`          | string (UUID) | Identificador de correlação        |
| `meta.pagination.cursor`  | string        | Cursor para próxima página         |
| `meta.pagination.hasMore` | boolean       | Indica se há mais páginas          |
| `meta.pagination.total`   | integer       | Total de itens (quando disponível) |

### 6.3 Sucesso — ação sem retorno

HTTP 204 No Content (sem body).

### 6.4 Sucesso — criação

HTTP 201 Created com body e header `Location: /api/v1/{resource}/{id}`.

---

## 7. Paginação

### 7.1 Cursor-based (padrão)

| Param    | Tipo    | Default | Descrição                  |
| -------- | ------- | ------- | -------------------------- |
| `cursor` | string  | null    | Cursor da página anterior  |
| `limit`  | integer | 20      | Itens por página (max 100) |

### 7.2 Regras

- Ordenação estável (sempre incluir `id` como tiebreaker)
- `hasMore: true` indica mais páginas
- `total` incluído quando custo de contagem é aceitável
- Cursor é opaque (base64 encoded)

---

## 8. Filtros e ordenação

### 8.1 Filtros

| Param           | Exemplo                     | Descrição        |
| --------------- | --------------------------- | ---------------- |
| `status`        | `?status=open`              | Filtro exato     |
| `priority`      | `?priority=high,medium`     | Filtro múltiplo  |
| `created_after` | `?created_after=2026-01-01` | Range            |
| `search`        | `?search=login+issue`       | Full-text search |

### 8.2 Ordenação

| Param  | Exemplo                      | Descrição                 |
| ------ | ---------------------------- | ------------------------- |
| `sort` | `?sort=created_at`           | Ascendente                |
| `sort` | `?sort=-created_at`          | Descendente (prefixo `-`) |
| `sort` | `?sort=-priority,created_at` | Múltiplos campos          |

---

## 9. Error format

### 9.1 Estrutura de erro

| Campo             | Tipo              | Descrição                                      |
| ----------------- | ----------------- | ---------------------------------------------- |
| `error.code`      | string            | Código de erro em SCREAMING_SNAKE_CASE         |
| `error.message`   | string            | Mensagem legível para o cliente                |
| `error.status`    | integer           | HTTP status code                               |
| `error.details`   | array             | Lista de erros de validação (quando aplicável) |
| `error.requestId` | string (UUID)     | Identificador de correlação                    |
| `error.timestamp` | string (ISO 8601) | Momento do erro                                |

### 9.2 Error codes

Formato: `{DOMAIN}_{ERROR}` em SCREAMING_SNAKE_CASE.

| Code                   | HTTP | Descrição                             |
| ---------------------- | ---- | ------------------------------------- |
| `VALIDATION_ERROR`     | 400  | Input inválido                        |
| `UNAUTHORIZED`         | 401  | Token ausente ou inválido             |
| `FORBIDDEN`            | 403  | Sem permissão                         |
| `NOT_FOUND`            | 404  | Recurso não encontrado                |
| `CONFLICT`             | 409  | Conflito (duplicata, estado inválido) |
| `UNPROCESSABLE_ENTITY` | 422  | Regra de negócio violada              |
| `RATE_LIMITED`         | 429  | Rate limit excedido                   |
| `INTERNAL_ERROR`       | 500  | Erro interno                          |

### 9.3 Validation errors

Cada item em `error.details` contém: `field` (campo com erro), `message` (descrição legível) e `code` (código específico como `INVALID_EMAIL`).

### 9.4 Regras de erro

- Nunca expor stack traces em production
- Nunca expor detalhes de banco de dados
- Mensagens user-friendly no `message`
- Detalhes técnicos apenas em logs (com requestId)
- Todo erro logado com nível ERROR

---

## 10. Status codes

| Code | Uso                                  |
| ---- | ------------------------------------ |
| 200  | GET, PUT, PATCH com sucesso          |
| 201  | POST com criação                     |
| 204  | DELETE com sucesso, ação sem retorno |
| 400  | Validação falhou                     |
| 401  | Não autenticado                      |
| 403  | Não autorizado                       |
| 404  | Recurso não encontrado               |
| 409  | Conflito                             |
| 422  | Regra de negócio                     |
| 429  | Rate limited                         |
| 500  | Erro interno                         |
| 502  | Serviço downstream indisponível      |
| 503  | Serviço temporariamente indisponível |

---

## 11. Autenticação em APIs

| Contexto           | Mecanismo                                                  |
| ------------------ | ---------------------------------------------------------- |
| Cliente → Gateway  | JWT Bearer token                                           |
| Gateway → Serviço  | JWT Bearer + headers `X-User-Id`, `X-Tenant-Id`, `X-Roles` |
| Serviço → Serviço  | Service JWT com scope `service:*`                          |
| Endpoints públicos | Marcados com `@Public()` decorator, sem auth               |

---

## 12. OpenAPI / Swagger

### 12.1 Requisitos

Todo serviço expõe:

| Endpoint         | Descrição             |
| ---------------- | --------------------- |
| `/api/docs`      | Swagger UI            |
| `/api/docs-json` | OpenAPI 3.1 JSON spec |

### 12.2 Documentação obrigatória por endpoint

- Summary e description
- Tags para agrupamento
- Request body schema com examples
- Response schemas para cada status code
- Security requirements
- Parameter descriptions

### 12.3 Tags padrão

| Tag           | Serviço              |
| ------------- | -------------------- |
| Auth          | Auth Service         |
| Users         | Auth Service         |
| Tenants       | Auth Service         |
| Tickets       | HelpDesk API         |
| Categories    | HelpDesk API         |
| Analytics     | Analytics API        |
| Notifications | Notification Service |
| Chat          | Realtime Chat        |
| Health        | Todos                |

---

## 13. WebSocket API (Chat)

### 13.1 Conexão

WebSocket via `wss://{host}/ws/chat` com access token JWT passado como query parameter no handshake.

### 13.2 Eventos

| Direção         | Evento             | Payload                                   |
| --------------- | ------------------ | ----------------------------------------- |
| Client → Server | `room:join`        | `{ roomId }`                              |
| Client → Server | `message:send`     | `{ roomId, body }`                        |
| Client → Server | `typing:start`     | `{ roomId }`                              |
| Client → Server | `typing:stop`      | `{ roomId }`                              |
| Server → Client | `message:received` | `{ id, roomId, userId, body, createdAt }` |
| Server → Client | `presence:update`  | `{ userId, status }`                      |
| Server → Client | `typing:update`    | `{ roomId, userId, isTyping }`            |
| Server → Client | `error`            | `{ code, message }`                       |

### 13.3 Regras

- Autenticação no handshake via JWT query param
- Heartbeat ping/pong a cada 30s
- Reconexão automática com exponential backoff
- Mensagens validadas com Zod schema

---

## 14. Rate limiting headers

Sempre incluídos em respostas:

| Header                  | Descrição                    |
| ----------------------- | ---------------------------- |
| `X-RateLimit-Limit`     | Máximo de requests na janela |
| `X-RateLimit-Remaining` | Requests restantes           |
| `X-RateLimit-Reset`     | Unix timestamp de reset      |

Quando excedido: HTTP 429 com body de erro e header `Retry-After`.

---

## 15. Referências cruzadas

| Tópico           | Documento                                              |
| ---------------- | ------------------------------------------------------ |
| Serviços         | [16-Service-Catalog.md](./16-Service-Catalog.md)       |
| Segurança        | [07-Security.md](./07-Security.md)                     |
| Coding standards | [03-Coding-Standards.md](./03-Coding-Standards.md)     |
| SDK              | [15-Monorepo-Structure.md](./15-Monorepo-Structure.md) |
