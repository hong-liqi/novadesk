# Portfolio OS

Integrated engineering ecosystem demonstrating senior-level software architecture.

## Structure

```
packages/          Shared libraries (ui, sdk, auth, config, logger, shared, tsconfig, eslint-config)
services/          NestJS microservices (gateway, auth-service, notification-service)
apps/              Next.js applications (helpdesk, analytics, chat, admin)
website/           Public portfolio website
infrastructure/    Docker, Nginx, scripts
docs/              Engineering documentation
```

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

| Command | Description |
|---------|-------------|
| `pnpm install` | Install dependencies |
| `pnpm turbo dev` | Start all apps in dev mode |
| `pnpm turbo build` | Build all packages |
| `pnpm turbo lint` | Lint all packages |
| `pnpm turbo test` | Run unit tests |
| `pnpm turbo typecheck` | TypeScript check |

## Docker

```bash
docker compose -f infrastructure/docker/docker-compose.yml up -d
```

Access via `http://localhost` (Nginx reverse proxy).

## Documentation

Start with [docs/README.md](./docs/README.md).

## License

MIT — see [00-governance/LICENSE](./00-governance/LICENSE).
