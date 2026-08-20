# Hosted event stack

Public C-end is a **labelled demo** on Vercel Hobby. The public portal talks to Hobby `nx-event-stack-api` in **memory** (`EVENT_STACK_STORE=memory`, no `DATABASE_URL`). Catalog comes from fixtures; orders and tickets do not survive a cold start. This is not the funds path.

Local Nest + Postgres remains the interview / future money spine. Do not point live ECPay at Hobby mock.

## Public URLs

| Piece | URL | Role |
| --- | --- | --- |
| Event portal | https://nx-event-portal.vercel.app/zh-TW/events | C-end labelled demo |
| Hobby api-mock | https://nx-event-stack-api.vercel.app/api | Memory catalog + mock pay / tickets |
| Nest API (STOP-015 Render) | set after Blueprint apply (`nx-event-stack-nest`) | Interview / funds path (not the public URL) |

Public portal `NEXT_PUBLIC_API_BASE_URL` = Hobby `/api`. Local CMS still uses Nest (`VITE_API_BASE_URL=http://localhost:3001/api`). Do not create a fifth Vercel project.

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

Payments: mock `paymentIntent` until ECPay sandbox keys exist. Public C-end (T-258) uses Hobby **memory** api-mock, not Neon and not Nest funds. Live merchant is STOP-014 / T-244.

## Reset

- Local Nest: `make db-up && ./scripts/env-setup.sh && make seed`
- Hosted Nest: Prisma `migrate deploy` on Render build; seed separately if tables are empty
