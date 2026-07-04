# 00 — Visão do NovaDesk

**Versão:** 1.0  
**Status:** Aprovado  
**Última atualização:** 2026-07-03  
**Relacionado:** [NOVADESK_MASTER_SPEC.md](../NOVADESK_MASTER_SPEC.md), [01-Architecture.md](./01-Architecture.md), [09-Roadmap.md](./09-Roadmap.md)

---

## 1. Missão

Construir um ecossistema completo de engenharia de software que demonstre capacidade técnica equivalente à de um **Software Engineer Sênior**, com qualidade, organização e maturidade comparáveis à de uma **startup madura**.

O NovaDesk não é uma coleção de projetos isolados. É uma **plataforma integrada** onde serviços, aplicações e pacotes compartilhados coexistem sob governança unificada, observabilidade centralizada e pipelines de entrega consistentes.

---

## 2. Problema que resolvemos

Portfólios tradicionais de desenvolvedores apresentam limitações estruturais:

- Projetos desconectados sem narrativa arquitetural coerente
- Ausência de práticas de produção (CI/CD, observabilidade, segurança)
- Documentação superficial ou inexistente
- Código tutorial sem testes, sem contratos de API e sem estratégia de deploy
- Impossibilidade de avaliar maturidade técnica sem acesso ao código

O NovaDesk resolve isso ao funcionar como um **produto real em escala reduzida**: múltiplos domínios de negócio, microsserviços com boundaries claros, frontend moderno, infraestrutura containerizada e documentação que permite avaliação externa sem acesso ao código proprietário.

---

## 3. Objetivos estratégicos

### 3.1 Objetivo primário

Permitir que um recrutador, tech lead ou engenheiro avaliem, exclusivamente via documentação e artefatos públicos:

| Dimensão                | O que deve ser demonstrável                       |
| ----------------------- | ------------------------------------------------- |
| Qualidade de código     | Padrões, testes, revisão, lint                    |
| Capacidade arquitetural | Decisões documentadas, boundaries, escalabilidade |
| Organização             | Monorepo estruturado, convenções claras           |
| Documentação            | ADRs, RFCs, runbooks, APIs documentadas           |
| Maturidade técnica      | CI/CD, Docker, observabilidade, segurança         |
| Comunicação             | Case studies, narrativa de problemas e soluções   |
| Experiência prática     | Sistemas integrados em produção simulada          |

### 3.2 Objetivos técnicos

Demonstrar domínio em:

- Arquitetura de sistemas distribuídos e monólito modular
- Backend com NestJS, Prisma e PostgreSQL
- Frontend com Next.js, React e ecossistema moderno
- APIs REST documentadas com OpenAPI/Swagger
- Microsserviços com comunicação síncrona e assíncrona
- Cache com Redis e filas com BullMQ
- DevOps com Docker, GitHub Actions e Nginx
- Observabilidade com logging estruturado, métricas e tracing
- Segurança com autenticação centralizada e autorização por escopo
- Testes em múltiplas camadas (unitário, integração, E2E)
- Performance e escalabilidade horizontal

---

## 4. Escopo do ecossistema

### 4.1 Aplicações integradas

| ID     | Aplicação            | Domínio                                   |
| ------ | -------------------- | ----------------------------------------- |
| APP-01 | Auth Service         | Identidade, autenticação e autorização    |
| APP-02 | API Gateway          | Roteamento, rate limiting, terminação TLS |
| APP-03 | Notification Service | E-mail, push e notificações em tempo real |
| APP-04 | HelpDesk SaaS        | Tickets, SLA, atendimento ao cliente      |
| APP-05 | Analytics Dashboard  | Métricas, relatórios e visualizações      |
| APP-06 | Realtime Chat        | Mensagens em tempo real                   |
| APP-07 | Admin Portal         | Gestão centralizada da plataforma         |
| APP-08 | NovaDesk Website     | Site público do portfólio                 |

Detalhamento em [16-Service-Catalog.md](./16-Service-Catalog.md).

### 4.2 Pacotes compartilhados

Pacotes em `packages/`: `ui`, `config`, `eslint`, `typescript`, `shared`, `logger`, `auth`, `sdk`.

Detalhamento em [15-Monorepo-Structure.md](./15-Monorepo-Structure.md).

### 4.3 Case studies

Documentação narrativa (sem código) para projetos anteriores:

- Spell
- Broom
- Teste de Perfil

Detalhamento em [case-studies/](./case-studies/).

### 4.4 Fora de escopo (v1.0)

- Multi-região ativa com failover automático
- Kubernetes em produção (planejado para fase futura)
- Billing e pagamentos reais
- Conformidade formal (SOC2, ISO 27001) — apenas práticas alinhadas
- Mobile nativo (iOS/Android)

---

## 5. Princípios fundamentais

Estes princípios derivam das regras absolutas da especificação mestra e governam todas as decisões:

### 5.1 Arquitetura antes de código

Nenhum código é produzido sem arquitetura documentada, RFC quando aplicável e item de backlog referenciado. Ver [01-Architecture.md](./01-Architecture.md) e fluxo em [README.md](./README.md).

### 5.2 Propósito em cada artefato

Todo arquivo, serviço e pacote possui responsabilidade única e documentada. Artefatos órfãos ou gerados sem necessidade são proibidos.

### 5.3 Rejeição de soluções tutorial

Padrões de produção são obrigatórios: injeção de dependência, tratamento de erros estruturado, validação de entrada, testes automatizados, health checks e graceful shutdown.

### 5.4 Manutenibilidade como prioridade

Código legível, boundaries explícitos, dependências mínimas e documentação viva. Refatoração contínua é esperada, não excepcional.

### 5.5 Testabilidade universal

Todo código de negócio deve ser testável em isolamento. Dependências externas são mockadas ou substituídas por testcontainers em testes de integração. Ver [05-Testing-Strategy.md](./05-Testing-Strategy.md).

### 5.6 APIs documentadas

Toda API REST expõe especificação OpenAPI. Contratos são versionados e breaking changes seguem política de deprecação. Ver [18-API-Design-Standards.md](./18-API-Design-Standards.md).

### 5.7 CI obrigatório

Todo serviço e pacote possui pipeline de CI que executa lint, testes, build e análise de segurança. Ver [06-DevOps.md](./06-DevOps.md).

### 5.8 Containerização obrigatória

Todo serviço possui Dockerfile multi-stage e integração com Docker Compose para desenvolvimento local. Ver [06-DevOps.md](./06-DevOps.md).

### 5.9 Conventional Commits

Todo commit segue Conventional Commits. Ver [04-Git-Workflow.md](./04-Git-Workflow.md).

### 5.10 Production-ready por padrão

Configuração por ambiente, secrets externalizados, health checks, logging estruturado e observabilidade desde o primeiro deploy.

---

## 6. Stakeholders e personas

### 6.1 Stakeholder primário

O próprio autor do portfólio — responsável por arquitetura, implementação, documentação e narrativa técnica.

### 6.2 Personas de avaliação

| Persona                     | Interesse                | Artefatos relevantes                |
| --------------------------- | ------------------------ | ----------------------------------- |
| Recrutador técnico          | Maturidade e organização | Vision, Roadmap, Case Studies       |
| Tech Lead                   | Arquitetura e decisões   | Architecture, ADRs, Service Catalog |
| Engenheiro backend          | APIs e serviços          | API Standards, Data Architecture    |
| Engenheiro frontend         | UX e integração          | Tech Stack, SDK, UI package         |
| DevOps/SRE                  | Infra e operação         | DevOps, Observability, Runbooks     |
| Agente de IA (Cursor, etc.) | Instruções executáveis   | Toda documentação + Master Spec     |

---

## 7. Métricas de sucesso

### 7.1 Métricas de produto (portfólio)

| Métrica                          | Meta v1.0                         |
| -------------------------------- | --------------------------------- |
| Serviços em produção simulada    | 8/8 integrados                    |
| Cobertura de testes (backend)    | ≥ 80% linhas em serviços críticos |
| Cobertura de testes (frontend)   | ≥ 70% componentes críticos        |
| APIs com OpenAPI                 | 100%                              |
| Serviços com CI verde            | 100%                              |
| ADRs para decisões arquiteturais | ≥ 15                              |
| Case studies completos           | 3/3                               |
| Tempo para onboarding de dev     | ≤ 2 dias apenas com docs          |

### 7.2 Métricas operacionais (plataforma simulada)

| Métrica                       | Meta                                  |
| ----------------------------- | ------------------------------------- |
| Uptime em ambiente de staging | ≥ 99.5%                               |
| P95 latência API Gateway      | ≤ 200ms (excluindo operações pesadas) |
| Tempo de build CI (monorepo)  | ≤ 15 min                              |
| Tempo de deploy               | ≤ 10 min                              |

---

## 8. Restrições e premissas

### 8.1 Restrições

- Linguagem única: TypeScript em todo o stack
- Banco relacional principal: PostgreSQL
- Repositório único (monorepo)
- Hospedagem inicial: VPS ou PaaS com Docker (sem Kubernetes na v1.0)
- Orçamento: infraestrutura de baixo custo adequada a portfólio

### 8.2 Premissas

- Desenvolvimento individual com revisão assistida por IA
- Tráfego baixo a moderado (portfólio, não produto comercial em escala)
- Dados sintéticos ou anonimizados em ambientes não-produção
- GitHub como plataforma de código e CI

---

## 9. Visão de longo prazo

Após a v1.0 do ecossistema integrado:

1. **v1.1** — Hardening de segurança, penetration testing documentado, WAF
2. **v1.2** — Kubernetes local (kind/k3s) e Helm charts
3. **v2.0** — Multi-tenancy completo no HelpDesk, billing simulado
4. **v2.1** — Feature flags, A/B testing no Analytics
5. **v3.0** — Open source seletivo de pacotes (`sdk`, `ui`, `logger`)

Roadmap detalhado em [09-Roadmap.md](./09-Roadmap.md).

---

## 10. Relação com outros documentos

| Documento                                              | Relação                                  |
| ------------------------------------------------------ | ---------------------------------------- |
| [01-Architecture.md](./01-Architecture.md)             | Como a visão se materializa tecnicamente |
| [02-Tech-Stack.md](./02-Tech-Stack.md)                 | Tecnologias que habilitam a visão        |
| [09-Roadmap.md](./09-Roadmap.md)                       | Sequência de entrega                     |
| [10-Backlog.md](./10-Backlog.md)                       | Trabalho granular                        |
| [11-Definition-of-Done.md](./11-Definition-of-Done.md) | Critérios de conclusão                   |
| [case-studies/](./case-studies/)                       | Narrativa de experiência prévia          |

---

## 11. Aprovação

Este documento está aprovado como base para início do desenvolvimento. Alterações de escopo exigem atualização sincronizada de Architecture, Roadmap e Backlog.
