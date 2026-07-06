# NovaDesk

**Portfolio platform** demonstrating senior-level full-stack engineering — microservices, shared packages, CI/CD, and production deployment on CapRover.

**Live:** [novadesk.li.magicsoft.site](https://novadesk.li.magicsoft.site)

## Structure

```
packages/          Shared libraries (ui, sdk, auth, config, logger, shared, tsconfig, eslint-config)
services/          NestJS microservices (gateway, auth, notification, helpdesk, analytics, chat)
apps/              Next.js applications (helpdesk, analytics, chat, admin)
website/           Public NovaDesk website
infrastructure/    Docker, Nginx, CapRover, scripts
docs/              Engineering documentation
```

## What's included

| Component                   | Description                                   |
| --------------------------- | --------------------------------------------- |
| Monorepo (pnpm + Turborepo) | Shared tooling, CI, and package boundaries    |
| Shared packages             | UI kit, SDK, auth guards, config, logger      |
| Auth Service                | JWT, RBAC, multi-tenant, platform settings    |
| API Gateway                 | Routing, rate limiting, CORS, WebSocket proxy |
| Notification Service        | Email delivery via SMTP                       |
| HelpDesk SaaS               | Ticketing API + agent UI                      |
| Analytics                   | Metrics API + dashboard                       |
| Realtime Chat               | WebSocket service + chat app                  |
| Admin Portal                | Tenant management, health, settings           |
| Public website              | Landing, case studies, contact form           |
| CapRover deploy             | `captain-definition` per service              |

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

Cada serviço/app possui `captain-definition` ao lado do `Dockerfile`. Deploy via Git webhook:

1. Crie uma app no CapRover por componente
2. **Deployment → Git** — informe repo, branch e **Captain Definition Path** (ex.: `services/gateway/captain-definition`)
3. Configure variáveis de ambiente (URLs internas `srv-captain--*`)

Guia completo: [infrastructure/caprover/README.md](./infrastructure/caprover/README.md)

## Documentation

Start with [docs/README.md](./docs/README.md).

## License

MIT — see [00-governance/LICENSE](./00-governance/LICENSE).
