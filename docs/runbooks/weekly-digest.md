# Weekly exhibition digest (P4)

Monday cron on **nx-event-portal**. Builds upcoming + newly listed exhibitions per city (Taipei / Tokyo) in **zh / ja / en**, then publishes through a `DigestPublisher` interface. Discord is the only implemented publisher; Threads and X are reserved ids only.

Route: `GET` or `POST` `/api/cron/weekly-digest`

Vercel cron (Hobby): `0 1 * * 1` — Monday 01:00 UTC (09:00 Taipei / 10:00 Tokyo).

## Env vars (set on Vercel project **nx-event-portal**)

| Name | Required | Production / Preview |
| --- | --- | --- |
| `CRON_SECRET` | **Yes** | Long random string. Vercel sends `Authorization: Bearer <CRON_SECRET>`. Route **401** if unset or mismatched. |
| `DISCORD_WEBHOOK_URL` | No | Discord incoming webhook. **No-op** when unset. Never commit or log this URL. |
| `DATABASE_URL` | Recommended | Neon event-stack (same pooled URL as search / LINE). Unset → sample fixtures. |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Portal origin used in listing links. Defaults to `https://nx-event-portal.vercel.app`. |

Do not put `DISCORD_WEBHOOK_URL` in chat, CI logs, or issue comments. Preview deploys without `DATABASE_URL` will classify **sample** rows; leave the Discord webhook unset on Preview unless you want sample posts.

Threads / X: do not add tokens yet. Implement another `DigestPublisher` and register it in `createConfiguredPublishers()` later.

## Local tests

```bash
node --import tsx --test \
  apps/event-portal/src/libs/digest/*.test.ts \
  apps/event-portal/src/app/api/cron/weekly-digest/route.test.ts
```

Manual trigger (after `CRON_SECRET` is set on the host):

```bash
curl -i -H "Authorization: Bearer $CRON_SECRET" \
  https://nx-event-portal.vercel.app/api/cron/weekly-digest
```

The JSON body reports city counts and publisher status (`published` / `skipped` / `failed`). It never includes the webhook URL.
