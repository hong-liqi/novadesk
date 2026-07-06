# 20 — Glossário

**Versão:** 1.0  
**Status:** Aprovado  
**Última atualização:** 2026-07-03

---

| Termo                     | Definição                                                                          |
| ------------------------- | ---------------------------------------------------------------------------------- |
| **Access Token**          | JWT de curta duração (15 min) usado para autenticar requests API                   |
| **ADR**                   | Architecture Decision Record — documento que registra decisão arquitetural         |
| **API Gateway**           | Ponto de entrada único (APP-02) para todas as APIs do ecossistema                  |
| **Auth Service**          | Serviço central de identidade (APP-01)                                             |
| **BFF**                   | Backend for Frontend — padrão de API adaptada ao frontend                          |
| **Bounded Context**       | Limite de domínio dentro do qual um modelo é consistente                           |
| **BullMQ**                | Biblioteca de filas de jobs assíncronos baseada em Redis                           |
| **Circuit Breaker**       | Padrão que interrompe chamadas a serviço falho para evitar cascata                 |
| **Clean Architecture**    | Padrão de camadas: domain → application → infrastructure → presentation            |
| **CQRS**                  | Command Query Responsibility Segregation — separação de leitura e escrita          |
| **DLQ**                   | Dead Letter Queue — fila para jobs que falharam após todas tentativas              |
| **DoD**                   | Definition of Done — critérios para considerar tarefa concluída                    |
| **DTO**                   | Data Transfer Object — objeto para transferência de dados entre camadas            |
| **E2E**                   | End-to-End — teste que valida fluxo completo do ponto de vista do usuário          |
| **Feature-Sliced Design** | Metodologia de organização de código frontend por features                         |
| **JWKS**                  | JSON Web Key Set — conjunto de chaves públicas para validação JWT                  |
| **JWT**                   | JSON Web Token — token assinado para autenticação stateless                        |
| **Milestone**             | Marco de entrega (M0–M13) no [roadmap](./09-Roadmap.md)                            |
| **Monorepo**              | Repositório único contendo múltiplos pacotes, serviços e apps                      |
| **Multi-tenancy**         | Arquitetura onde múltiplos tenants compartilham infraestrutura com isolamento      |
| **NestJS**                | Framework Node.js para microsserviços com injeção de dependência                   |
| **OpenAPI**               | Especificação padrão para documentação de APIs REST                                |
| **Outbox Pattern**        | Padrão para garantir entrega de eventos junto com transaction de banco             |
| **PgBouncer**             | Connection pooler para PostgreSQL                                                  |
| **Pino**                  | Biblioteca de logging estruturado JSON para Node.js                                |
| **NovaDesk**              | Nome do ecossistema completo deste portfólio                                       |
| **Prisma**                | ORM TypeScript com migrations e type-safe queries                                  |
| **RBAC**                  | Role-Based Access Control — autorização baseada em papéis                          |
| **Refresh Token**         | Token opaco de longa duração (7 dias) para renovar access token                    |
| **RFC**                   | Request for Comments — proposta formal de mudança                                  |
| **RLS**                   | Row-Level Security — isolamento de dados no PostgreSQL por linha                   |
| **RS256**                 | Algoritmo JWT usando RSA + SHA-256 (chave assimétrica)                             |
| **RTK**                   | React Toolkit Query — ver TanStack Query                                           |
| **SLA**                   | Service Level Agreement — acordo de nível de serviço (tempo de resposta/resolução) |
| **SLI**                   | Service Level Indicator — métrica que mede qualidade do serviço                    |
| **SLO**                   | Service Level Objective — meta para um SLI                                         |
| **SRS**                   | Spaced Repetition System — algoritmo de repetição espaçada (case study Spell)      |
| **TanStack Query**        | Biblioteca de data fetching e cache para React                                     |
| **Tenant**                | Organização/empresa isolada na plataforma multi-tenant                             |
| **Turborepo**             | Ferramenta de build pipeline e cache para monorepos                                |
| **Use Case**              | Unidade de lógica de aplicação que executa uma ação de negócio                     |
| **WebSocket**             | Protocolo de comunicação bidirecional em tempo real                                |

---

## Referências cruzadas

| Tópico      | Documento                                        |
| ----------- | ------------------------------------------------ |
| Arquitetura | [01-Architecture.md](./01-Architecture.md)       |
| Serviços    | [16-Service-Catalog.md](./16-Service-Catalog.md) |
