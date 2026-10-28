# PROJECT-PLAN — nx-playground

> **Superseded as phase SSOT.** Product stages, tickets, and the event-stack reshape live in private **platform-command**:
> `planning/projects/nx-playground.md` · `planning/portfolio-velocity.md` · `planning/tickets/T-2026-223.yaml` (and T-228–230).
>
> This public file is **setup / ports / how-to only**. Do not treat the old Phase 0–3 table as the roadmap.

## Theme (product path)

**Event + commerce integration** — keep `event-portal`, `event-cms`, `api-server`, `auth`.  
Angular / Vue / profile / mobile-approvals are leaving or already have independent repos; do not add features there in this monorepo until the graduate tickets land.

## Apps (ports)

| App | Port | Notes |
|-----|------|--------|
| event-portal | 3000 | C-end Next app + Better Auth (`/api/auth/*`) |
| auth | 3004 | Redirects to portal login |
| api-mock | 3011 | Stateful mock of the Nest event-stack OpenAPI |
| api-server | 3001 | NestJS + Prisma; Swagger `/api/docs` |
| api-mock | 3011 | Stateful mock of the Nest event-stack OpenAPI |
| event-cms | 3002 | React ops console |
| profile | 3003 | Personal site — no new features (graduate) |
| angular-dashboard | 4200 | Nx import of angular-dashboard-sandbox (Angular 20.3.3) |
| vue-motion | 8080 | Nx import of vue-motion-sandbox (Vue 3 + Vite) |

Archived (not product): `labs/vue-motion` and `labs/enterprise-admin` — see [`labs/README.md`](../labs/README.md). Canonical Vue/Angular remains the satellite sandboxes; `apps/angular-dashboard` and `apps/vue-motion` are the Nx imports.

## Bootstrap

1. `pnpm install --no-frozen-lockfile` (first clone) or `make setup`
2. `.env`: `DATABASE_URL=postgresql://…` (Neon event-stack or `make db-up` → `postgresql://event:event@127.0.0.1:5433/event_stack`) and `NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api` (mock-only: `http://localhost:3011/api`). `scripts/env-setup.sh` writes these defaults. SQLite is not allowed.
3. `make seed` (`prisma migrate deploy` + fixtures)
4. API live: `pnpm dev:api`. Contract mock: `pnpm dev:api-mock`.
5. Frontends: `pnpm dev:event-portal`, `pnpm dev:event-cms`, `pnpm dev:auth`

Runnable how-to that stays in-repo: [`EVENT-STACK-DEMO.md`](./EVENT-STACK-DEMO.md) (interview happy path + failure), [`DEV-ENVIRONMENT.md`](./DEV-ENVIRONMENT.md), [`CONTRACT-PIPELINE.md`](./CONTRACT-PIPELINE.md).

## Do not

- Treat this file or `docs/EXECUTION-PLAN-2026H2.md` as stage SSOT
- Develop Angular/Vue features in the satellite repos **and** in nx in parallel (inversion is T-228)
- Rely on Cloudflare profile deploy (retired — `DEPLOY-CLOUDFLARE-RETIREMENT.md`)
- Re-open Module Federation
