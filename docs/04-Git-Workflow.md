# 04 — Git Workflow

**Versão:** 1.0  
**Status:** Aprovado  
**Última atualização:** 2026-07-03  
**Relacionado:** [03-Coding-Standards.md](./03-Coding-Standards.md), [06-DevOps.md](./06-DevOps.md), [11-Definition-of-Done.md](./11-Definition-of-Done.md)

---

## 1. Objetivo

Definir o fluxo de trabalho Git, estratégia de branches, convenções de commit, processo de pull request e estratégia de releases para o monorepo Portfolio OS.

---

## 2. Repositório

| Propriedade | Valor |
|-------------|-------|
| Plataforma | GitHub |
| Estrutura | Monorepo único |
| Branch padrão | `main` |
| Branch de desenvolvimento | `develop` (opcional para features isoladas) |
| Proteção de branch | `main` protegida — merge apenas via PR com CI verde |

---

## 3. Estratégia de branches

Adotamos **Trunk-Based Development** com feature branches de curta duração, complementado por **GitFlow simplificado** para releases.

### 3.1 Tipos de branch

| Prefixo | Propósito | Base | Merge em | Lifetime máximo |
|---------|-----------|------|----------|-----------------|
| `main` | Produção estável | — | — | Permanente |
| `develop` | Integração contínua | `main` | `main` (release) | Permanente |
| `feat/` | Nova funcionalidade | `develop` | `develop` | 3 dias |
| `fix/` | Correção de bug | `develop` ou `main` | `develop` ou `main` | 1 dia |
| `hotfix/` | Correção urgente em produção | `main` | `main` + `develop` | 4 horas |
| `chore/` | Manutenção, deps, tooling | `develop` | `develop` | 2 dias |
| `docs/` | Apenas documentação | `develop` | `develop` | 2 dias |
| `refactor/` | Refatoração sem mudança de comportamento | `develop` | `develop` | 3 dias |
| `test/` | Adição/melhoria de testes | `develop` | `develop` | 2 dias |
| `release/` | Preparação de release | `develop` | `main` + `develop` | 1 dia |

### 3.2 Nomenclatura de branches

Formato: `{prefixo}/{ticket-id}-{descricao-curta}`

Exemplos:
- `feat/BL-042-auth-service-login-endpoint`
- `fix/BL-189-helpdesk-ticket-pagination`
- `hotfix/BL-201-jwt-expiration-bug`
- `docs/BL-015-architecture-update`

O `ticket-id` referencia item em [10-Backlog.md](./10-Backlog.md).

### 3.3 Regras de branch

1. Branches de feature devem ser rebased em `develop` antes do merge
2. Não fazer merge de `develop` em feature branch com mais de 50 commits de diferença — criar nova branch
3. Deletar branch após merge
4. Um PR por feature lógica — PRs grandes (> 500 linhas) devem ser divididos
5. Hotfix sempre mergeado em `main` E `develop`

---

## 4. Conventional Commits

Todo commit segue [Conventional Commits 1.0.0](https://www.conventionalcommits.org/).

### 4.1 Formato

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### 4.2 Types permitidos

| Type | Uso |
|------|-----|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Apenas documentação |
| `style` | Formatação, sem mudança de lógica |
| `refactor` | Refatoração sem feat/fix |
| `perf` | Melhoria de performance |
| `test` | Adição ou correção de testes |
| `build` | Build system, dependências |
| `ci` | CI/CD |
| `chore` | Manutenção geral |
| `revert` | Revert de commit anterior |

### 4.3 Scopes

Scopes correspondem a pacotes e serviços:

`auth`, `gateway`, `notification`, `helpdesk`, `analytics`, `chat`, `admin`, `website`, `ui`, `sdk`, `shared`, `logger`, `config`, `infra`, `docs`, `deps`

### 4.4 Regras

- Description em inglês, imperativo, lowercase, sem ponto final
- Máximo 72 caracteres na primeira linha
- Body opcional para contexto adicional
- Footer `BREAKING CHANGE:` para breaking changes
- Footer `Refs: BL-XXX` para referenciar backlog item
- Footer `Closes: #XXX` para issues GitHub

### 4.5 Exemplos válidos

```
feat(auth): add refresh token rotation
fix(helpdesk): correct ticket status transition
docs(architecture): update service communication diagram
ci(infra): add auth-service pipeline
chore(deps): update prisma to 5.15.0
```

### 4.6 Enforcement

- Husky `commit-msg` hook com commitlint
- Configuração em `commitlint.config.js` na raiz

---

## 5. Pull Request Process

### 5.1 Antes de abrir PR

- [ ] Branch atualizada com base (rebase)
- [ ] Todos testes passando localmente
- [ ] Lint e typecheck passando
- [ ] Self-review do diff
- [ ] Documentação atualizada
- [ ] Backlog item referenciado

### 5.2 Template de PR

Todo PR utiliza template em `.github/pull_request_template.md`:

- Descrição da mudança
- Tipo (feat/fix/docs/chore)
- Backlog reference (BL-XXX)
- Checklist DoD
- Screenshots (se UI)
- Notas para reviewer

### 5.3 Requisitos de merge

| Requisito | Obrigatório |
|-----------|-------------|
| CI verde | Sim |
| 1 aprovação | Sim (self-review documentado para solo dev) |
| Sem conflitos | Sim |
| Conventional commits no PR (squash) | Sim |
| Linked backlog item | Sim |
| DoD checklist completo | Sim |

### 5.4 Estratégia de merge

- **Squash merge** para feature branches → `develop`
- **Merge commit** para `release/*` → `main`
- Título do squash = commit message Conventional Commit

### 5.5 Tamanho de PR

| Tamanho | Linhas alteradas | Ação |
|---------|------------------|------|
| XS | < 50 | Ideal |
| S | 50-200 | Bom |
| M | 200-500 | Aceitável |
| L | 500-1000 | Requer justificativa |
| XL | > 1000 | Deve ser dividido |

---

## 6. Versionamento e releases

### 6.1 Semantic Versioning

O monorepo usa **Semantic Versioning 2.0.0** para releases da plataforma:

```
MAJOR.MINOR.PATCH
```

| Incremento | Quando |
|------------|--------|
| MAJOR | Breaking changes em APIs públicas ou SDK |
| MINOR | Novas features backward-compatible |
| PATCH | Bug fixes backward-compatible |

### 6.2 Versionamento por pacote

Pacotes em `packages/` possuem versão independente quando publicados. Serviços e apps seguem versão da plataforma.

### 6.3 Processo de release

1. Criar branch `release/v{X.Y.Z}` a partir de `develop`
2. Atualizar CHANGELOG.md
3. Atualizar versão em `package.json` root
4. PR para `main` com tag após merge
5. Merge `main` back para `develop`
6. Deploy automático via GitHub Actions

### 6.4 Tags

Formato: `v{X.Y.Z}`

Tags criadas automaticamente pelo pipeline de release.

### 6.5 CHANGELOG

Segue [Keep a Changelog 1.1.0](https://keepachangelog.com/).

Categorias: Added, Changed, Deprecated, Removed, Fixed, Security.

---

## 7. Git hooks (Husky)

| Hook | Ação |
|------|------|
| `pre-commit` | lint-staged (ESLint + Prettier em arquivos staged) |
| `commit-msg` | commitlint (Conventional Commits) |
| `pre-push` | typecheck do escopo afetado (via Turborepo) |

---

## 8. Monorepo — detecção de escopo

Turborepo detecta pacotes afetados por diff. CI executa apenas pipelines dos pacotes/serviços alterados e seus dependentes.

Configuração em `turbo.json` na raiz.

---

## 9. Resolução de conflitos

1. Rebase da feature branch em `develop`
2. Resolver conflitos localmente
3. Executar testes após resolução
4. Force push da feature branch (nunca de `main` ou `develop`)
5. Re-request review se conflitos eram significativos

---

## 10. Governança de mudanças arquiteturais

| Tipo de mudança | Processo |
|-----------------|----------|
| Bug fix localizado | PR normal |
| Nova feature em serviço existente | PR + backlog item |
| Novo serviço ou pacote | RFC + ADR + PR |
| Mudança de stack | ADR + RFC + atualização de docs |
| Breaking change em API | ADR + bump MAJOR + deprecation notice |
| Mudança de schema compartilhado | RFC + migration plan |

Templates: [templates/rfc-template.md](./templates/rfc-template.md), [templates/adr-template.md](./templates/adr-template.md).

---

## 11. Política de revert

- Revert via `git revert` (nunca rewrite de `main`)
- Commit de revert segue Conventional Commits: `revert(scope): revert "feat(scope): description"`
- Hotfix branch para correção definitiva após revert

---

## 12. Acesso e permissões

| Branch | Push direto | Merge via PR |
|--------|-------------|--------------|
| `main` | Proibido | Obrigatório |
| `develop` | Proibido | Obrigatório |
| Feature branches | Permitido (autor) | — |

---

## 13. Referências cruzadas

| Tópico | Documento |
|--------|-----------|
| Coding standards | [03-Coding-Standards.md](./03-Coding-Standards.md) |
| CI/CD | [06-DevOps.md](./06-DevOps.md) |
| Definition of Done | [11-Definition-of-Done.md](./11-Definition-of-Done.md) |
| Roadmap | [09-Roadmap.md](./09-Roadmap.md) |
| Backlog | [10-Backlog.md](./10-Backlog.md) |
