# NovaDesk — Engineering Documentation

Technical documentation for **NovaDesk**, a full-stack portfolio platform that demonstrates senior-level software engineering: microservices, shared packages, CI/CD, observability, and production deployment.

**Live demo:** [novadesk.li.magicsoft.site](https://novadesk.li.magicsoft.site)

---

## Where to start

| Audience               | Start here                                                                                                                                                 |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Recruiters / reviewers | [00-Vision.md](./00-Vision.md) → [09-Roadmap.md](./09-Roadmap.md) → [case-studies/](./case-studies/)                                                       |
| Backend engineers      | [01-Architecture.md](./01-Architecture.md) → [16-Service-Catalog.md](./16-Service-Catalog.md) → [18-API-Design-Standards.md](./18-API-Design-Standards.md) |
| Frontend engineers     | [02-Tech-Stack.md](./02-Tech-Stack.md) → `packages/ui`, `packages/sdk`                                                                                     |
| DevOps / SRE           | [06-DevOps.md](./06-DevOps.md) → [21-Runbooks.md](./21-Runbooks.md) → [../DEPLOY-CAPROVER.md](../DEPLOY-CAPROVER.md)                                       |

---

## Core documents

| Document                                                   | Purpose                                      |
| ---------------------------------------------------------- | -------------------------------------------- |
| [00-Vision.md](./00-Vision.md)                             | Mission, goals, and design principles        |
| [01-Architecture.md](./01-Architecture.md)                 | System architecture and service boundaries   |
| [02-Tech-Stack.md](./02-Tech-Stack.md)                     | Technologies, versions, and rationale        |
| [15-Monorepo-Structure.md](./15-Monorepo-Structure.md)     | Repository layout and package boundaries     |
| [16-Service-Catalog.md](./16-Service-Catalog.md)           | Service responsibilities and APIs            |
| [17-Data-Architecture.md](./17-Data-Architecture.md)       | Databases, cache, and messaging              |
| [18-API-Design-Standards.md](./18-API-Design-Standards.md) | API conventions and contracts                |
| [03-Coding-Standards.md](./03-Coding-Standards.md)         | Code style and patterns                      |
| [04-Git-Workflow.md](./04-Git-Workflow.md)                 | Branches, commits, and releases              |
| [05-Testing-Strategy.md](./05-Testing-Strategy.md)         | Unit, integration, and E2E testing           |
| [06-DevOps.md](./06-DevOps.md)                             | CI/CD, Docker, and deployment                |
| [07-Security.md](./07-Security.md)                         | Authentication, authorization, and hardening |
| [08-Observability.md](./08-Observability.md)               | Logging, metrics, and tracing                |
| [09-Roadmap.md](./09-Roadmap.md)                           | Milestones and delivery phases               |
| [11-Definition-of-Done.md](./11-Definition-of-Done.md)     | Completion criteria                          |

---

## Supplementary

| Document                                                 | Purpose                                    |
| -------------------------------------------------------- | ------------------------------------------ |
| [adr/](./adr/)                                           | Architecture Decision Records (7 accepted) |
| [20-Glossary.md](./20-Glossary.md)                       | Terminology                                |
| [21-Runbooks.md](./21-Runbooks.md)                       | Operational procedures                     |
| [templates/rfc-template.md](./templates/rfc-template.md) | RFC template                               |
| [templates/adr-template.md](./templates/adr-template.md) | ADR template                               |
| [case-studies/](./case-studies/)                         | Deep dives (Spell, Broom, Teste de Perfil) |

---

## Conventions

- Cross-references use relative paths between documents.
- ADRs live in `docs/adr/` after approval; RFCs in `docs/rfc/` during discussion.
- Service and milestone identifiers are stable across the monorepo.
