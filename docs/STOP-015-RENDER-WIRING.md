# STOP-015: after Render Nest is live, point funded paths at Nest (Wave I).

When owner reports STOP-015 with `https://<service>.onrender.com/health`:

## Render (already in repo)

- Blueprint: [`render.yaml`](../render.yaml)
- Build/start: [`scripts/render-event-stack-api.sh`](../scripts/render-event-stack-api.sh)
- Env (Dashboard, never commit): `DATABASE_URL` (existing Neon **event-stack** / `snowy-bird-20372699`, **direct/unpooled**), `CORS_ORIGIN`, `ADMIN_API_TOKEN` (cron/collector Nest writes only; fail closed if unset; server-only), `AUTH_JWKS_URL` (`{BETTER_AUTH_URL}/api/auth/jwks`), `AUTH_JWT_ISSUER` (same as `BETTER_AUTH_URL`), `AUTH_JWT_AUDIENCE=event-stack-api`. Do not set `ALLOW_NONPROD_PAYMENTS` on the public host. Do not set `VITE_CMS_ORGANIZER_API_TOKEN` or `CMS_ORGANIZER_API_TOKEN`. See [`docs/runbooks/identity.md`](./runbooks/identity.md).
- Do **not** create a new Neon project. Copy DSN from Neon Console → Connect, or from Vercel `nx-event-stack-api` → `DATABASE_URL`. `render.yaml` has `sync: false` so Blueprint leaves the field empty until you paste it.
- **Build** = `pnpm install` + Nest webpack only (`HUSKY=0`). **Start** = `prisma migrate deploy` then `node dist/apps/api-server/main.js`. Empty `DATABASE_URL` fails at **start** with a clear message (not a cryptic webpack exit).

## Vercel `nx-event-portal`

Set production env (orders/tickets/confirm path):

```
NEXT_PUBLIC_API_BASE_URL=https://<render-host>.onrender.com/api
```

Redeploy production after env change (`NEXT_PUBLIC_*` is build-time).

## Optional hosted CMS

If event-cms is deployed later, serve it with the Vite BFF (`/cms-api`) — do not point the browser at Nest. Server-only env on that host (never `VITE_*` secrets):

```
EVENT_STACK_NEST_URL=https://<render-host>.onrender.com/api
VITE_AUTH_URL=https://nx-event-portal.vercel.app
BETTER_AUTH_URL=https://nx-event-portal.vercel.app
CMS_BFF_ORIGIN=https://<cms-host>
```

The CMS browser bundle always calls same-origin `/cms-api`. Do not create a fifth Vercel project.

## Smoke (after switch)

```bash
curl -sS "https://<render-host>.onrender.com/health"
curl -sS "https://<render-host>.onrender.com/api/stats" \
  -H "Authorization: Bearer <ADMIN_API_TOKEN>"
```

LIVE: create order → confirm → ticket verify on portal (sandbox payment or mock).

## Catalog note

Hobby `nx-event-stack-api` may stay memory for labelled catalog-only demos, or portal may use Nest for everything once Postgres is seeded on Render. Wave I default: **unify on Nest** when STOP-015 is green.
