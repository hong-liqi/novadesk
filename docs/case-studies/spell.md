# Case Study — Spell

**Versão:** 2.0  
**Status:** Aprovado  
**Última atualização:** 2026-07-06  
**Tipo:** Projeto anterior (documentação narrativa, sem código)

---

## 1. Problema

Empresas brasileiras dependem do WhatsApp e do Instagram para atendimento, mas responder manualmente não escala: filas crescem, horários ficam descobertos e respostas inconsistentes prejudicam conversão. Soluções genéricas de chatbot frequentemente inventam informações ou ignoram a base de conhecimento do negócio. O mercado precisava de um atendente automatizado nas APIs oficiais da Meta, com handoff confiável para humanos quando necessário.

---

## 2. Objetivo

Construir um SaaS multi-tenant que automatize atendimento em WhatsApp e Instagram com IA fundamentada na base de conhecimento do cliente (RAG), handoff para atendentes humanos, fluxos visuais configuráveis, agendamento e billing integrado — tudo gerenciável por um painel web.

---

## 3. Arquitetura

### 3.1 Visão geral

Spell adotou um **monorepo de três serviços** com banco compartilhado e comunicação interna entre server e panel-api.

```
┌─────────────┐  ┌─────────────┐
│  WhatsApp   │  │  Instagram  │
│  (Meta API) │  │  (Meta API) │
└──────┬──────┘  └──────┬──────┘
       │                │
       └────────┬───────┘
                ▼
       ┌────────────────┐
       │  spell-server  │  webhooks, motor do bot, worker
       └────────┬───────┘
                │
       ┌────────▼───────┐     ┌──────────────┐
       │  PostgreSQL    │◄────│ panel-api    │
       │  + pgvector    │     │ (gestão)     │
       └────────────────┘     └──────┬───────┘
                                     │
                              ┌──────▼───────┐
                              │ spell-panel  │
                              │ (React SPA)  │
                              └──────────────┘
```

### 3.2 Serviços

| Serviço   | Responsabilidade                                               |
| --------- | -------------------------------------------------------------- |
| server    | Webhooks Meta, motor RAG/visual, handoff, worker de background |
| panel-api | Auth, admin, KB, agentes, billing, integrações, API pública    |
| panel     | Interface React para tenants e administradores da plataforma   |

---

## 4. Fluxo principal

### 4.1 Mensagem inbound no WhatsApp

1. Meta envia webhook para `spell-server`
2. Servidor resolve tenant pelo `phoneNumberId` do canal
3. Carrega ou cria sessão de handoff para o cliente
4. Se **HUMAN_ACTIVE** → repassa mensagens entre cliente e atendente
5. Se **BOT_ACTIVE** → roteia por modo do tenant:
   - **KB:** embed da pergunta → busca vetorial (pgvector) → geração OpenAI com verificador
   - **Visual:** interpreta nós do fluxo (mensagem, opções, coleta, agendamento, timer)
6. Se cliente pede humano → fan-out de ofertas para agentes disponíveis via templates WhatsApp

### 4.2 Base de conhecimento (RAG)

- Documentos (PDF, DOCX, XLSX, texto) fragmentados e embedados via OpenAI
- Busca por similaridade de cosseno em `KnowledgeChunk.embedding`
- Guardrails: respostas só a partir da base; loop de verificação antes de enviar
- Múltiplos fluxos de KB com system prompts por tenant

### 4.3 Handoff humano

Estados: `BOT_ACTIVE` → `HANDOFF_PENDING` → `HUMAN_ACTIVE` → `CLOSED`

- Ofertas enviadas a múltiplos agentes; primeiro a aceitar assume
- Templates WhatsApp provisionados automaticamente para janela fora das 24h
- Worker fecha sessões inativas e reenvia ofertas

---

## 5. Tecnologias

| Camada         | Tecnologia                                    |
| -------------- | --------------------------------------------- |
| Backend        | Node.js 20, TypeScript, Fastify 4, Prisma 6   |
| Frontend       | React 18, Vite 5, React Router, @xyflow/react |
| Banco de dados | PostgreSQL 16 com extensão pgvector           |
| IA             | OpenAI (gpt-4o-mini, text-embedding-3-small)  |
| Canais         | WhatsApp Cloud API, Instagram Messaging API   |
| Pagamentos     | Stripe, Mercado Pago, PIX manual              |
| Calendário     | Google Calendar OAuth, Calendly               |
| Deploy         | Docker, CapRover (spelltalk.com.br)           |

---

## 6. Responsabilidades

| Componente   | Responsabilidade                                    |
| ------------ | --------------------------------------------------- |
| spell-server | Webhooks, RAG, fluxos visuais, handoff, worker      |
| panel-api    | CRUD de tenants, KB, agentes, billing, integrações  |
| spell-panel  | UI de tenant (KB, fluxos, conversas, setup) e admin |
| pgvector     | Embeddings e retrieval semântico                    |
| Meta APIs    | Entrega de mensagens WhatsApp/Instagram oficiais    |

---

## 7. Desafios

### 7.1 Respostas alinhadas à base de conhecimento

IA genérica inventa preços e políticas; o produto exige RAG com verificador e guardrails rígidos.

### 7.2 Handoff fora da janela de 24h do WhatsApp

Relay humano depende de templates aprovados pela Meta, provisionados por tenant.

### 7.3 Restrições da plataforma Meta

Instagram em modo desenvolvimento, revisão de permissões (`instagram_manage_comments`), limite de respostas públicas por comentário.

### 7.4 Multi-tenant com billing

Pacotes limitam agentes, conversas/mês, entradas na KB e nós de fluxo visual — entitlements precisam refletir no comportamento do bot.

### 7.5 Deploy com três branches

CapRover exige `captain-definition` separados por app (server, panel-api, panel) com branches de deploy distintas.

---

## 8. Soluções

| Desafio           | Solução                                                                |
| ----------------- | ---------------------------------------------------------------------- |
| Alucinação        | RAG com top-k + score mínimo + verificador de resposta antes do envio  |
| Handoff           | Templates automáticos + worker de retry + relay bidirecional           |
| Instagram         | Fluxos visuais com trigger por comentário; DM como continuação         |
| Entitlements      | `package-entitlements.ts` compartilhado entre server e panel-api       |
| Agendamento na KB | `spell-resource-router` decide quando buscar slots de calendário vs KB |

---

## 9. Resultados

O Spell está em produção em `panel.spelltalk.com.br`, `api.spelltalk.com.br` e `server.spelltalk.com.br`, com deploy white-label adicional (ex.: `spellserver.projetovendermais.com.br`).

Métricas operacionais disponíveis no painel (conversas/dia, clientes atendidos), mas **não há KPIs de negócio publicados no repositório**. Logs de produção mostram atendimento real em tenants (ex.: telemedicina com precificação e agendamento via RAG).

---

## 10. Lições aprendidas

1. **RAG com verificador é o diferencial** — Respostas ancoradas na base valem mais que um modelo mais capaz sem guardrails.
2. **Handoff é feature, não fallback** — Templates, relay e worker são tão críticos quanto o bot.
3. **Meta manda nas regras** — Permissões, janelas de 24h e revisão de app impactam roadmap diretamente.
4. **Fluxos visuais complementam KB** — Nem todo atendimento é Q&A; coleta de dados e agendamento precisam de automação estruturada.
5. **Monorepo de três serviços** — Separação entre motor de bot e painel facilita deploy e escala independente.

---

## 11. Relação com NovaDesk

Conceitos do Spell que informam o NovaDesk:

- Multi-tenancy com isolamento por tenant (Auth Service, HelpDesk)
- Filas e workers para tarefas assíncronas (Notification Service, BullMQ)
- RAG e IA como padrão de extensibilidade (futuro no HelpDesk)
- Billing e pacotes por entitlements (modelo de SaaS)
- Integrações via webhooks e API keys (padrão de extensão da plataforma)
