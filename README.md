# NovaDesk

Integrated engineering ecosystem demonstrating senior-level software architecture.

## Structure

```
packages/          Shared libraries (ui, sdk, auth, config, logger, shared, tsconfig, eslint-config)
services/          NestJS microservices (gateway, auth, notification, helpdesk, analytics, chat)
apps/              Next.js applications (helpdesk, analytics, chat, admin)
website/           Public NovaDesk website
infrastructure/    Docker, Nginx, CapRover, scripts
docs/              Engineering documentation
```

## Current Status (v0.9.0-dev)

| Component                 | Status                              |
| ------------------------- | ----------------------------------- |
| Monorepo foundation (M0)  | ✅ Complete                         |
| Shared packages (M1)      | ✅ Complete                         |
| Auth Service (M2)         | ✅ Complete                         |
| API Gateway (M3)          | ✅ Complete                         |
| Notification Service (M4) | ✅ Complete                         |
| HelpDesk SaaS (M5)        | ✅ Core ticketing + UI              |
| Analytics (M6)            | ✅ API + dashboard                  |
| Realtime Chat (M7)        | ✅ WebSocket service + app          |
| Admin Portal (M8)         | ✅ Tenants + health dashboard       |
| NovaDesk Website (M9)     | ✅ Landing + case studies + contact |
| CapRover deploy           | ✅ captain-definition per app       |

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
