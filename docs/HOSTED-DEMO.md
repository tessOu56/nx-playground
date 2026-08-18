# Hosted event-stack demo (T-2026-233)

Labelled **interview demo**, not production. No LIFF, Kratos, or real payments.

Planning SSOT: platform-command `planning/tickets/T-2026-233.yaml` · Hobby settings: platform-command `docs/runbooks/vercel-hobby-settings.md`.

## Public URLs

| Piece | URL |
| --- | --- |
| Portal (Featured candidate) | https://nx-event-portal.vercel.app/zh-TW/events |
| Demo API (not Featured) | https://nx-event-stack-api.vercel.app/api |

Interview click: list shows **NestJS 實戰工作坊** and **React 19 技術分享會**, amber demo banner, no real payments.

Portal env: `NEXT_PUBLIC_API_BASE_URL=https://nx-event-stack-api.vercel.app/api`  
API CORS: `*` for this labelled demo (may tighten to the portal origin later).

## Vercel projects (unique slugs)

Never name a project `platform-command`, `platform-api`, `plinth`, or `metalcraft-platform`.

| Project | Root Directory | Role |
| --- | --- | --- |
| `nx-event-portal` | `apps/event-portal` | Public Next list/detail/register |
| `nx-event-stack-api` | `apps/api-mock` | Demo API (same OpenAPI as Nest; in-memory fixtures) |

Hobby only — do not buy a domain this milestone. Speed Insights stays on Portal only.

Vercel blocks Next `<15.5.9` (RSC CVEs). Root `next` is **15.5.9**.

This slice was published with **CLI prebuilt** from the nx monorepo (local `nx build` → `vercel build` → deploy `--prebuilt` from repo root). Git auto-deploy is not the source of truth yet: pnpm `--frozen-lockfile` fails because workspace `overrides` drift, and the Next app needs files outside `apps/event-portal`.

## Reset

- Local: `make seed`
- Hosted mock: Redeploy `nx-event-stack-api` or wait for a new isolate (memory store resets)

## Do not

- Claim this as production
- Upgrade to Pro or buy a Vercel domain for this demo
- Enable Speed Insights on these projects (Hobby: one project, keep it on Portal)
