# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- **Analytics (M6):** `analytics-api` service, SDK client, dashboard with KPIs/trends/export
- **Realtime Chat (M7):** WebSocket service (Socket.IO), chat app, gateway proxy + `/socket.io`
- **Admin Portal (M8):** tenants CRUD, platform health dashboard, role-gated access
- **Portfolio Website (M9):** hero, projects, case studies, contact form, SEO metadata
- **CapRover deploy:** `captain-definition` in every service/app + [infrastructure/caprover/README.md](./infrastructure/caprover/README.md)
- **Notification Service (M4):** In-app notifications CRUD, transactional email via SMTP/Mailpit, EmailLog tracking
- **Auth Service (M2):** Prisma schema, register/login/refresh/logout, JWT RS256, JWKS, tenant CRUD, audit log, refresh token rotation in Redis
- **API Gateway (M3):** HTTP proxy to auth, notification, helpdesk services; JWKS validation; rate limiting; aggregated health; request ID propagation
- **HelpDesk API:** Prisma-backed workspaces, organizations, customers, contacts, tickets, messages, dashboard stats
- **HelpDesk SaaS frontend:** Login, dashboard, tickets (list/detail/create), customers CRUD, inbox, settings, workspace switcher
- **Shared packages:** Domain types/enums, JWT client, React auth provider, SDK auth/helpdesk clients, UI Input/Table/Modal/Badge/layouts
- **Infrastructure:** postgres-helpdesk, helpdesk-api in Docker Compose; gateway service URLs
- Monorepo foundation with pnpm workspaces and Turborepo
- Shared packages: tsconfig, eslint-config, config, shared, logger, auth, ui, sdk
- NestJS services: gateway, auth-service, notification-service, helpdesk-api
- Next.js apps: helpdesk-saas, analytics-dashboard, realtime-chat, admin-panel
- Portfolio website
- Docker Compose, Nginx, GitHub Actions CI
- Health checks, Swagger, metrics, OpenTelemetry preparation, BullMQ queues

### Changed

- Split `@portfolio/auth/client` and `@portfolio/ui/client` for Next.js compatibility
- Isolated Prisma clients per service (`src/generated/prisma`)
- Config package legacy aliases for backward compatibility

### Fixed

- TypeScript config exports for `@portfolio/tsconfig/react.json`
- Frontend build errors from NestJS guards in auth package barrel export
