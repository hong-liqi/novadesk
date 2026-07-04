# 03 — Padrões de Código (Coding Standards)

**Versão:** 1.0  
**Status:** Aprovado  
**Última atualização:** 2026-07-03  
**Relacionado:** [02-Tech-Stack.md](./02-Tech-Stack.md), [05-Testing-Strategy.md](./05-Testing-Strategy.md), [19-Documentation-Standards.md](./19-Documentation-Standards.md)

---

## 1. Objetivo

Este documento define padrões de código obrigatórios para todo o monorepo Portfolio OS. O objetivo é garantir consistência, legibilidade, testabilidade e manutenibilidade independentemente do autor ou agente de IA que produza o código.

Violações bloqueiam merge via CI (lint, typecheck, review).

---

## 2. Princípios gerais

| Princípio                               | Descrição                                                            |
| --------------------------------------- | -------------------------------------------------------------------- |
| Clareza sobre cleverness                | Código explícito e legível supera abstrações inteligentes            |
| Single Responsibility                   | Cada módulo, classe e função faz uma coisa                           |
| DRY com moderação                       | Não abstrair prematuramente; duplicação aceitável até o terceiro uso |
| Fail fast                               | Validar entradas na fronteira; nunca propagar estado inválido        |
| Imutabilidade preferida                 | Evitar mutação de objetos compartilhados                             |
| Tipos explícitos                        | TypeScript strict mode; proibir `any` sem justificativa documentada  |
| Sem lógica em controllers               | Controllers delegam para use cases                                   |
| Sem lógica de negócio em pacotes shared | Apenas tipos, constantes e utils puros                               |

---

## 3. TypeScript

### 3.1 Configuração

- `strict: true` em todos os projetos
- `noUncheckedIndexedAccess: true`
- `noImplicitReturns: true`
- `exactOptionalPropertyTypes: true` onde suportado
- Configurações base herdadas de `packages/tsconfig`

### 3.2 Nomenclatura

| Elemento                    | Convenção                 | Exemplo                      |
| --------------------------- | ------------------------- | ---------------------------- |
| Arquivos (backend)          | kebab-case                | `create-ticket.use-case.ts`  |
| Arquivos (React components) | PascalCase                | `TicketCard.tsx`             |
| Arquivos (hooks)            | camelCase com prefixo use | `useTickets.ts`              |
| Interfaces                  | PascalCase, sem prefixo I | `Ticket`, `TicketRepository` |
| Types                       | PascalCase                | `TicketStatus`               |
| Enums                       | PascalCase                | `TicketPriority`             |
| Constantes                  | SCREAMING_SNAKE_CASE      | `MAX_RETRY_ATTEMPTS`         |
| Variáveis e funções         | camelCase                 | `createTicket`               |
| Classes                     | PascalCase                | `CreateTicketUseCase`        |
| Generics                    | T, K, V ou descritivos    | `TEntity`                    |

### 3.3 Proibições

- `any` — usar `unknown` e narrowing
- `@ts-ignore` — usar `@ts-expect-error` com comentário obrigatório
- `enum` numérico — preferir union types ou const objects
- Default exports — preferir named exports (exceto Next.js pages/layouts)
- Non-null assertion (`!`) — exceto em testes ou com validação prévia documentada

### 3.4 Imports

Ordem de imports (enforced por ESLint):

1. Node.js built-ins
2. Dependências externas
3. Pacotes internos (`@portfolio/*`)
4. Imports relativos (parent, sibling, index)

Separar grupos com linha em branco. Usar path aliases definidos em cada projeto.

---

## 4. Backend (NestJS)

### 4.1 Estrutura de módulo

Cada bounded context segue:

```
src/
  domain/
    entities/
    value-objects/
    events/
    exceptions/
  application/
    use-cases/
    dto/
    ports/           # Interfaces de repositório
  infrastructure/
    persistence/
    messaging/
    http/
  presentation/
    controllers/
    guards/
    filters/
    interceptors/
  {module}.module.ts
```

### 4.2 Use cases

- Um arquivo por use case
- Nome: `{verbo}-{entidade}.use-case.ts`
- Classe: `{Verbo}{Entidade}UseCase`
- Método público único: `execute(input): Promise<output>`
- Injeção de dependência via constructor
- Sem dependência de NestJS (decorators) dentro de use cases

### 4.3 Controllers

- Um controller por recurso REST
- Rotas em plural: `/tickets`, `/users`
- Verbos HTTP semânticos
- DTOs de request e response separados
- Status codes explícitos via decorators
- Documentação Swagger em todo endpoint

### 4.4 DTOs e validação

- class-validator decorators em DTOs de entrada
- Zod schemas em `packages/shared` para contratos compartilhados com frontend
- Transformação via class-transformer
- Nunca confiar em dados do cliente sem validação

### 4.5 Repositórios

- Interface (port) em `application/ports/`
- Implementação Prisma em `infrastructure/persistence/`
- Métodos expressivos: `findById`, `findByTenantId`, `save`, `delete`
- Sem lógica de negócio em repositórios

### 4.6 Tratamento de erros

| Tipo             | HTTP Status | Classe                         |
| ---------------- | ----------- | ------------------------------ |
| Validação        | 400         | `ValidationException`          |
| Não autenticado  | 401         | `UnauthorizedException`        |
| Não autorizado   | 403         | `ForbiddenException`           |
| Não encontrado   | 404         | `NotFoundException`            |
| Conflito         | 409         | `ConflictException`            |
| Regra de negócio | 422         | `DomainException`              |
| Erro interno     | 500         | `InternalServerErrorException` |

Exceções de domínio nunca vazam detalhes internos para o cliente.

### 4.7 Logging

- Usar pacote `@portfolio/logger` exclusivamente
- Nunca `console.log` em código de produção
- Log estruturado com context: `requestId`, `userId`, `tenantId`, `service`
- Nível INFO para operações normais, WARN para degradação, ERROR para falhas

---

## 5. Frontend (Next.js + React)

### 5.1 Estrutura de feature

```
features/
  tickets/
    api/              # TanStack Query hooks
    components/       # Componentes da feature
    hooks/            # Hooks específicos
    types/            # Tipos locais
    utils/            # Utilitários locais
    index.ts          # Public API da feature
```

### 5.2 Componentes

- Function components exclusivamente
- Props tipadas com interface dedicada
- Componentes de `packages/ui` para primitivos (Button, Input, Modal)
- Composição sobre herança
- Máximo 200 linhas por componente; extrair se exceder

### 5.3 Data fetching

- TanStack Query para todo estado servidor
- Query keys padronizadas: `['tickets', tenantId, filters]`
- Mutations com optimistic updates onde apropriado
- Error boundaries por feature
- Loading e error states obrigatórios em toda UI que fetch dados

### 5.4 Forms

- React Hook Form + Zod resolver
- Schemas Zod compartilhados com backend quando possível
- Feedback de validação inline
- Disable submit durante loading

### 5.5 Estilização

- Tailwind CSS exclusivamente
- Design tokens definidos em `packages/ui/tailwind.config`
- Responsive mobile-first
- Dark mode suportado via class strategy
- Sem inline styles exceto valores dinâmicos

### 5.6 Acessibilidade

- HTML semântico
- ARIA labels onde necessário
- Navegação por teclado funcional
- Contraste WCAG AA mínimo
- Radix UI para componentes interativos complexos

---

## 6. Banco de dados (Prisma)

### 6.1 Schema

- Nomes de tabela em snake_case plural: `tickets`, `users`
- Nomes de coluna em snake_case: `created_at`, `tenant_id`
- Toda tabela possui: `id` (UUID), `created_at`, `updated_at`
- Soft delete via `deleted_at` onde aplicável
- Índices explícitos para queries frequentes
- `tenant_id` em todas tabelas multi-tenant

### 6.2 Migrations

- Uma migration por mudança lógica
- Nome descritivo: `add_ticket_priority_column`
- Nunca editar migration já aplicada em staging/production
- Seed data separado por ambiente

### 6.3 Queries

- Sem raw queries exceto com justificativa e ADR
- Select apenas campos necessários
- Paginação cursor-based para listagens
- Transactions para operações multi-tabela

---

## 7. Testes

Resumo; detalhamento completo em [05-Testing-Strategy.md](./05-Testing-Strategy.md).

| Regra                | Descrição                                                                         |
| -------------------- | --------------------------------------------------------------------------------- |
| Nomenclatura         | `describe('CreateTicketUseCase')` / `it('should create ticket when valid input')` |
| Arrange-Act-Assert   | Estrutura obrigatória                                                             |
| Um assert por teste  | Preferencialmente                                                                 |
| Mocks                | Apenas em fronteiras (repositórios, HTTP clients)                                 |
| Fixtures             | Factory functions, não objetos hardcoded                                          |
| Sem lógica em testes | Sem if/for em testes                                                              |

---

## 8. Docker

- Multi-stage builds obrigatórios
- Imagem final baseada em `node:20-alpine` ou `distroless`
- Non-root user na imagem de produção
- `.dockerignore` em todo serviço
- Health check definido no Dockerfile e Compose

---

## 9. Configuração e secrets

- Variáveis de ambiente validadas via Zod em `packages/config`
- Nunca hardcodar secrets
- `.env.example` em todo serviço com todas variáveis documentadas
- Prefixo por serviço: `AUTH_DATABASE_URL`, `HELPDESK_REDIS_URL`

---

## 10. Comentários e documentação inline

- Código autoexplicativo é preferido
- Comentários apenas para: regras de negócio não óbvias, workarounds com ticket de referência, decisões temporárias com TODO datado
- JSDoc em funções públicas de pacotes compartilhados
- Proibido: comentários que repetem o código, código comentado (deletar)

---

## 11. Code review checklist

Todo PR deve ser verificado contra:

- [ ] Segue estrutura de pastas definida
- [ ] TypeScript strict sem erros
- [ ] ESLint e Prettier passando
- [ ] Testes adicionados/atualizados
- [ ] Sem `any`, `console.log`, secrets hardcoded
- [ ] DTOs validados
- [ ] Logging estruturado
- [ ] Documentação atualizada se comportamento mudou
- [ ] OpenAPI atualizado se API mudou
- [ ] Migrations incluídas se schema mudou

---

## 12. Ferramentas de enforcement

| Ferramenta          | Escopo       | Quando executa  |
| ------------------- | ------------ | --------------- |
| ESLint              | Lint         | Pre-commit + CI |
| Prettier            | Format       | Pre-commit + CI |
| TypeScript compiler | Type check   | CI              |
| commitlint          | Commits      | Commit-msg hook |
| lint-staged         | Staged files | Pre-commit      |
| Husky               | Git hooks    | Local           |

Configurações centralizadas em `packages/eslint-config` e `packages/tsconfig`.

---

## 13. Referências cruzadas

| Tópico             | Documento                                                        |
| ------------------ | ---------------------------------------------------------------- |
| Tech stack         | [02-Tech-Stack.md](./02-Tech-Stack.md)                           |
| Testes             | [05-Testing-Strategy.md](./05-Testing-Strategy.md)               |
| Git workflow       | [04-Git-Workflow.md](./04-Git-Workflow.md)                       |
| APIs               | [18-API-Design-Standards.md](./18-API-Design-Standards.md)       |
| Documentação       | [19-Documentation-Standards.md](./19-Documentation-Standards.md) |
| Definition of Done | [11-Definition-of-Done.md](./11-Definition-of-Done.md)           |
