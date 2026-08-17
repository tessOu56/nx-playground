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
| event-portal | 3000 | C-end Next app |
| auth | (README in app; **collides with 3000** — known debt) | Kratos + LINE |
| api-server | 3001 | NestJS + Prisma; Swagger `/api/docs` |
| event-cms | 3002 | React ops console |
| profile | 3003 | Personal site — no new features (graduate) |
| vue-motion | 8080 | Mirror of `vue-motion-sandbox` until inversion |
| enterprise-admin | 4200 | Mirror of `angular-dashboard-sandbox` until inversion |

## Bootstrap

1. `pnpm install --no-frozen-lockfile` (first clone) or `make setup`
2. `.env`: `DATABASE_URL=file:./apps/api-server/prisma/dev.db` and `NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api`
3. `npx prisma generate --schema=apps/api-server/prisma/schema.prisma` + `db push`
4. API: `npx nx build @nx-playground/api-server --configuration=development` then serve; if worker error: `node dist/apps/api-server/main.js`
5. Frontends: `pnpm dev:event-portal`, `pnpm dev:event-cms` (plus auth per app README)

Runnable how-to that stays in-repo: [`DEV-ENVIRONMENT.md`](./DEV-ENVIRONMENT.md), [`CONTRACT-PIPELINE.md`](./CONTRACT-PIPELINE.md).

## Do not

- Treat this file or `docs/EXECUTION-PLAN-2026H2.md` as stage SSOT
- Develop Angular/Vue features in the satellite repos **and** in nx in parallel (inversion is T-228)
- Rely on Cloudflare profile deploy (retired — `DEPLOY-CLOUDFLARE-RETIREMENT.md`)
- Re-open Module Federation
