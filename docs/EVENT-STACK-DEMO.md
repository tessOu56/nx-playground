# Event-stack how-to

> How-to only. Stages and tickets live in private **platform-command**.  
> Hosted C-end: https://nx-event-portal.vercel.app/zh-TW/events — API truth: Nest, see `docs/HOSTED-DEMO.md`.

## Ports (do not drift)

| App | Port | URL |
| --- | --- | --- |
| event-portal | 3000 | http://localhost:3000 — Better Auth `/api/auth/*` |
| api-server (Nest) | 3001 | http://localhost:3001/api · Swagger `/api/docs` · health `/health` |
| event-cms | 3002 | http://localhost:3002 — organizer session via portal |
| auth | 3004 | http://localhost:3004 — redirects to portal login |
| api-mock | 3011 | http://localhost:3011/api — CI / Nest-off only, **not funds** |

Env: portal `NEXT_PUBLIC_API_BASE_URL` = `http://localhost:3001/api` (Nest product path) or `http://localhost:3011/api` (mock).  
CMS writes go through same-origin `/cms-api` (Vite BFF) and never carry `ADMIN_API_TOKEN` in the browser. Point the BFF at Nest with `EVENT_STACK_NEST_URL` (default `http://localhost:3001/api`) or at the mock with `EVENT_STACK_NEST_URL=http://localhost:3011/api`.  
`scripts/env-setup.sh` writes the Nest default. `DATABASE_URL` must be **postgresql** (Neon event-stack or `make db-up` on :5433). SQLite is rejected at boot. Identity is Better Auth on the portal; see [`docs/runbooks/identity.md`](./runbooks/identity.md). `ADMIN_API_TOKEN` is server-to-server only (cron/collector).

## Seed (no hand-editing the DB)

Fixtures: `libs/api-fixtures` (Prisma seed). Mock has its own in-memory / `event_stack_*` copy.

```bash
make db-up            # local Postgres :5433 if you are not using Neon
./scripts/env-setup.sh
make seed             # prisma migrate deploy + seed
```

Seeded published titles include **React 19 技術分享會** (`event_react19`).

## Happy path (one line)

CMS create/edit → **Nest** → portal list → detail.

### Live Nest

```bash
make db-up && ./scripts/env-setup.sh && make seed
make dev-api           # :3001  GET /health → storage: postgres
make dev-event-portal  # :3000  LINE/Google login at /zh-TW/login
make dev-event-cms     # :3002  gated by organizer/admin session
```

1. Sign in at http://localhost:3000/zh-TW/login (LINE or Google). Grant `organizer` or `admin` with `pnpm grant:identity-role`.
2. CMS http://localhost:3002/events — set title/location, visibility **public**, save.
3. Portal http://localhost:3000/zh-TW/events — new title appears (refresh).
4. Open the card → exhibition detail (official source / LINE).

### Contract mock (Nest off — not funds)

```bash
make dev-api-mock
# Portal + CMS BFF upstream:
NEXT_PUBLIC_API_BASE_URL=http://localhost:3011/api
EVENT_STACK_NEST_URL=http://localhost:3011/api
```

## Failure path (API down)

1. Stop Nest **and** api-mock (`make stop` or kill :3001 / :3011).
2. Reload http://localhost:3000/zh-TW/events.
3. Expect **目前無法載入活動** (`data-testid="event-stack-api-error"`), **not** a list of inlined mock arrays.

Auth bookmarks on **3004** redirect to the portal login; this script does not require `:3004`.

## Do not

- Point portal/CMS at Hobby `nx-event-stack-api` as if it were the live catalog API.
- Use `file:…sqlite` `DATABASE_URL`.
- Create a fifth Vercel project, buy a domain, or upgrade Pro.
- Force attendees through email/password (disabled; attendees are LINE/Google / LIFF / `user_demo`).
- Treat `ADMIN_API_TOKEN` as a CMS browser secret.
- Replace polyglot-labs Go WebAuthn with this stack.
- Use another company's LINE Official Account, LIFF, or Login channel.

## Attendee identity (LIFF)

Organizer and attendee login is **Better Auth** on event-portal (LINE Taiwan + Google; database httpOnly cookies). CMS BFF exchanges an organizer session for a short-lived JWT. Exhibition discovery chat is a **portal** Messaging webhook (`POST /api/line/webhook`) that queries Neon directly — not Nest, not the Render API. Setup: [`docs/runbooks/identity.md`](./runbooks/identity.md) and [`docs/runbooks/line-bot.md`](./runbooks/line-bot.md). Weekly digest (P4) is a Vercel cron on the portal: [`docs/runbooks/weekly-digest.md`](./runbooks/weekly-digest.md).

Public Vercel C-end talks to Hobby api-mock **memory** (`EVENT_STACK_STORE=memory`) or Neon for catalog search. Product updates events by editing `libs/api-fixtures/src/events.json` and redeploying, or via Nest writes.

Set `PORTAL_PUBLIC_URL` (portal origin) for LINE Flex “open detail” links.
