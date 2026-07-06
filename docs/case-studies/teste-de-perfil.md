# Case Study — Teste de Perfil

**Versão:** 2.0  
**Status:** Aprovado  
**Última atualização:** 2026-07-06  
**Tipo:** Projeto anterior (documentação narrativa, sem código)

---

## 1. Problema

Paulo Odorico e parceiros (Projeto Vender Mais, Conexão Lucrativa) precisavam entregar avaliações de perfil comportamental em escala — para alunos de cursos online, participantes de treinamentos presenciais e eventos corporativos. Processos manuais (planilhas, impressão avulsa, envio de PDF por e-mail) não escalavam e não integravam com plataformas de curso (Kiwify, Hotmart).

---

## 2. Objetivo

Desenvolver uma plataforma web que aplique testes de perfil comportamental (modelo DISC com quatro perfis: Executor, Comunicador, Planejador, Analista), gere apostilas personalizadas em PDF e suporte fluxos distintos: curso online com acesso por token, evento corporativo com turmas e impressão em lote, e teste gratuito com perfil de investidor.

---

## 3. Arquitetura

### 3.1 Visão geral

Teste de Perfil adotou **Next.js App Router monolítico** com API Route Handlers e PostgreSQL — sem backend separado.

```
┌─────────────────────────────────────────────────────┐
│              Next.js (App Router)                    │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────┐ │
│  │ /teste-perfil│ │/perfil-comp. │ │    /cl      │ │
│  │  (curso)     │ │  (corporativo)│ │ (investidor)│ │
│  └──────┬───────┘ └──────┬───────┘ └──────┬──────┘ │
│         └────────────────┼────────────────┘         │
│                          ▼                          │
│                   API Route Handlers                  │
│              (salvar, PDF, e-mail, admin)           │
└──────────────────────────┬──────────────────────────┘
                           ▼
                    PostgreSQL (Prisma)
                           │
                    Puppeteer + Chromium
                    (PDF server-side)
```

### 3.2 Fluxos independentes

| Fluxo                 | Rota                     | Público                                   |
| --------------------- | ------------------------ | ----------------------------------------- |
| Teste de Perfil       | `/teste-perfil`          | Alunos Projeto Vender Mais                |
| Perfil Comportamental | `/perfil-comportamental` | Treinamentos e eventos corporativos       |
| Conexão Lucrativa     | `/cl`                    | Parceria Matheus Torrente & Paulo Odorico |

Cada fluxo tem banco de questões, tabelas Prisma e UX próprios, compartilhando infraestrutura de PDF e deploy.

---

## 4. Fluxo principal

### 4.1 Teste de Perfil (curso online)

1. Aluno acessa via link com token (`TESTE_PERFIL_TOKEN`) e parâmetros da plataforma (Kiwify/Hotmart: e-mail, nome, `external_id`)
2. Cadastro e **20 perguntas** uma por tela com barra de progresso
3. Tracking de sessão via `/api/track` (visita, início, progresso, conclusão)
4. Ao finalizar: resultado na tela + download de PDF + e-mail enfileirado (delay configurável, padrão 7 min)
5. Dashboard `/metrics` com visitas, taxa de conclusão e abandono por questão

### 4.2 Perfil Comportamental (corporativo)

1. Participante acessa link da turma (`/t/{linkToken}`) ou landing geral
2. Cadastro (nome, setor, cargo, tempo de casa, idade)
3. **24 perguntas** → resultado calculado no servidor
4. Redirecionamento para `/obrigado/{id}` — **participante não vê resultado** (apostila impressa no evento)
5. Admin cria turmas, exporta CSV, gera PDF individual ou ZIP em lote para gráfica

### 4.3 Conexão Lucrativa

1. Cadastro (nome, e-mail, profissão) — gratuito, sem token
2. **20 perguntas** comportamentais + cenários de investimento
3. Resultado imediato em `/cl/resultado/{id}` com perfil de investidor (Arrojado, Sofisticado, Conservador, Moderado)
4. Admin gerencia eventos, exporta CSV e ZIP de PDFs

---

## 5. Tecnologias

| Camada         | Tecnologia                                    |
| -------------- | --------------------------------------------- |
| Framework      | Next.js 16 (App Router), React 19, TypeScript |
| Estilo         | Tailwind CSS 4                                |
| Banco de dados | PostgreSQL, Prisma 6                          |
| Gráficos       | Chart.js + react-chartjs-2                    |
| PDF            | Puppeteer-core + Chromium, pdf-lib, jsPDF     |
| E-mail         | Nodemailer (SMTP), fila em arquivo `.queue/`  |
| Exportação     | JSZip (lotes de apostilas)                    |
| Deploy         | Docker multi-stage, CapRover                  |
| Produção       | testeperfil.pauloodorico.com.br               |

---

## 6. Responsabilidades

| Componente          | Responsabilidade                                        |
| ------------------- | ------------------------------------------------------- |
| Motor de scoring    | Pontuação por perfil, percentuais, ranking              |
| Geração de apostila | Puppeteer renderiza URL interna `?print=true` em A4     |
| Fila de e-mail      | Worker polling (15s), jobs com delay configurável       |
| Admin PC/CL         | Turmas/eventos, links públicos, invalidação, export     |
| Auth por fluxo      | Token de curso, cookie de métricas, admin compartilhado |
| Tracking            | Visitas e sessões para analytics do teste original      |

---

## 7. Desafios

### 7.1 Três produtos em um repositório

Fluxos com regras de UX diferentes (mostrar vs ocultar resultado, token vs gratuito) no mesmo codebase.

### 7.2 PDF server-side com gráficos

Puppeteer precisa aguardar Chart.js renderizar; ZIP de turmas inteiras pode levar minutos.

### 7.3 Deploy e migrations

Histórico de conflito Prisma sqlite vs PostgreSQL (erro P3019) durante adoção do Postgres em produção.

### 7.4 Fila de e-mail simples

Jobs removidos ao processar sem retry automático em caso de falha SMTP.

### 7.5 Privacidade no fluxo corporativo

Participante não vê resultado online — pipeline de impressão precisa estar pronto antes do evento.

---

## 8. Soluções

| Desafio           | Solução                                                                      |
| ----------------- | ---------------------------------------------------------------------------- |
| Multi-produto     | Tabelas Prisma separadas (`TestSession`, `PcParticipante`, `ClParticipante`) |
| PDF com charts    | `INTERNAL_BASE_URL` + wait for canvas + Dockerfile com Chromium              |
| Lote para gráfica | ZIP via admin + rota `/admin/imprimir?turmaId=` para impressão browser       |
| Acesso curso      | Token em query param → cookie `tp_auth`                                      |
| Eventos           | Turmas com `linkToken` UUID, taxa de resposta no admin                       |

---

## 9. Resultados

Plataforma em produção em **testeperfil.pauloodorico.com.br**, usada em três contextos reais: curso online (Projeto Vender Mais), treinamentos corporativos com turmas e eventos Conexão Lucrativa.

Dashboard `/metrics` e admin de turmas exibem métricas **ao vivo** (visitas, conclusões, taxa de resposta por turma). **Não há números de negócio fixos no repositório** — estatísticas vêm do banco em runtime.

---

## 10. Lições aprendidas

1. **UX por contexto importa mais que um fluxo único** — Curso mostra resultado; corporativo esconde até o evento; CL é imediato e gratuito.
2. **Puppeteer em Docker é infraestrutura de produto** — Chromium, URL interna e timeouts fazem parte do core, não de um extra.
3. **Integração com plataformas de curso** — Parâmetros na URL (Kiwify/Hotmart) e token de acesso evitam cadastro duplicado.
4. **Exportação em lote é operação crítica** — ZIP de apostilas para gráfica precisa de UX que comunique tempo de processamento.
5. **Modelo DISC simplificado escala** — Quatro perfis com percentuais e ranking atendem vendas, RH e educação financeira com o mesmo motor.

---

## 11. Relação com NovaDesk

Conceitos do Teste de Perfil que informam o NovaDesk:

- Geração de relatórios e PDF (Analytics export)
- Fluxos com estados e tracking de progresso (onboarding, tickets)
- Admin com turmas/organizações (multi-tenant HelpDesk)
- Auth por token/convite (Admin Portal invites)
- Métricas de funil e abandono (Analytics Dashboard)
- Deploy containerizado em CapRover (mesmo padrão do NovaDesk)
