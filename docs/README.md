# NovaDesk — Documentação de Engenharia

Este diretório contém a documentação técnica completa do **NovaDesk**, ecossistema de engenharia de software projetado para demonstrar maturidade técnica equivalente à de uma startup madura.

A fonte da verdade absoluta do projeto é o arquivo [`NOVADESK_MASTER_SPEC.md`](../NOVADESK_MASTER_SPEC.md) na raiz do repositório. Toda documentação aqui deriva e expande esse documento.

---

## Como usar esta documentação

Desenvolvedores, revisores e agentes de IA devem seguir esta ordem de leitura antes de qualquer implementação:

| Ordem | Documento                                                        | Propósito                                      |
| ----- | ---------------------------------------------------------------- | ---------------------------------------------- |
| 1     | [00-Vision.md](./00-Vision.md)                                   | Missão, objetivos e princípios                 |
| 2     | [01-Architecture.md](./01-Architecture.md)                       | Arquitetura do sistema, serviços e comunicação |
| 3     | [02-Tech-Stack.md](./02-Tech-Stack.md)                           | Tecnologias, versões e justificativas          |
| 4     | [15-Monorepo-Structure.md](./15-Monorepo-Structure.md)           | Estrutura de pastas e boundaries               |
| 5     | [16-Service-Catalog.md](./16-Service-Catalog.md)                 | Catálogo de serviços e responsabilidades       |
| 6     | [17-Data-Architecture.md](./17-Data-Architecture.md)             | Banco de dados, cache e filas                  |
| 7     | [18-API-Design-Standards.md](./18-API-Design-Standards.md)       | Padrões de API e contratos                     |
| 8     | [03-Coding-Standards.md](./03-Coding-Standards.md)               | Padrões de código                              |
| 9     | [19-Documentation-Standards.md](./19-Documentation-Standards.md) | Padrões de documentação                        |
| 10    | [04-Git-Workflow.md](./04-Git-Workflow.md)                       | Branches, commits e releases                   |
| 11    | [05-Testing-Strategy.md](./05-Testing-Strategy.md)               | Estratégia de testes                           |
| 12    | [06-DevOps.md](./06-DevOps.md)                                   | CI/CD, Docker e deploy                         |
| 13    | [07-Security.md](./07-Security.md)                               | Segurança e autenticação                       |
| 14    | [08-Observability.md](./08-Observability.md)                     | Logging, métricas e tracing                    |
| 15    | [11-Definition-of-Done.md](./11-Definition-of-Done.md)           | Critérios de conclusão                         |
| 16    | [09-Roadmap.md](./09-Roadmap.md)                                 | Fases e milestones                             |
| 17    | [10-Backlog.md](./10-Backlog.md)                                 | Backlog detalhado                              |

---

## Documentos complementares

| Documento                                                | Propósito                                       |
| -------------------------------------------------------- | ----------------------------------------------- |
| [20-Glossary.md](./20-Glossary.md)                       | Glossário de termos                             |
| [21-Runbooks.md](./21-Runbooks.md)                       | Procedimentos operacionais                      |
| [templates/rfc-template.md](./templates/rfc-template.md) | Template para RFCs                              |
| [templates/adr-template.md](./templates/adr-template.md) | Template para ADRs                              |
| [case-studies/](./case-studies/)                         | Estudos de caso (Spell, Broom, Teste de Perfil) |

---

## Fluxo de trabalho do agente

Conforme definido na especificação mestra, nenhuma implementação deve ocorrer sem passar pelas fases documentadas:

1. **Arquitetura** — validar contra [01-Architecture.md](./01-Architecture.md)
2. **RFC** — usar [templates/rfc-template.md](./templates/rfc-template.md) para mudanças significativas
3. **Backlog** — referenciar [10-Backlog.md](./10-Backlog.md)
4. **Implementação** — seguir [03-Coding-Standards.md](./03-Coding-Standards.md)
5. **Testes** — seguir [05-Testing-Strategy.md](./05-Testing-Strategy.md)
6. **Documentação** — seguir [19-Documentation-Standards.md](./19-Documentation-Standards.md)
7. **Refatoração** — manter cobertura e ADRs atualizados
8. **Deploy** — seguir [06-DevOps.md](./06-DevOps.md)

---

## Convenções desta documentação

- Referências cruzadas usam caminhos relativos entre documentos.
- Identificadores de serviços, milestones e tarefas são estáveis e reutilizados em todo o ecossistema.
- ADRs ficam em `docs/adr/` após aprovação; RFCs em `docs/rfc/` durante discussão.
- Versão atual da documentação: **1.0** — alinhada à especificação mestra v1.0.

---

## Contato e governança

Decisões arquiteturais significativas exigem ADR. Mudanças de escopo exigem atualização do roadmap e backlog. A governança do repositório está descrita em [04-Git-Workflow.md](./04-Git-Workflow.md) e [11-Definition-of-Done.md](./11-Definition-of-Done.md).
