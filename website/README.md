# NovaDesk — Public Website

Engineering portfolio site for **Li Hong**. Built with Next.js 14 App Router, Tailwind CSS, and `@novadesk/ui`.

**Live:** [novadesk.li.magicsoft.site](https://novadesk.li.magicsoft.site)

---

## Pages

| Route                       | Purpose                                                                            |
| --------------------------- | ---------------------------------------------------------------------------------- |
| `/`                         | Landing — metrics, platform modules, engineering highlights, case studies, contact |
| `/about`                    | About the Engineer — philosophy, trajectory, links                                 |
| `/engineering`              | Engineering documentation index                                                    |
| `/engineering/architecture` | System architecture (from `docs/01-Architecture.md`)                               |
| `/engineering/monorepo`     | Monorepo structure (from `docs/15-Monorepo-Structure.md`)                          |
| `/engineering/auth-flow`    | JWT authentication flow with Mermaid diagrams                                      |
| `/engineering/request-flow` | Request lifecycle through gateway                                                  |
| `/engineering/roadmap`      | Delivery roadmap (from `docs/09-Roadmap.md`)                                       |
| `/engineering/decisions`    | Architecture Decision Records                                                      |
| `/case-studies/[slug]`      | Production case studies (Spell, Broom, Teste de Perfil)                            |

---

## Content

| Path                    | Description                                            |
| ----------------------- | ------------------------------------------------------ |
| `content/case-studies/` | Case study markdown (source of truth for rendering)    |
| `content/engineering/`  | Auth flow, request flow docs with Mermaid              |
| `public/resume/`        | Resume PDF (`Curriculo_Li_Hong_Software_Engineer.pdf`) |

Case studies are synced to `docs/case-studies/` for the engineering documentation index.

---

## Development

```bash
pnpm install
pnpm --filter @novadesk/website dev
```

Port **3013** (or via Nginx at `/` in Docker stack).

---

## Scripts

| Command          | Description        |
| ---------------- | ------------------ |
| `pnpm dev`       | Development server |
| `pnpm build`     | Production build   |
| `pnpm test`      | Vitest unit tests  |
| `pnpm lint`      | ESLint             |
| `pnpm typecheck` | TypeScript check   |

---

## Reviewer path

Designed for technical review in under two minutes:

1. **About** — who builds this and how they think
2. **Engineering** — architecture, ADRs, auth/request flows
3. **Case studies** — prior production systems
4. **Live demo** — HelpDesk, Analytics, Chat, Admin

All reachable within three clicks from the home page.
