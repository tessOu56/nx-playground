# PROJECT-PLAN — nx-playground

> Canonical phase SSOT for this repo. Central plan: [platform-command/planning/projects/nx-playground.md](https://github.com/tessOu56/platform-command/blob/main/planning/projects/nx-playground.md)

## Theme

**Tech Radar × Event Analytics** — Event Portal/CMS + cross-framework labs.

## Phases

| Phase | Focus | Exit |
|-------|-------|------|
| 0 | `make setup`; api + profile + vue-motion + enterprise-admin local | T-2026-008 |
| 1 | `libs/charts` + enterprise-admin dashboard page | T-2026-009 |
| 2 | React motion lab in `apps/profile` | T-2026-010 |
| 3 | OpenAPI ↔ polyglot spike; promote to portal labs | T-2026-011, T-2026-013 |

## Apps (ports)

| App | Port |
|-----|------|
| api-server | 3001 |
| event-portal | 3000 |
| event-cms | 3002 |
| profile | 3003 |
| vue-motion | 8080 |
| enterprise-admin | 4200 |

## Windows bootstrap (2026-06-12)

1. `pnpm install --no-frozen-lockfile`
2. `.env`: set `DATABASE_URL=file:./apps/api-server/prisma/dev.db` and `NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api`
3. `npx prisma generate --schema=apps/api-server/prisma/schema.prisma` + `db push`
4. Before api-server: `npx tsc -b libs/permissions/tsconfig.lib.json libs/logger/tsconfig.lib.json` then `npx nx build @nx-playground/api-server --configuration=development`
5. API run (if `nx serve` worker error): `node dist/apps/api-server/main.js`
6. Frontends: `$env:NX_CLOUD_NO_TIMEOUTS='true'; npx nx serve @nx-playground/profile --port=3003` (avoid inline `NX_CLOUD_NO_TIMEOUTS=true` in package.json on cmd)

Verified local URLs: api `3001`, profile `3003`, vue-motion `8080` (mirror repo), enterprise-admin `4202`.

## Do not

- Develop in mirror repos (vue-motion-sandbox, angular-dashboard-sandbox)
- Merge into ai-search-portal monorepo without documented evaluation
