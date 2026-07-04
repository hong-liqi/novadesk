# Case Study — Teste de Perfil

**Versão:** 1.0  
**Status:** Aprovado  
**Última atualização:** 2026-07-03  
**Tipo:** Projeto anterior (documentação narrativa, sem código)

---

## 1. Problema

Processos de recrutamento técnico frequentemente avaliam candidatos de forma homogênea, sem considerar perfis cognitivos e preferências de trabalho. Testes técnicos tradicionais medem conhecimento, mas não aptidão para papéis específicos (liderança técnica, especialista, generalista, arquiteto). Empresas e candidatos se frustravam com mismatches de perfil que só apareciam meses após a contratação.

---

## 2. Objetivo

Desenvolver uma plataforma de avaliação de perfil profissional que combine questionário psicométrico adaptativo com análise de competências técnicas, gerando relatórios de fit cultural e técnico para candidatos e recrutadores.

---

## 3. Arquitetura

### 3.1 Visão geral

Teste de Perfil adotou arquitetura **modular com engine de regras** para scoring adaptativo.

```
┌──────────────┐     ┌──────────────────────────────────┐
│  Web Client  │────►│           API Server              │
│  (React)     │     │  ┌────────┐ ┌────────┐ ┌───────┐ │
└──────────────┘     │  │  Auth  │ │  Test  │ │Report │ │
                     │  │ Module │ │ Engine │ │Engine │ │
                     │  └────────┘ └────────┘ └───────┘ │
                     └──────────┬───────────────────────┘
                                │
                     ┌──────────▼──────────┐
                     │     PostgreSQL       │
                     │  (users, tests,      │
                     │   results, rules)    │
                     └─────────────────────┘
```

### 3.2 Módulos

| Módulo        | Responsabilidade                                  |
| ------------- | ------------------------------------------------- |
| Auth          | Registro, login, perfis de candidato e recrutador |
| Test Engine   | Aplicação de questionários, scoring adaptativo    |
| Report Engine | Geração de relatórios PDF e visualizações         |
| Admin         | Gestão de questionários, regras e benchmarks      |

---

## 4. Fluxo principal

### 4.1 Avaliação de candidato

1. Candidato recebe link de convite (ou acessa plataforma)
2. Registra-se e inicia avaliação
3. Test Engine apresenta blocos de questões:
   - **Bloco 1:** Preferências de trabalho (escala Likert)
   - **Bloco 2:** Cenários situacionais (múltipla escolha)
   - **Bloco 3:** Autoavaliação de competências técnicas
   - **Bloco 4:** Questões adaptativas baseadas em respostas anteriores
4. Scoring engine calcula perfil em tempo real
5. Adapta blocos subsequentes baseado em respostas (adaptive testing)
6. Ao finalizar, Report Engine gera:
   - Perfil primário (Especialista, Generalista, Líder, Inovador)
   - Radar chart de competências
   - Fit score para roles predefinidos
   - Recomendações de desenvolvimento
7. Recrutador acessa dashboard comparativo

### 4.2 Scoring adaptativo

- Cada resposta atualiza scores parciais em dimensões (liderança, técnica, colaboração, autonomia, inovação)
- Blocos adaptativos selecionam questões que maximizam informação nas dimensões com maior incerteza
- Algoritmo baseado em Item Response Theory (IRT) simplificado

---

## 5. Tecnologias

| Camada         | Tecnologia                              |
| -------------- | --------------------------------------- |
| Backend        | Node.js, TypeScript, NestJS             |
| Frontend       | React, TypeScript, D3.js (radar charts) |
| Banco de dados | PostgreSQL                              |
| PDF Generation | Puppeteer                               |
| Autenticação   | JWT + invite tokens                     |
| Deploy         | Docker, AWS ECS                         |
| Testes         | Jest, Cypress                           |

---

## 6. Responsabilidades

| Componente    | Responsabilidade                                   |
| ------------- | -------------------------------------------------- |
| Auth Module   | Identidade, convites, roles (candidato/recrutador) |
| Test Engine   | Fluxo de questionário, adaptive logic, scoring     |
| Report Engine | Geração de relatórios, visualizações, exportação   |
| Admin Module  | CRUD de questões, regras de scoring, benchmarks    |
| PostgreSQL    | Persistência de testes, resultados, configurações  |

---

## 7. Desafios

### 7.1 Validação psicométrica

Scores precisavam ter validade estatística sem equipe de psicometria dedicada.

### 7.2 Adaptive testing em tempo real

Selecionar próximas questões com latência < 200ms exigia pré-computação de information curves.

### 7.3 Geração de PDF com visualizações

Radar charts e gráficos precisavam renderizar consistentemente em PDF.

### 7.4 Viés de resposta

Candidatos tendiam a responder de forma socialmente desejável, inflando scores.

---

## 8. Soluções

| Desafio                | Solução                                                                             |
| ---------------------- | ----------------------------------------------------------------------------------- |
| Validação psicométrica | Calibração com 200 respondentes piloto; Cronbach's alpha > 0.7 para todas dimensões |
| Adaptive testing       | Pré-computação de information matrix por questão; lookup O(1)                       |
| PDF generation         | Puppeteer renderiza React components; cache de templates                            |
| Viés de resposta       | Questões de validação (faking good detection); normalização de scores               |

---

## 9. Resultados

| Métrica                                            | Resultado         |
| -------------------------------------------------- | ----------------- |
| Tempo médio de avaliação                           | 18 minutos        |
| Consistência test-retest                           | 0.82 (correlação) |
| Satisfação de candidatos                           | 4.2/5             |
| Redução de turnover em 6 meses (empresas piloto)   | 25%               |
| Precisão de fit (validado com performance 6 meses) | 71%               |
| Avaliações completadas vs iniciadas                | 78%               |

---

## 10. Lições aprendidas

1. **Adaptive testing melhora experiência** — Candidatos preferem testes mais curtos e relevantes, mesmo sem saber que é adaptativo.
2. **Visualização é o deliverable** — Radar chart e relatório PDF eram mais valorizados que score numérico.
3. **Calibração é contínua** — Scores precisam recalibração periódica com novos respondentes.
4. **Invite flow importa** — Taxa de conclusão subiu 30% com convite personalizado vs link genérico.
5. **Separar técnico de comportamental** — Misturar questões técnicas e psicométricas no mesmo bloco confundia candidatos.

---

## 11. Relação com Portfolio OS

Conceitos do Teste de Perfil que informam o Portfolio OS:

- Engine de regras como padrão (SLA policies no HelpDesk)
- Relatórios e visualizações (Analytics Dashboard)
- Adaptive UI baseada em contexto (role-based views no Admin Portal)
- Invite flow (convite de usuários no Admin Portal)
- PDF/CSV export (Analytics export)
- Scoring e métricas de negócio (Analytics API)
