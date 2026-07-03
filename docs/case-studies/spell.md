# Case Study — Spell

**Versão:** 1.0  
**Status:** Aprovado  
**Última atualização:** 2026-07-03  
**Tipo:** Projeto anterior (documentação narrativa, sem código)

---

## 1. Problema

Plataformas de ensino de idiomas frequentemente tratam vocabulário como listas estáticas, sem considerar o esquecimento natural ao longo do tempo. Usuários memorizam palavras para provas, mas retêm pouco vocabulário semanas depois. O mercado carecia de uma solução que combinasse repetição espaçada cientificamente fundamentada com experiência de uso fluida e personalizada.

---

## 2. Objetivo

Desenvolver uma aplicação de aprendizado de vocabulário que maximize retenção de longo prazo utilizando algoritmos de repetição espaçada (Spaced Repetition System — SRS), oferecendo experiência personalizada baseada no desempenho individual de cada usuário.

---

## 3. Arquitetura

### 3.1 Visão geral

Spell adotou arquitetura **monólito modular** com separação clara entre domínio de aprendizado, autenticação e conteúdo.

```
┌─────────────────────────────────────────────┐
│              Cliente (Web/Mobile)            │
└─────────────────────┬───────────────────────┘
                      │ HTTPS/REST
┌─────────────────────▼───────────────────────┐
│              API Monolito Modular              │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐ │
│  │  Auth    │ │ Learning │ │   Content    │ │
│  │  Module  │ │  Module  │ │   Module     │ │
│  └──────────┘ └──────────┘ └──────────────┘ │
└─────────────────────┬───────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   PostgreSQL      Redis        File Storage
   (dados)       (cache/SRS)    (mídia)
```

### 3.2 Módulos

| Módulo | Responsabilidade |
|--------|------------------|
| Auth | Registro, login, perfil, preferências |
| Learning | Algoritmo SRS, sessões de estudo, progresso |
| Content | Decks de vocabulário, palavras, traduções, áudio |

---

## 4. Fluxo principal

### 4.1 Sessão de estudo

1. Usuário inicia sessão de estudo para um deck
2. Sistema seleciona palavras devidas para revisão (algoritmo SRS)
3. Apresenta flashcard (palavra → tradução)
4. Usuário avalia dificuldade (fácil, médio, difícil, esqueci)
5. Algoritmo recalcula intervalo de próxima revisão
6. Repete até completar sessão ou esgotar cards devidos
7. Atualiza estatísticas de progresso do usuário

### 4.2 Algoritmo SRS

Baseado no SM-2 (SuperMemo 2) adaptado:

- Cada palavra possui: ease factor, intervalo, repetições, próxima data
- Resposta "fácil" aumenta intervalo exponencialmente
- Resposta "esqueci" reseta intervalo para 1 dia
- Ease factor ajusta velocidade de crescimento do intervalo

---

## 5. Tecnologias

| Camada | Tecnologia |
|--------|------------|
| Backend | Node.js, TypeScript, Express |
| Frontend | React, TypeScript |
| Banco de dados | PostgreSQL |
| Cache | Redis (sessões SRS, cache de decks) |
| Autenticação | JWT |
| Deploy | Docker, VPS |
| Testes | Jest |

---

## 6. Responsabilidades

| Componente | Responsabilidade |
|------------|------------------|
| Auth Module | Identidade, sessões, preferências de estudo |
| Learning Module | SRS, sessões, progresso, estatísticas |
| Content Module | CRUD de decks e palavras, importação |
| Redis | Estado de sessão ativa, cache de cards devidos |
| PostgreSQL | Persistência de usuários, progresso, conteúdo |

---

## 7. Desafios

### 7.1 Precisão do algoritmo SRS

Calibrar o algoritmo para diferentes perfis de usuário (iniciante vs avançado) sem overfitting para um único padrão de estudo.

### 7.2 Performance de seleção de cards

Com milhares de palavras por usuário, selecionar cards devidos rapidamente exigia indexação eficiente e cache em Redis.

### 7.3 Sincronização multi-device

Usuários estudavam em web e mobile; progresso precisava sincronizar sem conflitos de estado.

### 7.4 Importação de conteúdo

Suporte a importação de decks em formatos variados (CSV, Anki) com validação e deduplicação.

---

## 8. Soluções

| Desafio | Solução |
|---------|---------|
| Calibração SRS | Ease factor inicial por nível de proficiência; ajuste dinâmico após 20 revisões |
| Performance | Índice composto (user_id, next_review_date); cache Redis de cards devidos com TTL 5min |
| Multi-device | Last-write-wins com timestamp; sync on login |
| Importação | Pipeline de validação: parse → validate → deduplicate → batch insert |

---

## 9. Resultados

| Métrica | Resultado |
|---------|-----------|
| Retenção após 30 dias | 78% (vs 35% com estudo tradicional) |
| Tempo médio de sessão | 12 minutos |
| Streak médio de usuários ativos | 14 dias |
| Performance de seleção | < 50ms para 10.000 palavras |
| Uptime | 99.2% em 6 meses de operação |

---

## 10. Lições aprendidas

1. **Algoritmo é o produto** — A qualidade do SRS define retenção; investir em calibração e testes A/B de parâmetros.
2. **Cache com invalidação cuidadosa** — Redis acelerou seleção de cards, mas invalidação incorreta causou cards duplicados em sessão.
3. **Monólito modular funciona** — Para escopo inicial, módulos bem definidos evitam complexidade de microsserviços sem sacrificar organização.
4. **Métricas de engajamento** — Streak e progresso visual aumentaram retenção de usuários mais que features adicionais.
5. **Importação é feature killer** — Suporte a Anki/CSV foi o principal driver de aquisição de usuários.

---

## 11. Relação com Portfolio OS

Conceitos do Spell que informam o Portfolio OS:

- Monólito modular como padrão válido (HelpDesk API)
- Redis para cache e estado efêmero
- PostgreSQL com índices compostos para queries frequentes
- Algoritmos de domínio testáveis em isolamento (use cases)
- Métricas de engajamento no Analytics Dashboard
