# STOP-013: LIFF LIVE verification (Wave I)

After owner fills LINE env on Vercel `nx-event-portal` and reports「STOP-013 已開、LIFF 可 init」:

## Required env (Vercel production)

- `NEXT_PUBLIC_LIFF_ID`
- `NEXT_PUBLIC_LINE_CLIENT_ID`
- `LINE_CLIENT_SECRET` (server only)

Delete any leftover `2007835339*` values.

## Redeploy

Production redeploy required so `NEXT_PUBLIC_*` bake into the client bundle.

## E2E checklist (phone LINE)

1. Open `https://nx-event-portal.vercel.app/zh-TW/events` inside LINE LIFF.
2. Complete checkout for a free or sandbox event.
3. Confirm order `userId` starts with `line_` (not `user_demo`) in order detail or Nest logs.
4. Ticket verify/check-in still works.

## Evidence

Update [`planning/outcomes/T-2026-226.outcome.yaml`](../../platform-command/planning/outcomes/T-2026-226.outcome.yaml) with LIVE URL + date (no secrets).
