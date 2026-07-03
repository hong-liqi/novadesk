# RFC Template — Request for Comments

**Versão do template:** 1.0

---

## Metadados

| Campo | Valor |
|-------|-------|
| **RFC ID** | RFC-{NNN} |
| **Título** | {Título descritivo da proposta} |
| **Autor** | {Nome} |
| **Status** | Rascunho / Em discussão / Aceita / Rejeitada |
| **Criado em** | {YYYY-MM-DD} |
| **Atualizado em** | {YYYY-MM-DD} |
| **Relacionado** | BL-{XXX}, ADR-{XXX} |

---

## 1. Resumo

{Parágrafo de 2-3 frases descrevendo a proposta e seu impacto.}

---

## 2. Motivação

### 2.1 Problema

{Qual problema esta RFC resolve? Qual dor existe hoje?}

### 2.2 Objetivos

- {Objetivo 1}
- {Objetivo 2}

### 2.3 Não-objetivos

- {O que esta RFC explicitamente NÃO cobre}

---

## 3. Proposta

{Descrição detalhada da solução proposta. Incluir diagramas se necessário.}

### 3.1 Design

{Detalhes técnicos do design.}

### 3.2 Impacto em serviços existentes

| Serviço | Impacto | Mudança necessária |
|---------|---------|-------------------|
| {serviço} | {Alto/Médio/Baixo/Nenhum} | {descrição} |

### 3.3 Impacto em pacotes

| Pacote | Impacto | Mudança necessária |
|--------|---------|-------------------|
| {pacote} | {Alto/Médio/Baixo/Nenhum} | {descrição} |

### 3.4 Impacto em infraestrutura

{Mudanças em Docker, CI/CD, banco, etc.}

---

## 4. Alternativas consideradas

### 4.1 Alternativa A: {nome}

| Prós | Contras |
|------|---------|
| {pró} | {contra} |

### 4.2 Alternativa B: {nome}

| Prós | Contras |
|------|---------|
| {pró} | {contra} |

### 4.3 Alternativa C: Não fazer nada

| Prós | Contras |
|------|---------|
| {pró} | {contra} |

---

## 5. Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| {risco} | {Alta/Média/Baixa} | {Alto/Médio/Baixo} | {mitigação} |

---

## 6. Plano de implementação

### 6.1 Fases

| Fase | Descrição | Duração estimada |
|------|-----------|------------------|
| 1 | {descrição} | {X dias} |
| 2 | {descrição} | {X dias} |

### 6.2 Backlog items

| ID | Descrição | Prioridade |
|----|-----------|------------|
| BL-{XXX} | {descrição} | {P0-P3} |

### 6.3 Migração

{Se aplicável: como migrar do estado atual para o proposto.}

---

## 7. Métricas de sucesso

| Métrica | Baseline | Meta |
|---------|----------|------|
| {métrica} | {valor atual} | {valor alvo} |

---

## 8. Perguntas abertas

- [ ] {Pergunta 1}
- [ ] {Pergunta 2}

---

## 9. Referências

- [Documento relacionado](./link)
- [Referência externa](url)

---

## 10. Histórico de revisão

| Data | Autor | Mudança |
|------|-------|---------|
| {YYYY-MM-DD} | {nome} | Criação |
| {YYYY-MM-DD} | {nome} | {mudança} |

---

## 11. Decisão

| Campo | Valor |
|-------|-------|
| **Decisão** | Aceita / Rejeitada / Adiada |
| **Data** | {YYYY-MM-DD} |
| **Justificativa** | {Por que esta decisão foi tomada} |
| **ADR gerado** | ADR-{XXX} (se aplicável) |
