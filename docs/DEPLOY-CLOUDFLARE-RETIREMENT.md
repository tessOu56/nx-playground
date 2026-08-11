# Cloudflare profile deploy — retirement plan

**Status**: Phase 1 ✅ automatic CI stopped (2026-07-07) · Phase 2 ✅ workflow archived (2026-08-11, Cloudflare Pages project deletion deferred to owner)

## Why retire automatic deploy

| Issue | Detail |
|-------|--------|
| Never green | Runs #8–#12 failed at Deploy (secrets / Cloudflare project not maintained) |
| Wrong trigger scope | `libs/**` + `pnpm-lock.yaml` fired on unrelated monorepo work (e.g. contracts-ci) |
| Strategy drift | Portfolio chose **mirror-out + GitHub Pages** for showcases (vue-motion-sandbox live) |
| App role | `apps/profile` is a **React motion lab** → promote to ai-search-portal `labs/motion`, not a public URL |

Canonical deploy strategy: [develop-md integrated-roadmap D1](https://github.com/tessOu56/develop-md/blob/main/vision/platform-2026-integrated-roadmap.md) — GitHub Pages first; Cloudflare as optional backup for **other** use cases (e.g. private-repo static sites).

## Phase 1 — Done (maintenance-only)

- [x] Remove `on.push` from `.github/workflows/deploy-profile.yml`
- [x] `workflow_dispatch` only, with `confirm: DEPLOY` gate + `reason` audit field
- [x] Ticket T-2026-031 in platform-command

### Manual deploy (non-routine)

1. GitHub → **Actions** → **Deploy Profile to Cloudflare Pages** → **Run workflow**
2. Fill **reason** (e.g. "verify Cloudflare token before account cleanup")
3. **confirm** = `DEPLOY` (exact match)
4. Requires repo secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`

Use only for: token rotation smoke test, one-off demo before archive, or debugging build output — **not** part of normal dev loop.

## Phase 2 — Full exit (done 2026-08-11)

Trigger criterion met: vue-motion-sandbox already has a live GitHub Pages demo
(`.github/workflows/deploy-pages.yml`), confirming the mirror-out + Pages strategy is the
portfolio's real showcase path and `nx-playground-profile` on Cloudflare is no longer needed
as an active deploy target.

Steps:

1. ~~Delete or pause Cloudflare Pages project `nx-playground-profile`~~ — **deferred to owner**
   (requires interactive Cloudflare dashboard / API token access not available to the agent
   sandbox). Manual step: Cloudflare dashboard → Pages → `nx-playground-profile` → Settings →
   Delete project (or leave paused; no billing impact on the free tier).
2. [x] Moved `.github/workflows/deploy-profile.yml` → `.github/workflows/archive/deploy-profile.yml`
   — GitHub Actions no longer registers it (only top-level `.github/workflows/*.yml` files run).
3. [x] Banner added to `CLOUDFLARE_DEPLOYMENT_GUIDE.md` marking the profile section archived.
4. [x] `registry/projects.json` `deploy.notes` updated (platform-command) — local only; Cloudflare
   Pages project deletion deferred to owner.
5. `cloudflare:*` npm scripts left as-is (harmless no-ops without the workflow trigger; optional
   future cleanup).

## Alternatives (preferred showcase path)

| Need | Path |
|------|------|
| Vue motion demo | [vue-motion-sandbox](https://tessou56.github.io/vue-motion-sandbox/) (mirror + Pages) |
| Angular dashboard demo | angular-dashboard-sandbox Pages (W5 roadmap) |
| React profile motion in product | ai-search-portal `labs/motion` (T-2026-011) |
| Portfolio static site from private repo | Cloudflare Pages on **platform-command** public slice — separate ticket, not profile |

## References

- `platform-command/planning/projects/nx-playground.md` — deploy STOP-optional
- `platform-command/planning/tickets/T-2026-031.yaml`
- `CLOUDFLARE_DEPLOYMENT_GUIDE.md` — legacy multi-app guide (profile section superseded)
