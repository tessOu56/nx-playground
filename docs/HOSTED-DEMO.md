# Hosted event stack

Public C-end and API. Planning and hosting policy live in private **platform-command**.

## Public URLs

| Piece | URL |
| --- | --- |
| Event portal | https://nx-event-portal.vercel.app/zh-TW/events |
| Event API | https://nx-event-stack-api.vercel.app/api |

Portal env: `NEXT_PUBLIC_API_BASE_URL=https://nx-event-stack-api.vercel.app/api`

Local CMS can publish to the hosted API with `VITE_API_BASE_URL` set to the same origin. Persistence uses `DATABASE_URL` on the API project.

## Vercel projects

| Project | Root Directory | Role |
| --- | --- | --- |
| `nx-event-portal` | `apps/event-portal` | Public Next list/detail/register |
| `nx-event-stack-api` | `apps/api-mock` | Event-stack API (same OpenAPI as Nest) |

Do not name a project `platform-command`, `platform-api`, `plinth`, or `metalcraft-platform`.

This slice is published with **CLI prebuilt** from the nx monorepo (`nx build` → `vercel build` → deploy `--prebuilt`). Git auto-deploy is not the source of truth yet.

## Reset

- Local Nest: `make seed`
- Hosted API: seed runs when the events table is empty; CMS creates persist in Postgres (`DATABASE_URL`)
