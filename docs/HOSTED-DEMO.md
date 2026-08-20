# Hosted event stack

Public C-end is Vercel Hobby. **Product API (orders / future tickets) is Nest + Postgres**, not Hobby `nx-event-stack-api` (api-mock).

## Public URLs

| Piece | URL | Role |
| --- | --- | --- |
| Event portal | https://nx-event-portal.vercel.app/zh-TW/events | C-end |
| Nest API (STOP-015 Render) | set after Blueprint apply (`nx-event-stack-nest`) | **Funds / tickets path** |
| Hobby api-mock | https://nx-event-stack-api.vercel.app/api | CI / preview only — **not funds** |

Portal/CMS already switch on `NEXT_PUBLIC_API_BASE_URL` / `VITE_API_BASE_URL` (default local Nest `http://localhost:3001/api`). After Render is up, point those at the Nest origin + `/api`. Do not create a fifth Vercel project.

Local CMS → Nest:

```
VITE_API_BASE_URL=http://localhost:3001/api
```

## Vercel vs Render

| Project | Root | Role |
| --- | --- | --- |
| `nx-event-portal` | monorepo (`vercel.event-portal.json`) | Public Next |
| `nx-event-stack-api` | `apps/api-mock` | Mock only |
| `nx-event-stack-nest` | repo `render.yaml` | Nest + Prisma + Neon `DATABASE_URL` |

Do not name a Vercel project `platform-command`, `platform-api`, `plinth`, or `metalcraft-platform`.

Hosted portal without owner LIFF env is a **labelled demo** (`user_demo`). Binding real LINE attendees needs STOP-013 on **tessOu56** LINE Developers — never another company's channel. Nest does not host LINE webhooks.

Payments: mock `paymentIntent` until ECPay sandbox keys exist. Do not point hosted portal at Hobby api-mock for money. Live merchant is STOP-014 / T-244.

## Reset

- Local Nest: `make db-up && ./scripts/env-setup.sh && make seed`
- Hosted Nest: Prisma `migrate deploy` on Render build; seed separately if tables are empty
