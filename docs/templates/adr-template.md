# ADR Template — Architecture Decision Record

**Versão do template:** 1.0

---

## Metadados

| Campo | Valor |
|-------|-------|
| **ADR ID** | ADR-{NNN} |
| **Título** | {Título da decisão} |
| **Status** | Proposto / Aceito / Depreciado / Substituído |
| **Data** | {YYYY-MM-DD} |
| **Autor** | {Nome} |
| **Decisores** | {Nomes ou "Autor"} |
| **RFC relacionada** | RFC-{XXX} (se aplicável) |
| **Substitui** | ADR-{XXX} (se aplicável) |
| **Substituído por** | ADR-{XXX} (se aplicável) |

---

## 1. Contexto

{Qual é a situação que exige uma decisão? Quais forças estão em jogo (técnicas, políticas, econômicas)?}

---

## 2. Decisão

{Qual decisão foi tomada? Use voz ativa: "Adotamos...", "Utilizaremos...", "Rejeitamos..."}

---

## 3. Justificativa

{Por que esta decisão foi tomada em detrimento das alternativas?}

---

## 4. Alternativas consideradas

### 4.1 {Alternativa 1}

| Aspecto | Avaliação |
|---------|-----------|
| Descrição | {o que é} |
| Prós | {vantagens} |
| Contras | {desvantagens} |
| Motivo da rejeição | {por que não foi escolhida} |

### 4.2 {Alternativa 2}

| Aspecto | Avaliação |
|---------|-----------|
| Descrição | {o que é} |
| Prós | {vantagens} |
| Contras | {desvantagens} |
| Motivo da rejeição | {por que não foi escolhida} |

---

## 5. Consequências

### 5.1 Positivas

- {Consequência positiva 1}
- {Consequência positiva 2}

### 5.2 Negativas

- {Consequência negativa 1}
- {Trade-off aceito 2}

### 5.3 Neutras

- {Mudança necessária mas sem impacto claro positivo/negativo}

---

## 6. Impacto

### 6.1 Serviços afetados

| Serviço | Tipo de impacto |
|---------|-----------------|
| {serviço} | {descrição} |

### 6.2 Documentos a atualizar

- [ ] [01-Architecture.md](../01-Architecture.md)
- [ ] [02-Tech-Stack.md](../02-Tech-Stack.md)
- [ ] [16-Service-Catalog.md](../16-Service-Catalog.md)
- [ ] [17-Data-Architecture.md](../17-Data-Architecture.md)
- [ ] {outro documento}

### 6.3 Backlog items gerados

| ID | Descrição |
|----|-----------|
| BL-{XXX} | {descrição} |

---

## 7. Compliance

{Esta decisão está alinhada com os princípios definidos em [00-Vision.md](../00-Vision.md) e [01-Architecture.md](../01-Architecture.md)?}

---

## 8. Referências

- {Link para documentação externa}
- {Link para RFC relacionada}
- {Link para discussão}

---

## 9. Histórico

| Data | Status | Notas |
|------|--------|-------|
| {YYYY-MM-DD} | Proposto | Criação |
| {YYYY-MM-DD} | Aceito | {notas} |
