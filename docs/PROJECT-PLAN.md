# PROJECT-PLAN — nx-playground

> Canonical phase SSOT for this repo. See [`docs/README.md`](./README.md) for setup and architecture.

## Theme

**Tech Radar × Event Analytics** — Event Portal/CMS + cross-framework labs.

## Phases

| Phase | Focus | Exit |
|-------|-------|------|
| 0 | `make setup`; api + profile + vue-motion + enterprise-admin local | All four apps serve locally; CI green |
| 1 | `libs/charts` + enterprise-admin dashboard page | Dashboard page renders charts from event mock |
| 2 | React motion lab in `apps/profile` | Particle/motion demo ready for promote path |
| 3 | OpenAPI ↔ polyglot spike; promote to portal labs | Contract chain end-to-end; one motion promote |

## Apps (ports)

| App | Port |
|-----|------|
| api-server | 3001 |
| event-portal | 3000 |
| event-cms | 3002 |
| profile | 3003 |
| vue-motion | 8080 |
| enterprise-admin | 4200 |

## Bootstrap

1. `pnpm install --no-frozen-lockfile` (first clone) or `make setup`
2. `.env`: set `DATABASE_URL=file:./apps/api-server/prisma/dev.db` and `NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api`
3. `npx prisma generate --schema=apps/api-server/prisma/schema.prisma` + `db push`
4. Before api-server: build shared libs, then `npx nx build @nx-playground/api-server --configuration=development`
5. API run (if `nx serve` worker error): `node dist/apps/api-server/main.js`
6. Frontends: `pnpm dev:profile`, `pnpm dev:vue-motion`, `pnpm dev:enterprise`

See [`docs/DEV-ENVIRONMENT.md`](./DEV-ENVIRONMENT.md) for platform-specific notes.

Verified local URLs: api `3001`, profile `3003`, vue-motion `8080`, enterprise-admin `4202`.

## Do not

- Develop in mirror repos (vue-motion-sandbox, angular-dashboard-sandbox)
- Rely on automatic Cloudflare profile deploy (retired 2026-07-07 — see `docs/DEPLOY-CLOUDFLARE-RETIREMENT.md`)
- Merge into ai-search-portal monorepo without documented evaluation

---

_Tickets are not tracked in this repo. Phase exit criteria live here only._
