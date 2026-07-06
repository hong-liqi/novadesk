# NovaDesk

Engineering portfolio platform by **Li Hong** — demonstrating production-grade software architecture through a live, deployable monorepo.

Instead of isolated demo projects, NovaDesk presents an integrated ecosystem: microservices, shared packages, four SaaS applications, CI/CD, Docker, authentication, real-time communication, and engineering documentation including ADRs.

**Live:** [novadesk.li.magicsoft.site](https://novadesk.li.magicsoft.site)  
**About:** [/about](https://novadesk.li.magicsoft.site/about) · **Engineering:** [/engineering](https://novadesk.li.magicsoft.site/engineering)

---

## Repository metrics

| Metric                  | Count                     |
| ----------------------- | ------------------------- |
| Applications            | 5 (website + 4 SaaS apps) |
| Backend services        | 6                         |
| Shared packages         | 8                         |
| TypeScript files        | 1,262+                    |
| Bounded-context modules | 22 (HelpDesk API)         |
| Engineering docs        | 21                        |
| ADRs                    | 7                         |

---

## Structure

```
packages/          Shared libraries (ui, sdk, auth, config, logger, shared, tsconfig, eslint-config)
services/          NestJS microservices (gateway, auth, notification, helpdesk, analytics, chat)
apps/              Next.js applications (helpdesk, analytics, chat, admin)
website/           Public portfolio site (about, engineering docs, case studies)
infrastructure/    Docker, Nginx, CapRover, scripts
docs/              Engineering documentation + ADRs + case studies
```

---

## What's included

| Component                   | Description                                     |
| --------------------------- | ----------------------------------------------- |
| Monorepo (pnpm + Turborepo) | Shared tooling, CI, package boundaries          |
| Shared packages             | UI kit, SDK, auth guards, config, logger        |
| Auth Service                | JWT RS256, RBAC, multi-tenant, refresh rotation |
| API Gateway                 | Routing, rate limiting, CORS, WebSocket proxy   |
| Notification Service        | Email delivery via SMTP                         |
| HelpDesk SaaS               | Ticketing API + agent UI (22 bounded contexts)  |
| Analytics                   | Metrics API + dashboard                         |
| Realtime Chat               | WebSocket service + chat app                    |
| Admin Portal                | Tenant management, health, settings             |
| Public website              | About, engineering docs, case studies, contact  |
| ADRs                        | 7 accepted decisions in `docs/adr/`             |
| CapRover deploy             | `captain-definition` per service                |

---

## Reviewer quick start

| Audience            | Start here                                                                                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Engineering Manager | [website /about](website/src/app/about/page.tsx) → [website /engineering](website/src/app/engineering/page.tsx) → [case studies](docs/case-studies/) |
| Backend engineer    | [docs/01-Architecture.md](docs/01-Architecture.md) → [docs/adr/](docs/adr/) → [docs/16-Service-Catalog.md](docs/16-Service-Catalog.md)               |
| Frontend engineer   | [packages/ui](packages/ui/) → [packages/sdk](packages/sdk/) → [docs/03-Coding-Standards.md](docs/03-Coding-Standards.md)                             |
| DevOps              | [docs/06-DevOps.md](docs/06-DevOps.md) → [DEPLOY-CAPROVER.md](DEPLOY-CAPROVER.md)                                                                    |

---

## Prerequisites

- Node.js 20 LTS
- pnpm 9
- Docker & Docker Compose

## Quick start

```bash
cp .env.example .env
chmod +x infrastructure/scripts/*.sh
./infrastructure/scripts/setup-local.sh
pnpm turbo dev
```

## Commands

| Command                | Description                |
| ---------------------- | -------------------------- |
| `pnpm install`         | Install dependencies       |
| `pnpm turbo dev`       | Start all apps in dev mode |
| `pnpm turbo build`     | Build all packages         |
| `pnpm turbo lint`      | Lint all packages          |
| `pnpm turbo test`      | Run unit tests             |
| `pnpm turbo typecheck` | TypeScript check           |

## Docker

```bash
docker compose -f infrastructure/docker/docker-compose.yml up -d
```

Access via `http://localhost` (Nginx reverse proxy).

## Deploy (CapRover)

Each service/app has `captain-definition` next to its `Dockerfile`. Deploy via Git webhook.

Full guide: [infrastructure/caprover/README.md](./infrastructure/caprover/README.md)

## Documentation

- Engineering index: [docs/README.md](./docs/README.md)
- ADRs: [docs/adr/](./docs/adr/)
- Website pages: [website/README.md](./website/README.md)

## License

MIT — see [00-governance/LICENSE](./00-governance/LICENSE).
