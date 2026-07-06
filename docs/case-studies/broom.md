# Case Study — Broom

**Versão:** 2.0  
**Status:** Aprovado  
**Última atualização:** 2026-07-06  
**Tipo:** Projeto anterior (documentação narrativa, sem código)

---

## 1. Problema

Marcas regionais de mobilidade urbana (táxi, mototáxi, transporte por app) precisam oferecer corrida sob demanda, mas construir uma plataforma completa — apps de passageiro e motorista, painel operacional, pagamentos, notificações — é caro e demorado. Cada cidade ou franquia quer sua própria marca, canais de atendimento e regras de preço, sem manter um codebase separado por operação.

---

## 2. Objetivo

Criar uma plataforma white-label de ride-hailing que permita a operadoras lançarem serviços estilo Uber com marca própria, múltiplos canais (app, WhatsApp, central telefônica) e gestão centralizada de franquias, motoristas e corridas.

---

## 3. Arquitetura

### 3.1 Visão geral

Broom (instância da plataforma **Brasil Machine**) adota um **monorepo multi-app** com API GraphQL central e clientes React Native + painel web.

```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ Passenger App    │  │ Driver App       │  │ Painel Admin     │
│ (React Native)   │  │ (React Native)   │  │ (React + Prime)  │
└────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘
         │                     │                     │
         └─────────────────────┼─────────────────────┘
                               │ GraphQL (Apollo)
                    ┌──────────▼──────────┐
                    │    api_machine      │
                    │  Express + Apollo   │
                    │  + cron tasks       │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
         PostgreSQL        Firebase          WhatsApp
         (Prisma)          (Auth/Push)       (Business API)
```

### 3.2 Componentes

| Componente        | Responsabilidade                                            |
| ----------------- | ----------------------------------------------------------- |
| api_machine       | API GraphQL, webhooks, cron de matching e cancelamento      |
| passenger_machine | App do passageiro: mapa, solicitação, histórico, carteira   |
| driver_machine    | App do motorista: corridas, taxímetro, financeiro, veículo  |
| painel_machine    | Admin: franquias, motoristas, central de chamadas, métricas |

---

## 4. Fluxo principal

### 4.1 Solicitação de corrida (app)

1. Passageiro autentica (Firebase Auth, Google, Apple)
2. Seleciona origem e destino no mapa (Google Maps / Mapbox)
3. Escolhe tipo de serviço → preço estimado (taxa base + km + minuto + horário de pico)
4. Booking criado em estado `AWAIT`
5. Cron `searchDriver` (a cada 20s) busca motoristas próximos e envia push/WhatsApp
6. Motorista aceita → estados: `ACCEPTED_DRIVER` → `ON_ROUTE` → `EMBARKATION` → `COMPLETED`
7. Avaliação e transação financeira ao finalizar

### 4.2 Corrida via WhatsApp

- Passageiro solicita corrida, compartilha localização e escolhe pagamento pelo chat
- Motorista pode operar só via WhatsApp (`use_whatsapp: true`) com atualização de localização periódica
- Camada de IA (OpenAI) interpreta intenções em texto livre (`request_ride`, `become_driver`, etc.) além do fluxo numerado legado

### 4.3 Central de chamadas (painel)

- Operador com flag `is_callcenter` busca passageiro, define endereços no mapa e cria booking via mutation GraphQL
- Monitoramento de corridas ativas em tempo real

### 4.4 Multi-franquia

Cada registro `Franchise` armazena branding, chaves de API (Google, Mapbox), credenciais de pagamento (Stripe, Mercado Pago, PayPal), Firebase, WhatsApp e tema visual — permitindo dezenas de marcas a partir de um único codebase.

---

## 5. Tecnologias

| Camada         | Tecnologia                                                          |
| -------------- | ------------------------------------------------------------------- |
| Backend        | Node.js, TypeScript, Express, Apollo Server, type-graphql, Prisma 4 |
| Apps mobile    | React Native 0.69, Apollo Client, React Navigation                  |
| Painel         | React 18, PrimeReact, Mapbox GL, Chart.js                           |
| Banco de dados | PostgreSQL                                                          |
| Auth / Push    | Firebase Auth, Firebase Messaging, Notifee                          |
| Mapas          | Google Maps, Mapbox, Azure Geocoding, Nominatim                     |
| Pagamentos     | Stripe, Mercado Pago, PayPal, PIX                                   |
| Mensageria     | WhatsApp Business API, Evolution API, OpenAI (gpt-4o-mini)          |
| Storage        | Contabo Spaces (S3-compatible via AWS SDK)                          |
| Jobs           | node-cron (matching, cancelamento, heartbeat motorista)             |

---

## 6. Responsabilidades

| Componente        | Responsabilidade                                         |
| ----------------- | -------------------------------------------------------- |
| Franchise model   | Multi-tenancy: branding, credenciais, regiões            |
| Booking lifecycle | Estados da corrida, matching motorista-passageiro        |
| Service/Pricing   | Tarifas por franquia/região, taxímetro, horário de pico  |
| Driver workflow   | Cadastro, aprovação, planos de assinatura, financeiro    |
| WhatsApp layer    | Terminal legado + camada IA para booking e cadastro      |
| Admin reports     | Receita, corridas, motoristas online (dashboard ao vivo) |

---

## 7. Desafios

### 7.1 Multi-tenancy operacional

Cada franquia exige Firebase, gateways de pagamento, instância WhatsApp e chaves de mapa próprias — dezenas de campos de credencial por tenant.

### 7.2 Matching de motoristas

Cron polling a cada 20s em vez de event-driven; lógica de raio (`max_meters_request_drivers`) e notificação multi-canal.

### 7.3 Dois sistemas WhatsApp coexistindo

Fluxo numerado legado e camada IA nova rodando em paralelo, com migração incremental.

### 7.4 Motoristas sem app

Canal WhatsApp-only exige solicitação periódica de localização em vez de GPS contínuo.

### 7.5 Fragmentação de geocoding

Fallback entre Google, Mapbox, Azure e OpenStreetMap por custo e disponibilidade regional.

---

## 8. Soluções

| Desafio                   | Solução                                                              |
| ------------------------- | -------------------------------------------------------------------- |
| White-label               | Modelo `Franchise` centralizado com assets em `envs/` e `Resources/` |
| Matching                  | Cron `searchDriver` + push Firebase + notificação WhatsApp           |
| WhatsApp IA               | OpenAI com classificação de intenção estruturada + estado por sessão |
| Cancelamento automático   | Cron `cancelBooking` para corridas em embarque além do tempo limite  |
| Disponibilidade motorista | Cron `checkDriver` marca offline motoristas sem heartbeat            |

---

## 9. Resultados

Broom opera em produção (`api.broom.magicsoft.com.br`, `painel.broom.magicsoft.site`) com **mais de 20 marcas** configuradas no repositório (Seu Motorista, ATA MOBI, Bora Lá, MotoboyLeva, Vai de Mob, entre outras).

O painel inclui dashboard de métricas ao vivo (receita, corridas, cancelamentos, motoristas online), mas **não há KPIs históricos documentados no código** — os números vêm do banco em runtime.

---

## 10. Lições aprendidas

1. **White-label exige modelo de dados generoso** — Credenciais e branding por franquia desde o início evitam forks por cliente.
2. **WhatsApp é canal de produto** — Booking, cadastro e operação de motorista pelo chat ampliam alcance além do app.
3. **Cron simples funciona até certo ponto** — Matching por polling é operacional, mas escala melhor com eventos em volume alto.
4. **Migração incremental gera dívida visível** — Dois fluxos WhatsApp e resíduos de código (ex.: referências a app antigo) coexistem na base.
5. **Valores monetários em centavos** — Consistência no schema evita bugs de exibição, mas exige disciplina em toda a stack.

---

## 11. Relação com NovaDesk

Conceitos do Broom que informam o NovaDesk:

- Multi-tenancy por franquia/organização (Auth tenants, HelpDesk workspaces)
- Estados de lifecycle bem definidos (tickets, SLA)
- Cron/workers para tarefas periódicas (Notification Service)
- Painel operacional com métricas ao vivo (Analytics Dashboard)
- Integração multi-canal (chat, e-mail, notificações)
- GraphQL como camada de API (padrão considerado no ecossistema)
