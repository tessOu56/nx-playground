# LINE Official Account setup — exhibition discovery (P2)

First user: **Tess**. The bot searches the Neon catalog from the Vercel Hobby portal (it does **not** call the sleeping Render Nest API).

Webhook URL (production):

```
https://nx-event-portal.vercel.app/api/line/webhook
```

## Two LINE channels (do not mix)

Tess has **two different LINE Developers channels**. Secrets from one will not work on the other. Channel IDs and the LIFF ID are public identifiers; **never commit secrets** (channel secret, access token, Login channel secret).

| | Messaging API (exhibition chat) | LINE Login / LIFF (attendee identity) |
| --- | --- | --- |
| Channel ID | `2012101436` | `2011182044` |
| Product | Official Account **@006dcvmv** | LIFF ID `2011182044-WawDftvY` |
| Used for | Webhook HMAC + Reply API | ID token verify (`aud` = Login channel ID) |
| Vercel env | `LINE_CHANNEL_SECRET` | `NEXT_PUBLIC_LINE_CLIENT_ID` (= `2011182044`) |
| | `LINE_CHANNEL_ACCESS_TOKEN` | `LINE_CLIENT_SECRET` |
| | | `NEXT_PUBLIC_LIFF_ID` (= `2011182044-WawDftvY`) |

Do not put the Messaging channel ID into `NEXT_PUBLIC_LINE_CLIENT_ID`, and do not use Login/LIFF secrets as `LINE_CHANNEL_SECRET`. Never use leftover employer IDs (`2007835339*`).

## 1. Vercel env vars (`nx-event-portal`)

In the Vercel dashboard → project **nx-event-portal** → Settings → Environment Variables, set for **Production** (and Preview if you want the Verify button on preview URLs):

| Name | Channel | Value |
| --- | --- | --- |
| `LINE_CHANNEL_SECRET` | Messaging `2012101436` | Channel **secret** (LINE Developers → Messaging API) |
| `LINE_CHANNEL_ACCESS_TOKEN` | Messaging `2012101436` | Long-lived **channel access token** |
| `NEXT_PUBLIC_LINE_CLIENT_ID` | Login `2011182044` | Login channel ID (ID-token `client_id` / `aud`) |
| `LINE_CLIENT_SECRET` | Login `2011182044` | Login channel secret (token exchange only) |
| `NEXT_PUBLIC_LIFF_ID` | Login / LIFF | `2011182044-WawDftvY` |
| `DATABASE_URL` | — | Neon event-stack Postgres URL (same DB as Nest). Use the **pooled** connection string if Neon shows one. |
| `PORTAL_PUBLIC_URL` | — | `https://nx-event-portal.vercel.app` (Flex “open detail” buttons) |
| `NEXT_PUBLIC_SITE_URL` | — | `https://nx-event-portal.vercel.app` |

Never paste secret values into git. Local copies live in gitignored `.env`. See `.env.example`.

Redeploy **nx-event-portal** after saving env vars so the Node serverless function picks them up.

## 2. LINE Developers Console (Messaging API channel `2012101436`)

Use Tess’s Official Account **@006dcvmv** (Messaging API). The Login/LIFF channel has no webhook URL field that this bot uses.

1. Open channel **2012101436** → **Messaging API**.
2. **Webhook URL** = `https://nx-event-portal.vercel.app/api/line/webhook`
3. **Use webhook** = **ON**
4. Turn **Auto-reply** / greeting messages **OFF** (otherwise LINE answers before our Flex carousel).
5. Click **Verify**. Expect success (the route returns `200` after a valid `x-line-signature` from `LINE_CHANNEL_SECRET`).
6. Optional: enable **Webhook redelivery** if offered.

The handler verifies `x-line-signature = base64(HMAC-SHA256(raw body, LINE_CHANNEL_SECRET))` with a timing-safe compare, then replies with the **Reply API** only (no Push in this phase).

In-app fixed-window limits (60s) run **before** HMAC / LINE OAuth: webhook `180`, token exchange `20`, id-token verify `30`. Exceeded requests return **429** + `Retry-After`. Counters are shared across Vercel isolates via Upstash Redis REST (`UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`) or Neon `portal_kv` (when `DATABASE_URL` is set), and fall back to in-process memory if the store is down. Set `LINE_RATE_LIMIT=0` to disable locally. This is not a substitute for Vercel Firewall.

LINE Login tokens from `/api/line/auth/token` and `/api/line/auth/session` are stored in **httpOnly Secure SameSite=Lax** cookies (`nx_line_at`, `nx_line_it`). JSON responses never include `accessToken` / `idToken`. `GET /api/line/auth/session` returns profile claims; `DELETE` logs out.

Signed webhooks are processed only when `timestamp` is within 10 minutes and `webhookEventId` has not been seen (24h TTL in the same shared store).

LINE Login ID-token verification (P1) stays on `/api/line/auth/token` and `/api/line/auth/id-token` using `NEXT_PUBLIC_LINE_CLIENT_ID` = `2011182044`.

## 3. GitHub collector secrets (least-privilege)

Repo **tessOu56/nx-playground** → Settings → Secrets and variables → Actions:

| Name | Value |
| --- | --- |
| `COLLECTOR_DATABASE_URL` | Neon URL for role `event_collector` (SELECT/INSERT/UPDATE on `events` + `event_embeddings` only) |
| `DATABASE_URL` | Owner/admin Neon URL — **migrate deploy only**, not collect/backfill |

Collect and embedding backfill steps receive **only** `COLLECTOR_DATABASE_URL`. They do not get the owner `DATABASE_URL`. Local CLI still falls back to `DATABASE_URL` when `COLLECTOR_DATABASE_URL` is unset.

### One-time Neon / local Postgres steps (owner role)

1. Apply migrations (creates `portal_kv` and role `event_collector`):

```bash
pnpm exec prisma migrate deploy --schema=apps/api-server/prisma/schema.prisma
```

2. Set a strong password (do not commit it):

```sql
ALTER ROLE event_collector PASSWORD '<generate-a-long-random-secret>';
```

3. Build the collector DSN from the same host/db as the owner URL, swapping the user:

`postgresql://event_collector:<password>@<neon-host>/<db>?sslmode=require`

Local docker example after `make db-up`:

`COLLECTOR_DATABASE_URL=postgresql://event_collector:<password>@127.0.0.1:5433/event_stack`

4. Add GitHub Actions secret `COLLECTOR_DATABASE_URL`. Keep owner `DATABASE_URL` for `prisma migrate deploy` in CI/Render only.

5. Optional: remove `DATABASE_URL` from the collect/backfill mental model. Do not paste the owner URL into `COLLECTOR_DATABASE_URL`.

The role cannot read `users`, `sessions`, `forms`, or `portal_kv`, and cannot DELETE catalog rows or run DDL.

Workflow: `.github/workflows/collect-taipei.yml`

- Cron: `0 19 * * *` (03:00 Asia/Taipei)
- Also **workflow_dispatch** (Actions → “Taipei exhibition collector” → Run workflow)
- If `COLLECTOR_DATABASE_URL` is missing, the job **exits 0** and prints a skip notice (no failed red X).

The collector applies Prisma migrations **when owner `DATABASE_URL` is set** (including `pg_trgm`, CJK FTS `search_tsv`, pgvector, `portal_kv`, and the collector role) then upserts Ministry of Culture open data for **Taipei City** (`source = moc-opendata`). When `EMBEDDING_PROVIDER` + `EMBEDDING_API_KEY` are set, it also backfills document embeddings; otherwise that step is a no-op. Tokyo collectors are a separate workflow (`.github/workflows/collect-tokyo.yml`). Embedding backfill is optional and no-ops when provider env is unset.

## 3b. Exhibition search (Phase 3)

Catalog (`/{locale}/events`) and the Messaging webhook share `searchExhibitions()` → `GET /api/exhibitions/search`.

| Env | Behavior |
| --- | --- |
| `DATABASE_URL` set (Neon pooled URL, same as Nest) | Postgres FTS: generated `search_tsv` (CJK unigram+bigram tokens, `simple` config) plus `pg_trgm`. With embeddings present **and** query-time provider env on the portal, rank is hybrid FTS + cosine. |
| `DATABASE_URL` unset | Sample fixtures (`libs/api-fixtures`, titles tagged `[Sample]`) |
| Embedding provider unset / no key | FTS-only. No embedding HTTP calls. |

Owner apply once on Neon (Render Nest start and the Taipei collector workflow already run `prisma migrate deploy`):

```bash
pnpm exec prisma migrate deploy --schema=apps/api-server/prisma/schema.prisma
```

That migration enables `vector` and adds `event_embeddings.embedding`. Local Docker must use `pgvector/pgvector:pg16` (`make db-up`).

Optional semantic search (portal query embed + collector backfill). Set the same names on Vercel **nx-event-portal**, GitHub Actions (collector), and Render Nest if you want CMS writes to embed:

| Name | Where | Notes |
| --- | --- | --- |
| `EMBEDDING_PROVIDER` | vars / env | `openai` or `openai-compatible` |
| `EMBEDDING_API_KEY` | secret | never commit |
| `EMBEDDING_API_BASE_URL` | vars | required for `openai-compatible`; defaults to OpenAI for `openai` |
| `EMBEDDING_MODEL` | vars | default `text-embedding-3-small` |
| `EMBEDDING_DIMENSIONS` | vars | optional; omit unless the model accepts it |

Then backfill (or wait for the next collector run):

```bash
pnpm embed:exhibitions
```

Preview deployments without `DATABASE_URL` stay on sample data; set Preview `DATABASE_URL` to search the live catalog. Preview without embedding env stays on FTS.

Local dry run (after `make db-up` and `make seed`):

```bash
pnpm exec tsx tools/collectors/moc-taipei/run.ts
pnpm exec tsx tools/collectors/tokyo/run.ts
```

## 4. How to test

1. Add Official Account **@006dcvmv** as a friend on LINE.
2. Send `說明` (or `help` / `使い方`). Expect a usage message and chips such as `台北 本週`, `東京 週末`.
3. Tap **台北 本週** or type `台北 攝影`. Expect a Flex carousel (image, title, venue, local dates, price, button to `/{locale}/events/{id}`).
4. Send a nonsense keyword. Expect a friendly no-results message plus the same chips.
5. LINE Developers (channel **2012101436**) → Verify still succeeds after these chats.

If Verify fails: confirm Production env vars are the **Messaging** secret/token (not Login), latest production deploy, and that the webhook path is `/api/line/webhook` (not the Login `/api/line/auth/token` route).

## Source terms (Ministry of Culture)

Taipei listings come from [文化部開放資料](https://cloud.culture.tw/) exhibition JSON (`SearchShowAction.do?method=doFindTypeJ&category=6`). We keep **Taipei City** rows only, store a **short summary + link** (not the full `descriptionFilterHtml` copy), and upsert on `(source, externalId)`. Respect the source’s published terms and attribution; do not republish full copyrighted exhibition text.

## Source terms (Tokyo collectors)

Tokyo listings come from official RSS/APIs and TMG open data only. Each source, robots.txt note, and licence is in [`tools/collectors/tokyo/SOURCES.md`](../../tools/collectors/tokyo/SOURCES.md). We store a **short summary + link**, upsert on `(source, externalId)`, and fill `data.i18n` (ja/en/zh) when the publisher provides those languages.

| Cron | Workflow |
| --- | --- |
| `0 18 * * *` (03:00 Asia/Tokyo) | `.github/workflows/collect-tokyo.yml` |

Same `COLLECTOR_DATABASE_URL` secret as Taipei. Missing secret → skip with exit 0.

Sources in this phase: Tokyo Metropolitan Teien Art Museum exhibition REST (ja/en/zh-tw), Arts Council Tokyo festivals RSS, CCBT events RSS, TMG recommended event CSV (CC BY 4.0; live file is still the 2018–19 snapshot).
