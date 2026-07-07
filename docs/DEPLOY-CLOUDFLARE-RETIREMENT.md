# Cloudflare profile deploy — retirement plan

**Status**: Phase 1 ✅ automatic CI stopped (2026-07-07) · Phase 2 optional full teardown

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

## Phase 2 — Full exit (pick a window)

Do when **at least one** is true:

- [ ] vue-motion-sandbox + angular-dashboard-sandbox both have live GitHub Pages demos
- [ ] profile motion promoted to ai-search-portal `labs/motion` (T-2026-011)
- [ ] No need to keep `nx-playground-profile` Cloudflare Pages project

Steps:

1. Delete or pause Cloudflare Pages project `nx-playground-profile`
2. Move `.github/workflows/deploy-profile.yml` → `.github/workflows/archive/deploy-profile.yml` (or delete)
3. Add banner to `CLOUDFLARE_DEPLOYMENT_GUIDE.md` → archived
4. Update `registry/projects.json` `deploy.notes` → "local only; Cloudflare retired"
5. Remove `cloudflare:*` npm scripts if unused (optional)

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
