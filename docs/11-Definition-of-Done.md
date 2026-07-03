# 11 — Definition of Done (DoD)

**Versão:** 1.0  
**Status:** Aprovado  
**Última atualização:** 2026-07-03  
**Relacionado:** [04-Git-Workflow.md](./04-Git-Workflow.md), [05-Testing-Strategy.md](./05-Testing-Strategy.md), [19-Documentation-Standards.md](./19-Documentation-Standards.md)

---

## 1. Objetivo

Definir critérios objetivos e verificáveis para considerar qualquer item de trabalho (backlog item, PR, milestone, release) como concluído no Portfolio OS.

Nenhum item é marcado como Done sem atender todos os critérios aplicáveis ao seu tipo.

---

## 2. DoD — Item de backlog (tarefa)

Todo item BL-XXX do [10-Backlog.md](./10-Backlog.md) só pode ser marcado como **Done** quando:

### 2.1 Código

- [ ] Implementação completa conforme especificação do item
- [ ] Segue [03-Coding-Standards.md](./03-Coding-Standards.md)
- [ ] Sem `any`, `console.log`, secrets hardcoded, código comentado
- [ ] TypeScript strict sem erros
- [ ] ESLint e Prettier passando sem warnings

### 2.2 Testes

- [ ] Testes unitários cobrindo happy path e edge cases principais
- [ ] Testes de integração para endpoints/APIs novos ou alterados
- [ ] Testes E2E atualizados se fluxo de usuário foi afetado
- [ ] Cobertura acima dos thresholds definidos em [05-Testing-Strategy.md](./05-Testing-Strategy.md)
- [ ] Nenhum teste skipped sem issue aberta e justificativa
- [ ] Todos os testes passando localmente e em CI

### 2.3 Revisão

- [ ] Pull request aberto com template preenchido
- [ ] Self-review documentado (checklist do PR)
- [ ] Diff revisado — sem mudanças não relacionadas ao item
- [ ] Aprovação registrada (mesmo em desenvolvimento solo, self-approval documentado)

### 2.4 Documentação

- [ ] README do serviço/pacote atualizado se comportamento mudou
- [ ] OpenAPI/Swagger atualizado se API mudou
- [ ] ADR criado se decisão arquitetural foi tomada
- [ ] Comentários JSDoc em APIs públicas de pacotes compartilhados
- [ ] Backlog item referenciado no PR (`Refs: BL-XXX`)

### 2.5 Build e infraestrutura

- [ ] Build passando (`pnpm turbo build`)
- [ ] Docker build passando para serviços afetados
- [ ] Docker Compose sobe sem erros com o serviço alterado
- [ ] Migrations Prisma incluídas e testadas se schema mudou
- [ ] Variáveis de ambiente documentadas em `.env.example`

### 2.6 CI/CD

- [ ] Pipeline CI verde no PR
- [ ] Nenhum novo warning de segurança (npm audit, CodeQL)
- [ ] Coverage check passando

### 2.7 Observabilidade

- [ ] Logging estruturado via `@portfolio/logger` em novos fluxos
- [ ] Métricas de negócio adicionadas se aplicável
- [ ] Health checks funcionando
- [ ] Erros capturados por Sentry (staging)

---

## 3. DoD — Pull Request

Um PR só pode ser mergeado quando:

- [ ] Todos os critérios de DoD do item de backlog estão atendidos
- [ ] CI verde (lint, typecheck, test, build, coverage)
- [ ] Sem conflitos com branch base
- [ ] Título segue Conventional Commits
- [ ] Tamanho dentro dos limites aceitáveis (ver [04-Git-Workflow.md](./04-Git-Workflow.md))
- [ ] Linked ao backlog item
- [ ] DoD checklist no PR está completo

---

## 4. DoD — Serviço (novo ou completo)

Um microsserviço ou aplicação frontend só é considerado **completo** quando:

### 4.1 Estrutura

- [ ] Estrutura de pastas conforme [15-Monorepo-Structure.md](./15-Monorepo-Structure.md)
- [ ] Clean Architecture (backend) ou Feature-Sliced (frontend)
- [ ] Registrado em [16-Service-Catalog.md](./16-Service-Catalog.md)

### 4.2 Funcionalidade

- [ ] Todos os endpoints/features do escopo implementados
- [ ] Validação de entrada em todos os pontos de entrada
- [ ] Tratamento de erros com exceções de domínio mapeadas
- [ ] Autenticação e autorização implementadas conforme [07-Security.md](./07-Security.md)

### 4.3 Testes

- [ ] Cobertura ≥ 80% (backend) ou ≥ 70% (frontend)
- [ ] Testes de integração com Testcontainers
- [ ] E2E dos fluxos críticos do serviço

### 4.4 Documentação

- [ ] README profissional com: descrição, setup, arquitetura, endpoints, variáveis de ambiente
- [ ] OpenAPI spec completa e publicada
- [ ] ADRs para decisões arquiteturais do serviço
- [ ] Diagrama de componentes

### 4.5 Infraestrutura

- [ ] Dockerfile multi-stage
- [ ] Docker Compose integration
- [ ] CI pipeline dedicado (ou incluso no pipeline monorepo)
- [ ] Health checks live e ready
- [ ] Deploy em staging funcionando

### 4.6 Observabilidade

- [ ] Logger, metrics, tracing, Sentry configurados
- [ ] Dashboard Grafana para o serviço
- [ ] Alertas configurados para métricas críticas

### 4.7 Segurança

- [ ] Security checklist de [07-Security.md](./07-Security.md) completo
- [ ] Rate limiting configurado
- [ ] CORS e security headers configurados
- [ ] Sem vulnerabilidades critical/high em dependências

---

## 5. DoD — Milestone

Um milestone do [09-Roadmap.md](./09-Roadmap.md) só é considerado **completo** quando:

- [ ] Todos os itens de backlog do milestone estão Done
- [ ] Integração entre serviços do milestone validada
- [ ] Deploy em staging do milestone completo
- [ ] Smoke tests passando em staging
- [ ] E2E dos fluxos do milestone passando
- [ ] Documentação do milestone atualizada
- [ ] CHANGELOG atualizado
- [ ] Demo gravada ou screenshots atualizados
- [ ] Retrospectiva documentada (lições aprendidas)

---

## 6. DoD — Release

Uma release (tag v{X.Y.Z}) só é publicada quando:

- [ ] Milestone(s) da release completo(s)
- [ ] Todos os testes passando em staging
- [ ] E2E passando em staging
- [ ] Performance dentro dos SLOs
- [ ] Security audit sem critical/high
- [ ] CHANGELOG completo para a versão
- [ ] Migrations testadas em staging
- [ ] Rollback plan documentado
- [ ] Deploy em production executado
- [ ] Smoke tests passando em production
- [ ] Tag e GitHub Release criados
- [ ] Notificação de release publicada

---

## 7. DoD — Documentação

Um documento de engenharia só é considerado completo quando:

- [ ] Segue [19-Documentation-Standards.md](./19-Documentation-Standards.md)
- [ ] Versão e data de atualização no header
- [ ] Referências cruzadas para documentos relacionados
- [ ] Sem placeholders ou TODOs não resolvidos
- [ ] Revisado quanto a consistência com outros documentos
- [ ] Aprovado (status: Aprovado no header)

---

## 8. DoD — ADR

Um Architecture Decision Record só é considerado completo quando:

- [ ] Segue [templates/adr-template.md](./templates/adr-template.md)
- [ ] Contexto, decisão, consequências e alternativas documentados
- [ ] Status definido (Proposto, Aceito, Depreciado, Substituído)
- [ ] Referenciado nos documentos afetados
- [ ] Armazenado em `docs/adr/`

---

## 9. DoD — RFC

Uma Request for Comments só é considerada completa quando:

- [ ] Segue [templates/rfc-template.md](./templates/rfc-template.md)
- [ ] Problema, proposta, alternativas e plano de implementação documentados
- [ ] Revisada e com status (Rascunho, Em discussão, Aceita, Rejeitada)
- [ ] Se aceita: backlog items criados, ADR gerado se necessário

---

## 10. Exceções

Exceções ao DoD requerem:

1. Justificativa documentada no PR
2. Issue aberta para resolver a exceção
3. Prazo definido para resolução (máximo 1 sprint)
4. Aprovação explícita no PR

Exceções comuns aceitáveis temporariamente:

| Exceção | Prazo máximo |
|---------|--------------|
| Cobertura abaixo do threshold | 1 sprint |
| E2E pendente para feature não-crítica | 1 sprint |
| ADR pendente para decisão em andamento | 2 sprints |
| Dashboard Grafana pendente | 1 sprint |

---

## 11. Referências cruzadas

| Tópico | Documento |
|--------|-----------|
| Git workflow | [04-Git-Workflow.md](./04-Git-Workflow.md) |
| Testes | [05-Testing-Strategy.md](./05-Testing-Strategy.md) |
| DevOps | [06-DevOps.md](./06-DevOps.md) |
| Segurança | [07-Security.md](./07-Security.md) |
| Observabilidade | [08-Observability.md](./08-Observability.md) |
| Documentação | [19-Documentation-Standards.md](./19-Documentation-Standards.md) |
| Backlog | [10-Backlog.md](./10-Backlog.md) |
| Roadmap | [09-Roadmap.md](./09-Roadmap.md) |
