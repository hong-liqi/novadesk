# 19 — Padrões de Documentação

**Versão:** 1.0  
**Status:** Aprovado  
**Última atualização:** 2026-07-03  
**Relacionado:** [11-Definition-of-Done.md](./11-Definition-of-Done.md), [00-Vision.md](./00-Vision.md)

---

## 1. Objetivo

Definir padrões para toda documentação do NovaDesk: engenharia, serviços, APIs, ADRs, RFCs, READMEs e comentários inline.

---

## 2. Tipos de documentação

| Tipo               | Localização           | Audiência                           | Atualização                   |
| ------------------ | --------------------- | ----------------------------------- | ----------------------------- |
| Engenharia         | `docs/`               | Desenvolvedores, revisores técnicos | A cada mudança arquitetural   |
| ADR                | `docs/adr/`           | Arquitetos, tech leads              | A cada decisão arquitetural   |
| RFC                | `docs/rfc/`           | Time técnico                        | Durante discussão de proposta |
| README de serviço  | `{service}/README.md` | Desenvolvedores                     | A cada mudança de setup/API   |
| OpenAPI            | `{service}/swagger`   | Desenvolvedores, SDK                | A cada mudança de API         |
| Case studies       | `docs/case-studies/`  | Recrutadores, público               | Estável após publicação       |
| Runbooks           | `docs/21-Runbooks.md` | Operações                           | A cada mudança operacional    |
| CHANGELOG          | `CHANGELOG.md`        | Todos                               | A cada release                |
| Comentários inline | Código fonte          | Desenvolvedores                     | A cada mudança de código      |

---

## 3. Formato padrão de documentos de engenharia

Todo documento em `docs/` segue este header:

```markdown
# {NN} — {Título}

**Versão:** {X.Y}
**Status:** Rascunho | Em revisão | Aprovado | Depreciado
**Última atualização:** {YYYY-MM-DD}
**Relacionado:** [links para documentos relacionados]
```

### 3.1 Seções obrigatórias

| Seção                | Descrição                              |
| -------------------- | -------------------------------------- |
| Objetivo             | Por que este documento existe          |
| Conteúdo principal   | Organizado em seções numeradas         |
| Referências cruzadas | Tabela de links para docs relacionados |

### 3.2 Convenções de escrita

| Regra            | Descrição                                     |
| ---------------- | --------------------------------------------- |
| Idioma           | Português brasileiro para docs de engenharia  |
| Tom              | Técnico, direto, profissional                 |
| Tempo verbal     | Presente                                      |
| Identificadores  | Inglês (nomes de serviços, campos, endpoints) |
| Diagramas        | ASCII ou Mermaid                              |
| Tabelas          | Para dados estruturados e comparações         |
| Sem placeholders | Documentos publicados não contêm TODO ou TBD  |

---

## 4. README de serviço

Todo serviço e app em `services/` e `apps/` possui README.md com:

### 4.1 Estrutura obrigatória

```markdown
# {Service Name}

## Descrição

Breve descrição do serviço e seu papel no ecossistema.

## Arquitetura

Diagrama ou descrição das camadas e módulos.

## Setup local

Passos para rodar o serviço isoladamente.

## Variáveis de ambiente

Tabela com todas as variáveis necessárias.

## API

Link para Swagger UI e resumo dos endpoints principais.

## Testes

Como executar testes unitários e de integração.

## Docker

Como buildar e rodar via Docker.

## Deploy

Notas específicas de deploy.

## ADRs

Links para ADRs relacionados.

## Roadmap

Features planejadas para este serviço.
```

---

## 5. ADRs (Architecture Decision Records)

### 5.1 Quando criar

- Escolha de tecnologia
- Mudança de padrão arquitetural
- Decisão de comunicação entre serviços
- Mudança de schema compartilhado
- Trade-off significativo

### 5.2 Localização

`docs/adr/ADR-{NNN}-{titulo-kebab-case}.md`

### 5.3 Template

Usar [templates/adr-template.md](./templates/adr-template.md).

### 5.4 Lifecycle

```
Proposto → Aceito → [Depreciado → Substituído por ADR-XXX]
```

---

## 6. RFCs (Request for Comments)

### 6.1 Quando criar

- Novo serviço ou pacote
- Mudança significativa de arquitetura
- Novo padrão que afeta múltiplos serviços
- Mudança de stack tecnológica

### 6.2 Localização

`docs/rfc/RFC-{NNN}-{titulo-kebab-case}.md`

### 6.3 Template

Usar [templates/rfc-template.md](./templates/rfc-template.md).

### 6.4 Lifecycle

```
Rascunho → Em discussão → Aceita | Rejeitada
```

RFC aceita gera: backlog items + ADR (se decisão arquitetural).

---

## 7. OpenAPI

- Gerada automaticamente via `@nestjs/swagger` decorators
- Exportada como JSON em build: `dist/openapi.json`
- Publicada em Swagger UI: `/api/docs`
- Versionada junto com o serviço
- Validada em CI (spec não pode regredir)

---

## 8. CHANGELOG

### 8.1 Formato

[Keep a Changelog 1.1.0](https://keepachangelog.com/) com [Semantic Versioning](https://semver.org/).

### 8.2 Categorias

- **Added** — novas features
- **Changed** — mudanças em features existentes
- **Deprecated** — features que serão removidas
- **Removed** — features removidas
- **Fixed** — bug fixes
- **Security** — correções de segurança

### 8.3 Regras

- Atualizado a cada release
- Entradas com referência ao backlog item quando aplicável
- Não documentar mudanças internas que não afetam consumidores

---

## 8. Comentários inline

| Situação                   | Comentário necessário               |
| -------------------------- | ----------------------------------- |
| Regra de negócio não óbvia | Sim — explicar o porquê             |
| Workaround temporário      | Sim — com referência à issue e data |
| Código autoexplicativo     | Não                                 |
| TODO                       | Proibido em `main` — usar issue     |
| JSDoc em pacotes shared    | Obrigatório em exports públicos     |

---

## 9. Diagramas

### 9.1 Ferramentas

| Tipo        | Ferramenta                  |
| ----------- | --------------------------- |
| Arquitetura | ASCII art (docs) ou Mermaid |
| Sequência   | Mermaid sequenceDiagram     |
| Fluxo       | Mermaid flowchart           |
| ER          | Mermaid erDiagram           |
| Infra       | ASCII art                   |

### 9.2 Regras

- Diagramas vivem no documento que os referencia
- Atualizar diagrama quando arquitetura mudar
- Manter consistência de nomes com Service Catalog

---

## 10. Revisão de documentação

### 10.1 Quando revisar

- A cada mudança arquitetural
- A cada release
- Quando inconsistência é detectada
- Quando onboarding de dev revela gaps

### 10.2 Checklist de revisão

- [ ] Consistência entre documentos (nomes, portas, paths)
- [ ] Referências cruzadas válidas
- [ ] Sem informação contraditória
- [ ] Versão e data atualizadas
- [ ] Novos serviços/endpoints refletidos em todos os docs relevantes

---

## 11. Referências cruzadas

| Tópico             | Documento                                                |
| ------------------ | -------------------------------------------------------- |
| Definition of Done | [11-Definition-of-Done.md](./11-Definition-of-Done.md)   |
| ADR template       | [templates/adr-template.md](./templates/adr-template.md) |
| RFC template       | [templates/rfc-template.md](./templates/rfc-template.md) |
| Coding standards   | [03-Coding-Standards.md](./03-Coding-Standards.md)       |
| Índice             | [README.md](./README.md)                                 |
