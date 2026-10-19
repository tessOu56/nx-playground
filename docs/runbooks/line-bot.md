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

LINE Login ID-token verification (P1) stays on `/api/line/auth/token` and `/api/line/auth/id-token` using `NEXT_PUBLIC_LINE_CLIENT_ID` = `2011182044`.

## 3. GitHub `DATABASE_URL` secret (Taipei collector)

Repo **tessOu56/nx-playground** → Settings → Secrets and variables → Actions → New repository secret:

| Name | Value |
| --- | --- |
| `DATABASE_URL` | Same Neon URL the webhook uses |

Workflow: `.github/workflows/collect-taipei.yml`

- Cron: `0 19 * * *` (03:00 Asia/Taipei)
- Also **workflow_dispatch** (Actions → “Taipei exhibition collector” → Run workflow)
- If the secret is missing, the job **exits 0** and prints a skip notice (no failed red X).

The collector applies Prisma migrations (including `pg_trgm`) then upserts Ministry of Culture open data for **Taipei City** (`source = moc-opendata`).

Local dry run (after `make db-up` and `make seed`):

```bash
pnpm exec tsx tools/collectors/moc-taipei/run.ts
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

Tokyo collectors are out of scope for P2.
