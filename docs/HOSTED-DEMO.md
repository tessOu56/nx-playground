# Hosted event stack

Public C-end is a **labelled demo** on Vercel Hobby (`nx-event-portal`). Catalog/orders use the portal’s same-origin BFF (`/api/events`, memory `api-fixtures`). Orders and tickets do not survive a cold start. This is not the funds path.

Local Nest + Postgres remains the interview / future money spine. Do not point live ECPay at the Hobby demo.

## Public URLs

| Piece | URL | Role |
| --- | --- | --- |
| Event portal | https://nx-event-portal.vercel.app/zh-TW/events | C-end labelled demo (the one live frontend) |
| Nest API (STOP-015 Render) | set after Blueprint apply (`nx-event-stack-nest`) | Interview / funds path (not the public URL) |

`nx-event-stack-api.vercel.app` is a second Git-connected Vercel project that currently shares the repo-root Next.js `vercel.json` (it is **not** api-mock). Git deploys for that project are skipped in repo config. Do not create a fifth Vercel project.

Public portal on Vercel uses the **same-origin labelled-demo BFF**. That BFF is **not** the Nest funds path and must not be described as a money API. Local CMS still uses Nest (`VITE_API_BASE_URL=http://localhost:3001/api`).

**Fixture updates:** edit `libs/api-fixtures/src/events.json` (and keep `apps/api-mock/src/data/events.json` in sync). The portal BFF reads bundled fixtures on the next portal deploy. Check portal `GET /api/health` for `catalogEvents` + `labelledDemo: true`.

Local CMS → Nest:

```
VITE_API_BASE_URL=http://localhost:3001/api
```

## Vercel vs Render

| Project | Config | Role |
| --- | --- | --- |
| `nx-event-portal` | repo-root [`vercel.json`](../vercel.json) (Root Directory **empty**) | Public Next — the live Hobby frontend |
| `nx-event-stack-api` | Git builds ignored ([`scripts/vercel-ignore.sh`](../scripts/vercel-ignore.sh)); [`apps/api-mock/vercel.json`](../apps/api-mock/vercel.json) only if CLI-deployed with Root Directory `apps/api-mock` | Do not use for Git deploys |
| `nx-event-stack-nest` | repo [`render.yaml`](../render.yaml) | Nest + Prisma + Neon `DATABASE_URL` |

Do not name a Vercel project `platform-command`, `platform-api`, `plinth`, or `metalcraft-platform`.

Hosted portal without owner LIFF env is a **labelled demo** (`user_demo`). Binding real LINE attendees needs STOP-013 on **tessOu56** LINE Developers — never another company's channel. Nest does not host LINE webhooks.

Payments: mock `paymentIntent` until ECPay sandbox keys exist. Public C-end uses the portal BFF memory fixtures, not Neon and not Nest funds. Live merchant is STOP-014 / T-244.

## Reset

- Local Nest: `make db-up && ./scripts/env-setup.sh && make seed`
- Hosted Nest: Prisma `migrate deploy` on Render build; seed separately if tables are empty
