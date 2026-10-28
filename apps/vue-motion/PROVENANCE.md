# Provenance — vue-motion

Imported from [`tessOu56/vue-motion-sandbox`](https://github.com/tessOu56/vue-motion-sandbox) as an Nx Vite Vue application.

| Field | Value |
| --- | --- |
| Source | https://github.com/tessOu56/vue-motion-sandbox |
| Source commit | `5acfdf790dda38e0e96c6fa0c3e2b221b4b90380` (2026-10-20, `fix(security): upgrade Vite 6.4.4 and Vitest 4.1.12 (#65)`) |
| Import method | Source copy (not `git subtree`) |
| Source repo | Left unmodified |

## Why not git subtree

Subtree would drop a standalone Vite app (`package.json`, `pnpm-lock.yaml`, Tailwind 4 PostCSS, `.github/`) into `apps/vue-motion`. That does not integrate cleanly with this workspace:

- One lockfile / `apps/*` pnpm workspace (nested lockfile is forbidden)
- This monorepo is Tailwind **3.4** + Vite **7.3.7**; the satellite is Tailwind **4.3** + Vite **6.4.4**
- Nx `project.json` / `@nx/vite` targets replace the satellite `pnpm` scripts

The satellite stays canonical on GitHub. This app is the same product source compiled against workspace versions (no monorepo downgrade; source repo not reverted).

## Alignment applied here

- Build/serve/test/lint via Nx (`@nx/vite:build`, `@nx/vitest:test`, `@nx/eslint:lint`)
- Tailwind 3 `@tailwind` directives instead of Tailwind 4 `@import "tailwindcss"`
- GitHub Pages `base` `/nx-playground/vue-motion/` (satellite was `/vue-motion-sandbox/`)
- Workspace Vue 3.5.22, Vite 7.3.7, `@vueuse/core` 13.9, gsap 3.13, three 0.180 (satellite listed newer ranges; none of those workspace packages were downgraded)

## Dependencies added (required to build)

- `pinia@^3.0.4` — satellite store; not previously a workspace dependency
- `@vitejs/plugin-vue@^6.0.9` — Vite Vue plugin (workspace had `@vitejs/plugin-react` only)
- `@vue/test-utils@^2.4.6` — satellite unit tests
