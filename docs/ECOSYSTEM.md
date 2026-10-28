# Ecosystem pointer — nx-playground

## Role

Public **event + commerce** monorepo (portal / cms / api / auth). Planning SSOT is **platform-command**, not this file.

Angular and Vue slices are independent GitHub repos. Copies in this monorepo live under [`labs/`](../labs/README.md) as **legacy mirrors — do not extend**. Do not add features in both places.

| Repo | Today | After T-228 |
|------|-------|-------------|
| [vue-motion-sandbox](https://github.com/tessOu56/vue-motion-sandbox) | Pages LIVE; sync from nx | **canonical** |
| [angular-dashboard-sandbox](https://github.com/tessOu56/angular-dashboard-sandbox) | satellite canonical (Angular 22) | **canonical** |

Nx imports (this repo): [`apps/angular-dashboard`](../apps/angular-dashboard/README.md) (Angular 20.3.3) and [`apps/vue-motion`](../apps/vue-motion/README.md) (Vue 3 + Vite). Do not add features in both places.

SDK: [explore-design-sdk](https://github.com/tessOu56/explore-design-sdk) — consume directly; nx `libs/design-system` is one adapter, not the only door.

Tickets are not tracked here.
