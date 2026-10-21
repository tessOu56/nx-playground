# Identity — Better Auth (phase 1)

Attendees and organizers sign in on **event-portal** with LINE (Taiwan) or Google. There is no email/password and no passkeys yet. Nest verifies short-lived JWTs via JWKS. CMS uses an organizer session, never `ADMIN_API_TOKEN`. That token stays server-to-server (cron / collector Nest writes only).

Operator: **Tess**. Do not paste secret values into git or chat.

## Callback URLs (register these, names only)

| Provider | Console field | Value |
| --- | --- | --- |
| LINE Login (Taiwan channel) | Callback URL | `{BETTER_AUTH_URL}/api/auth/callback/line-tw` |
| Google | Authorized redirect URI | `{BETTER_AUTH_URL}/api/auth/callback/google` |
| Google | Authorized JavaScript origins | `{BETTER_AUTH_URL}` (and `http://localhost:3000` for local) |

Local `BETTER_AUTH_URL` is `http://localhost:3000`. Production is `https://nx-event-portal.vercel.app`.

## LINE Developers (Login / LIFF channel — not Messaging)

Keep Messaging webhook on `/api/line/webhook` unchanged (see [`line-bot.md`](./line-bot.md)).

On the **LINE Login** channel:

1. LINE Login → Callback URL = `{BETTER_AUTH_URL}/api/auth/callback/line-tw` (local and production as separate entries if the console allows both).
2. Keep `NEXT_PUBLIC_LINE_CLIENT_ID` = Login channel ID.
3. Keep `LINE_CLIENT_SECRET` = Login channel secret.
4. Keep `NEXT_PUBLIC_LIFF_ID` for in-app LIFF. LIFF signs in with the ID token through Better Auth (`provider` `line-tw`).

Do not mix Messaging `LINE_CHANNEL_SECRET` / `LINE_CHANNEL_ACCESS_TOKEN` with Login.

## Google Cloud Console

1. APIs & Services → Credentials → Create **OAuth client ID** → Web application.
2. Authorized JavaScript origins: production `BETTER_AUTH_URL` and `http://localhost:3000`.
3. Authorized redirect URIs: `{BETTER_AUTH_URL}/api/auth/callback/google` and `http://localhost:3000/api/auth/callback/google`.
4. Copy client ID / secret into env vars below (dashboard only).

## Env vars (names only)

### event-portal (Vercel `nx-event-portal` + local `.env`)

| Name | Purpose |
| --- | --- |
| `BETTER_AUTH_SECRET` | Cookie / session signing. Required in production. Generate locally (`openssl rand -base64 32`); never commit. |
| `BETTER_AUTH_URL` | Public origin of the auth handler (`https://nx-event-portal.vercel.app` or `http://localhost:3000`). JWT `iss`. |
| `BETTER_AUTH_TRUSTED_ORIGINS` | Optional extra comma-separated origins (hosted CMS). Local defaults include portal/CMS/auth ports. |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID. |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret. |
| `NEXT_PUBLIC_LINE_CLIENT_ID` | LINE Login channel ID (Taiwan). |
| `LINE_CLIENT_SECRET` | LINE Login channel secret. |
| `NEXT_PUBLIC_LIFF_ID` | LIFF ID (in-app). |
| `NEXT_PUBLIC_SITE_URL` | Portal origin; fallback for `BETTER_AUTH_URL`. |
| `DATABASE_URL` | Same Neon Postgres as Nest (identity tables live here). |

### api-server (Render `nx-event-stack-nest` + local)

| Name | Purpose |
| --- | --- |
| `AUTH_JWKS_URL` | `{BETTER_AUTH_URL}/api/auth/jwks`. If unset, derived from `AUTH_JWT_ISSUER` / `BETTER_AUTH_URL`. |
| `AUTH_JWT_ISSUER` | Must match `BETTER_AUTH_URL`. |
| `AUTH_JWT_AUDIENCE` | Optional; default `event-stack-api`. |
| `BETTER_AUTH_URL` | Fallback issuer when `AUTH_JWT_ISSUER` is unset. |
| `ADMIN_API_TOKEN` | **Cron / collector server-to-server only.** Not used by CMS. |
| `DATABASE_URL` | Neon (migrate identity tables). |

### event-cms (local Vite BFF)

| Name | Purpose |
| --- | --- |
| `VITE_AUTH_URL` | Portal origin (`http://localhost:3000`). Browser login + BFF `get-session`. |
| `BETTER_AUTH_URL` | Optional BFF override; defaults to `VITE_AUTH_URL`. |
| `EVENT_STACK_NEST_URL` | Nest upstream (`http://localhost:3001/api`). |
| `CMS_BFF_ORIGIN` | Optional allowlist for production mutating Origin checks. |

Removed: `KRATOS_PUBLIC_URL`, `VITE_ORY_PUBLIC_API`, `VITE_KRATOS_PUBLIC_URL`, `ALLOWED_ORGANIZER_EMAILS`, `EVENT_STACK_CMS_DEV_AUTH`.

## First admin

Roles are **not** inferred from email. After Tess signs in once (LINE or Google):

```bash
pnpm exec tsx scripts/grant-identity-role.ts --role admin --email <signed-in-email>
# or
pnpm exec tsx scripts/grant-identity-role.ts --role admin --line-sub <LINE sub>
# or
pnpm exec tsx scripts/grant-identity-role.ts --role admin --user-id <identity_user.id>
```

Then grant `organizer` the same way. Attendees have no `user_role` row.

## Local happy path

```bash
make db-up && ./scripts/env-setup.sh && make seed
make dev-api
make dev-event-portal
make dev-event-cms
```

1. Open http://localhost:3000/zh-TW/login — LINE and/or Google.
2. Grant `admin` or `organizer` with the script above.
3. CMS http://localhost:3002/events uses the portal session cookie (localhost is host-only, ports share it).
4. `apps/auth` on :3004 only redirects to the portal login.

Migrate deploy creates `identity_*` and `user_role`. LINE `sub` maps to `identity_account (providerId=line-tw, accountId=sub)` so returning LINE users are the same row.
