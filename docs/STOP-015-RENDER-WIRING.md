# STOP-015: after Render Nest is live, point funded paths at Nest (Wave I).

When owner reports STOP-015 with `https://<service>.onrender.com/health`:

## Render (already in repo)

- Blueprint: [`render.yaml`](../render.yaml)
- Build/start: [`scripts/render-event-stack-api.sh`](../scripts/render-event-stack-api.sh)
- Env (Dashboard, never commit): `DATABASE_URL` (existing Neon **event-stack** / `snowy-bird-20372699`, **direct/unpooled**), `CORS_ORIGIN`, optional `CMS_ORGANIZER_API_TOKEN`, `ALLOWED_ORGANIZER_EMAILS`, `EVENT_STACK_CMS_DEV_AUTH=false`
- Do **not** create a new Neon project. Copy DSN from Neon Console → Connect, or from Vercel `nx-event-stack-api` → `DATABASE_URL`. `render.yaml` has `sync: false` so Blueprint leaves the field empty until you paste it.

## Vercel `nx-event-portal`

Set production env (orders/tickets/confirm path):

```
NEXT_PUBLIC_API_BASE_URL=https://<render-host>.onrender.com/api
```

Redeploy production after env change (`NEXT_PUBLIC_*` is build-time).

## Optional hosted CMS

If event-cms is deployed later:

```
VITE_API_BASE_URL=https://<render-host>.onrender.com/api
VITE_CMS_ORGANIZER_API_TOKEN=<same as Render CMS_ORGANIZER_API_TOKEN>
```

## Smoke (after switch)

```bash
curl -sS "https://<render-host>.onrender.com/health"
curl -sS "https://<render-host>.onrender.com/api/stats" \
  -H "Authorization: Bearer <CMS_ORGANIZER_API_TOKEN>"
```

LIVE: create order → confirm → ticket verify on portal (sandbox payment or mock).

## Catalog note

Hobby `nx-event-stack-api` may stay memory for labelled catalog-only demos, or portal may use Nest for everything once Postgres is seeded on Render. Wave I default: **unify on Nest** when STOP-015 is green.
