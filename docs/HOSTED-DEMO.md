# Hosted event stack

Public C-end is a **labelled demo** on Vercel Hobby. The public portal talks to Hobby `nx-event-stack-api` in **memory** (`EVENT_STACK_STORE=memory`, no `DATABASE_URL`). Catalog comes from fixtures.

Local Nest + Postgres remains the interview / future money spine. Do not point live ECPay at Hobby mock.

## Public URLs

| Piece | URL | Role |
| --- | --- | --- |
| Event portal | https://nx-event-portal.vercel.app/zh-TW/events | C-end labelled demo |
| Hobby api-mock | https://nx-event-stack-api.vercel.app/api | Memory catalog + mock pay / tickets |
| Nest API (STOP-015 Render) | set after Blueprint apply (`nx-event-stack-nest`) | Interview / funds path (not the public URL) |

Public portal `NEXT_PUBLIC_API_BASE_URL` = Hobby `/api` when that project is a real mock. If `nx-event-stack-api.vercel.app` is serving the Next portal instead of api-mock, event-portal uses a **same-origin labelled-demo BFF** (`/api/events`, memory `api-fixtures`). That BFF is **not** the Nest funds path and must not be described as a money API. Local CMS calls same-origin `/cms-api`; the Vite BFF attaches `ADMIN_API_TOKEN` after a Kratos session and proxies to Nest (`EVENT_STACK_NEST_URL`, default `http://localhost:3001/api`). Do not create a fifth Vercel project.

**Fixture updates:** edit `libs/api-fixtures/src/events.json` (and keep `apps/api-mock/src/data/events.json` in sync). Redeploying `nx-event-stack-api` refreshes the dedicated mock; the portal BFF reads bundled fixtures on the next portal deploy. Check portal `GET /api/health` for `catalogEvents` + `labelledDemo: true`. Until the dedicated mock is a real api-mock, event-portal merges / falls back to bundled fixtures for labelled demo fields (speakers, venue, organizer).

Local CMS → Nest (browser never holds the admin token):

```
EVENT_STACK_NEST_URL=http://localhost:3001/api
ADMIN_API_TOKEN=<local server-only token>
KRATOS_PUBLIC_URL=http://localhost:4433
ALLOWED_ORGANIZER_EMAILS=organizer@nx-playground.local
```

## Vercel vs Render

| Project | Root | Role |
| --- | --- | --- |
| `nx-event-portal` | monorepo (`vercel.event-portal.json`) | Public Next |
| `nx-event-stack-api` | `apps/api-mock` | Mock only |
| `nx-event-stack-nest` | repo `render.yaml` | Nest + Prisma + Neon `DATABASE_URL` |

Do not name a Vercel project `platform-command`, `platform-api`, `plinth`, or `metalcraft-platform`.

Hosted portal without owner LIFF env is a **labelled demo** (`user_demo`). Binding real LINE attendees needs STOP-013 on **tessOu56** LINE Developers — never another company's channel. Nest does not host LINE webhooks. The Official Account Messaging webhook lives on **event-portal** (`/api/line/webhook`) and shares exhibition search with the catalog (`GET /api/exhibitions/search`). With `DATABASE_URL` it uses Neon FTS (CJK bigrams + `pg_trgm`); with optional embedding env it hybrid-ranks FTS against pgvector cosine; without `DATABASE_URL`, sample fixtures. See [`docs/runbooks/line-bot.md`](./runbooks/line-bot.md).

Taipei catalog rows are collected from [文化部開放資料](https://cloud.culture.tw/) exhibition JSON (Taipei City only; summary + link, not full copyrighted text). Cron: `.github/workflows/collect-taipei.yml` (secret `COLLECTOR_DATABASE_URL`, role `event_collector`). Tokyo rows use official museum/RSS/open-data collectors (`.github/workflows/collect-tokyo.yml`; sources in `tools/collectors/tokyo/SOURCES.md`). See [`docs/runbooks/line-bot.md`](./runbooks/line-bot.md) for the one-time role password + secret steps.

Public C-end uses Hobby **memory** api-mock for the fixture catalog. Nest + Neon is the write path for CMS and collectors.

## Reset

- Local Nest: `make db-up && ./scripts/env-setup.sh && make seed`
- Hosted Nest: Prisma `migrate deploy` on Render build; seed separately if tables are empty
