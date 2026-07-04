# Case Study — Broom

**Versão:** 1.0  
**Status:** Aprovado  
**Última atualização:** 2026-07-03  
**Tipo:** Projeto anterior (documentação narrativa, sem código)

---

## 1. Problema

Equipes de desenvolvimento e operações enfrentam acúmulo de débito técnico, dependências desatualizadas, vulnerabilidades de segurança e código morto em repositórios. A identificação e priorização manual desses problemas é demorada, inconsistente e frequentemente ignorada até se tornar crítica. Não existia uma ferramenta que automatizasse a "limpeza" de repositórios com inteligência e priorização acionável.

---

## 2. Objetivo

Criar uma ferramenta automatizada de análise e "limpeza" de repositórios de código que identifique débito técnico, dependências vulneráveis, código morto e más práticas, gerando relatórios priorizados e acionáveis para equipes de engenharia.

---

## 3. Arquitetura

### 3.1 Visão geral

Broom adotou arquitetura **pipeline de análise** com processamento assíncrono e plugins extensíveis.

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   CLI / UI   │────►│   API Server  │────►│  Job Queue   │
└──────────────┘     └──────┬───────┘     └──────┬───────┘
                            │                     │
                     ┌──────▼───────┐     ┌───────▼──────┐
                     │  Auth/Users  │     │   Workers    │
                     └──────────────┘     │  (Analyzers) │
                                          └───────┬──────┘
                            ┌─────────────────────┼──────────┐
                            ▼                     ▼          ▼
                       PostgreSQL              Redis     Git Repos
                       (results)             (queue)    (cloned)
```

### 3.2 Componentes

| Componente       | Responsabilidade                               |
| ---------------- | ---------------------------------------------- |
| API Server       | REST API, autenticação, gestão de scans        |
| Job Queue        | Orquestração de análises assíncronas           |
| Workers          | Execução de analyzers em repositórios clonados |
| Analyzer Plugins | Módulos de análise extensíveis                 |
| CLI              | Interface de linha de comando                  |
| Dashboard        | Visualização de resultados e tendências        |

---

## 4. Fluxo principal

### 4.1 Scan de repositório

1. Usuário submete URL do repositório (ou conecta via GitHub OAuth)
2. API valida acesso e enfileira job de análise
3. Worker clona repositório em ambiente isolado (container)
4. Executa pipeline de analyzers sequencialmente:
   - Dependency audit (npm audit, Snyk)
   - Dead code detection (análise estática)
   - Code quality (complexidade ciclomática, duplicação)
   - Security scan (secrets detection, OWASP patterns)
   - Lint violations aggregation
5. Agrega resultados com score de severidade
6. Prioriza findings por impacto × esforço
7. Persiste resultados e notifica usuário
8. Dashboard exibe relatório interativo

### 4.2 Priorização

Score = (Severidade × Impacto) / Esforço estimado

| Severidade | Peso |
| ---------- | ---- |
| Critical   | 10   |
| High       | 7    |
| Medium     | 4    |
| Low        | 1    |

---

## 5. Tecnologias

| Camada         | Tecnologia                 |
| -------------- | -------------------------- |
| Backend        | Python, FastAPI            |
| Workers        | Python, Celery             |
| Frontend       | React, TypeScript          |
| Banco de dados | PostgreSQL                 |
| Fila           | Redis + Celery             |
| Containers     | Docker (isolated analysis) |
| CLI            | Python, Click              |
| CI integration | GitHub Actions plugin      |

---

## 6. Responsabilidades

| Componente         | Responsabilidade                            |
| ------------------ | ------------------------------------------- |
| API Server         | CRUD de scans, auth, webhooks               |
| Celery Workers     | Execução de análises em containers isolados |
| Analyzer Plugins   | Lógica específica de cada tipo de análise   |
| Dashboard          | Visualização, filtros, exportação           |
| CLI                | Interface para desenvolvedores individuais  |
| GitHub Integration | OAuth, webhooks para scans automáticos      |

---

## 7. Desafios

### 7.1 Isolamento de execução

Analisar repositórios de terceiros exigia sandbox seguro — código malicioso em repos analisados não podia afetar o sistema.

### 7.2 Performance em repositórios grandes

Repositórios com 100k+ arquivos exigiam análise incremental e timeout management.

### 7.3 Falsos positivos

Análise estática de código morto gerava muitos falsos positivos em projetos com dynamic imports e reflection.

### 7.4 Integração com múltiplos package managers

Suporte a npm, pip, cargo, go modules com interfaces unificadas.

---

## 8. Soluções

| Desafio          | Solução                                                                          |
| ---------------- | -------------------------------------------------------------------------------- |
| Isolamento       | Docker containers efêmeros com network disabled, read-only filesystem            |
| Performance      | Análise incremental (diff-based), timeout por analyzer (5 min), parallel workers |
| Falsos positivos | Allowlist configurável, confidence score, manual dismiss com aprendizado         |
| Package managers | Plugin architecture com interface comum: detect → parse → audit                  |

---

## 9. Resultados

| Métrica                                     | Resultado           |
| ------------------------------------------- | ------------------- |
| Tempo médio de scan (médio, 5k files)       | 3.5 minutos         |
| Precisão de dead code detection             | 82% (após tuning)   |
| Vulnerabilidades detectadas                 | 94% vs manual audit |
| Redução de débito técnico em equipes piloto | 40% em 3 meses      |
| Falsos positivos após tuning                | < 15%               |

---

## 10. Lições aprendidas

1. **Sandbox é inegociável** — Nunca executar código de repositórios analisados fora de containers isolados.
2. **Priorização > quantidade** — 50 findings priorizados valem mais que 500 alertas sem ordem.
3. **Plugin architecture desde o início** — Novos analyzers foram adicionados sem modificar core.
4. **CI integration é o canal** — GitHub Actions plugin gerou 3x mais uso que dashboard web.
5. **Incremental analysis** — Scan completo a cada commit é inviável; diff-based é essencial.

---

## 11. Relação com NovaDesk

Conceitos do Broom que informam o NovaDesk:

- Pipeline de análise assíncrona (BullMQ workers no NovaDesk)
- Containers isolados para execução (Docker no CI)
- Plugin/extensible architecture (pacotes compartilhados)
- Priorização por severidade (alertas em Observability)
- CI integration (GitHub Actions workflows)
- Security scanning como prática padrão (npm audit, CodeQL)
