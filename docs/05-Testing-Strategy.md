# 05 — Estratégia de Testes

**Versão:** 1.0  
**Status:** Aprovado  
**Última atualização:** 2026-07-03  
**Relacionado:** [03-Coding-Standards.md](./03-Coding-Standards.md), [06-DevOps.md](./06-DevOps.md), [11-Definition-of-Done.md](./11-Definition-of-Done.md)

---

## 1. Objetivo

Definir a estratégia completa de testes do NovaDesk: pirâmide de testes, ferramentas, cobertura, padrões, ambientes de teste e integração com CI/CD.

Todo código de produção deve ser testável. Código sem testes não atende Definition of Done.

---

## 2. Pirâmide de testes

```
                    ┌───────────┐
                    │    E2E    │  ~10% dos testes
                    │ Playwright│  Fluxos críticos de usuário
                    ├───────────┤
                    │ Integração│  ~25% dos testes
                    │ Jest/Super│  APIs, repositórios, filas
                    ├───────────┤
                    │  Unitário │  ~65% dos testes
                    │ Jest/Vitest│ Use cases, utils, components
                    └───────────┘
```

### 2.1 Proporção alvo

| Camada     | % testes | % cobertura linhas alvo    |
| ---------- | -------- | -------------------------- |
| Unitário   | 65%      | 85% em use cases e domain  |
| Integração | 25%      | 75% em controllers e repos |
| E2E        | 10%      | 100% dos fluxos críticos   |

---

## 3. Ferramentas

| Camada     | Backend          | Frontend                 | Pacotes        |
| ---------- | ---------------- | ------------------------ | -------------- |
| Unitário   | Jest 29          | Vitest 1                 | Jest ou Vitest |
| Integração | Jest + Supertest | —                        | Jest           |
| Componente | —                | Vitest + Testing Library | Vitest (ui)    |
| E2E        | —                | Playwright 1             | —              |
| Containers | Testcontainers   | —                        | Testcontainers |
| Mocking    | jest.mock, MSW   | MSW, vi.mock             | —              |
| Coverage   | Istanbul (c8)    | Istanbul (c8)            | Istanbul       |
| Snapshot   | Limitado         | Componentes estáveis     | —              |

Detalhamento de stack em [02-Tech-Stack.md](./02-Tech-Stack.md).

---

## 4. Testes unitários

### 4.1 Escopo

| Camada         | O que testar                                      |
| -------------- | ------------------------------------------------- |
| Domain         | Entidades, value objects, regras de negócio puras |
| Application    | Use cases com repositórios mockados               |
| Shared         | Funções utilitárias puras                         |
| UI package     | Componentes isolados, props, acessibilidade       |
| Frontend hooks | Hooks customizados com renderHook                 |

### 4.2 Padrões

- Padrão AAA: Arrange, Act, Assert
- Um comportamento por teste
- Nomes descritivos: `should return 404 when ticket not found`
- Factory functions para fixtures: `createMockTicket(overrides)`
- Sem dependência de ordem de execução
- Sem estado compartilhado entre testes

### 4.3 O que NÃO testar unitariamente

- Framework internals (NestJS decorators, Next.js routing)
- Bibliotecas de terceiros
- Getters/setters triviais
- Configuração pura

---

## 5. Testes de integração

### 5.1 Escopo

| Alvo                 | Abordagem                                                   |
| -------------------- | ----------------------------------------------------------- |
| Controllers REST     | Supertest contra app NestJS com banco real (Testcontainers) |
| Repositórios Prisma  | Testcontainers PostgreSQL                                   |
| Consumers BullMQ     | Redis Testcontainer + processamento real                    |
| Guards e middlewares | Request simulado com tokens reais                           |
| Migrations           | Apply + rollback em banco limpo                             |

### 5.2 Ambiente

- Testcontainers para PostgreSQL 16 e Redis 7 em CI
- Database limpo por suite (beforeAll: migrate, afterAll: drop)
- Seed mínimo por suite de integração
- Timeout: 30s por teste, 5min por suite

### 5.3 Contratos inter-serviços

- Testes de contrato (consumer-driven) para APIs críticas
- Auth Service ↔ Gateway: validação JWKS
- HelpDesk → Notification: payload de evento de ticket
- Schemas Zod compartilhados validados em ambos os lados

---

## 6. Testes E2E

### 6.1 Ferramenta

Playwright com configuração por app em `04-apps/{app}/e2e/`.

### 6.2 Fluxos críticos obrigatórios

| App                 | Fluxo                                           | Prioridade |
| ------------------- | ----------------------------------------------- | ---------- |
| HelpDesk SaaS       | Login → criar ticket → receber resposta         | P0         |
| HelpDesk SaaS       | Agente assume ticket → resolve                  | P0         |
| Admin Portal        | Login admin → criar tenant → criar usuário      | P0         |
| Analytics Dashboard | Login → visualizar dashboard → filtrar período  | P1         |
| Realtime Chat       | Login → enviar mensagem → receber em tempo real | P1         |
| NovaDesk Website    | Navegação → formulário de contato               | P1         |
| Auth                | Login → refresh token → logout                  | P0         |
| Auth                | Registro → verificação de e-mail                | P1         |

### 6.3 Configuração

- Base URL por ambiente via variável `E2E_BASE_URL`
- Screenshots on failure
- Video on retry
- Trace on first retry
- Execução em CI com sharding para paralelismo
- Dados de teste criados via API antes de cada suite (não dependem de seed manual)

### 6.4 Page Object Model

- Page objects em `e2e/pages/`
- Actions encapsuladas: `LoginPage.login(email, password)`
- Seletores via `data-testid` — nunca CSS frágil

---

## 7. Testes de performance (v1.1)

Não obrigatório na v1.0. Planejado:

- k6 para load testing de endpoints críticos
- Thresholds: P95 < 200ms para GET, < 500ms para POST
- Execução semanal em staging

---

## 8. Testes de segurança

| Tipo                 | Ferramenta              | Frequência         |
| -------------------- | ----------------------- | ------------------ |
| Dependency audit     | npm audit, Dependabot   | Cada PR + diário   |
| SAST                 | ESLint security plugins | Cada PR            |
| OWASP ZAP (baseline) | ZAP Docker              | Semanal em staging |
| Auth testing         | Testes integração       | Cada PR            |

Detalhamento em [07-Security.md](./07-Security.md).

---

## 9. Cobertura de código

### 9.1 Thresholds mínimos (CI bloqueia se abaixo)

| Escopo                                  | Linhas | Branches | Functions |
| --------------------------------------- | ------ | -------- | --------- |
| Backend services (domain + application) | 85%    | 80%      | 85%       |
| Backend services (overall)              | 80%    | 75%      | 80%       |
| Frontend apps (features)                | 70%    | 65%      | 70%       |
| Packages (shared, auth, sdk)            | 90%    | 85%      | 90%       |
| Packages (ui)                           | 60%    | 55%      | 60%       |

### 9.2 Exclusões de cobertura

- Arquivos de configuração
- Types e interfaces puras
- Migrations Prisma
- Main/bootstrap files
- Generated code

### 9.3 Relatórios

- Istanbul HTML report gerado em CI
- Upload para artefato GitHub Actions
- Badge de cobertura no README (Codecov ou similar)

---

## 10. Estrutura de arquivos de teste

### 10.1 Backend

```
src/
  application/
    use-cases/
      create-ticket.use-case.ts
      create-ticket.use-case.spec.ts    # Co-located
  presentation/
    controllers/
      tickets.controller.ts
      tickets.controller.integration.spec.ts
test/
  e2e/                                   # E2E de API (opcional)
  fixtures/
  factories/
```

### 10.2 Frontend

```
features/
  tickets/
    components/
      TicketCard.tsx
      TicketCard.test.tsx               # Co-located
e2e/
  pages/
  tests/
  fixtures/
playwright.config.ts
```

---

## 11. Dados de teste

### 11.1 Factories

- `@faker-js/faker` para dados realistas
- Factory functions tipadas: `buildUser(overrides?: Partial<User>)`
- Nunca dados de produção em testes

### 11.2 Seeds

| Ambiente | Seed                                       |
| -------- | ------------------------------------------ |
| local    | `prisma/seed.ts` com dados de demonstração |
| ci       | Factories programáticas, sem seed file     |
| staging  | Seed de demonstração + dados sintéticos    |
| e2e      | API setup antes de cada suite              |

---

## 12. Integração com CI

| Stage       | Testes executados                | Bloqueante |
| ----------- | -------------------------------- | ---------- |
| Lint        | —                                | Sim        |
| Typecheck   | —                                | Sim        |
| Unit        | Jest/Vitest por pacote afetado   | Sim        |
| Integration | Jest + Testcontainers            | Sim        |
| E2E         | Playwright (após deploy preview) | Sim        |
| Coverage    | Threshold check                  | Sim        |

Pipeline detalhado em [06-DevOps.md](./06-DevOps.md).

---

## 13. Testes em Docker

- `docker compose -f docker-compose.test.yml up` para ambiente de teste completo
- Usado em CI e localmente para debug de integração
- Containers efêmeros — destruídos após execução

---

## 14. Política de flaky tests

1. Teste flaky é bug de prioridade P1
2. Não ignorar teste flaky sem issue aberta
3. Máximo 2 retries em CI
4. Quarantine tag para testes instáveis temporariamente: `@quarantine`
5. Testes em quarantine devem ser corrigidos em 1 sprint

---

## 15. Definition of Done — testes

Item de backlog só está completo em testes quando:

- [ ] Testes unitários cobrem happy path e edge cases principais
- [ ] Testes de integração cobrem endpoints novos/alterados
- [ ] E2E atualizado se fluxo de usuário mudou
- [ ] Cobertura acima dos thresholds
- [ ] Nenhum teste skipped sem justificativa
- [ ] CI verde

Ver [11-Definition-of-Done.md](./11-Definition-of-Done.md).

---

## 16. Referências cruzadas

| Tópico             | Documento                                              |
| ------------------ | ------------------------------------------------------ |
| Coding standards   | [03-Coding-Standards.md](./03-Coding-Standards.md)     |
| CI/CD              | [06-DevOps.md](./06-DevOps.md)                         |
| Segurança          | [07-Security.md](./07-Security.md)                     |
| Definition of Done | [11-Definition-of-Done.md](./11-Definition-of-Done.md) |
