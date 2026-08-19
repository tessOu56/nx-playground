# Event-stack how-to

> How-to only. Stages and tickets live in private **platform-command**.  
> Hosted: https://nx-event-portal.vercel.app/zh-TW/events — see `docs/HOSTED-DEMO.md`.

## Ports (do not drift)

| App | Port | URL |
| --- | --- | --- |
| event-portal | 3000 | http://localhost:3000 |
| api-server (Nest) | 3001 | http://localhost:3001/api · Swagger `/api/docs` |
| event-cms | 3002 | http://localhost:3002 |
| auth | 3004 | http://localhost:3004 |
| api-mock | 3011 | http://localhost:3011/api |

Env: `NEXT_PUBLIC_API_BASE_URL` / `VITE_API_BASE_URL` = `http://localhost:3001/api` (live) or `http://localhost:3011/api` (mock).  
To publish from local CMS to the hosted API, set `VITE_API_BASE_URL=https://nx-event-stack-api.vercel.app/api` in gitignored `.env.local`.  
`scripts/env-setup.sh` writes the live default. Do **not** point the portal at inlined `mockEvents` for this path.

## Seed (no hand-editing the DB)

Fixtures: `libs/api-fixtures` (Prisma seed + api-mock store).

```bash
npx prisma generate --schema=apps/api-server/prisma/schema.prisma
npx prisma db push --schema=apps/api-server/prisma/schema.prisma
make seed    # nx run @nx-playground/api-server:prisma-seed
```

Seeded published titles include **React 19 技術分享會** (`event_react19`).

## Happy path (one line)

CMS create/edit → Nest or api-mock → portal list → detail → register (checkout).

### Live Nest

```bash
make seed
make dev-api           # :3001
make dev-event-cms     # :3002
make dev-event-portal  # :3000
```

1. CMS http://localhost:3002/events — set title/location, visibility **public**, save.
2. Portal http://localhost:3000/zh-TW/events — new title appears (refresh).
3. Open the card → detail → 報名／checkout.

### Contract mock (Nest off)

```bash
make dev-api-mock
# Portal + CMS:
NEXT_PUBLIC_API_BASE_URL=http://localhost:3011/api
VITE_API_BASE_URL=http://localhost:3011/api
```

CMS POST still shows up on portal GET (stateful mock).

## Failure path (API down)

1. Stop Nest **and** api-mock (`make stop` or kill :3001 / :3011).
2. Reload http://localhost:3000/zh-TW/events.
3. Expect **目前無法載入活動** (`data-testid="event-stack-api-error"`), **not** a list of inlined mock arrays.
4. Detail with API down: same error kind on the event page, not a fake event body.

Auth stays on **3004** if you start it; this script does not require it.

## Do not

- Production Kratos hardening, LINE OA, real payments.
- Treat `docs/PROJECT-PLAN.md` as the roadmap.
