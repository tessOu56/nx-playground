# Ecosystem pointer — nx-playground

## Role

Public **event + commerce** monorepo (portal / cms / api / auth). Planning SSOT is **platform-command**, not this file.

Angular and Vue slices are independent GitHub repos. Until mirror inversion (platform-command T-228), `apps/vue-motion` and `apps/enterprise-admin` still exist here as copies — **do not add features in both places**.

| Repo | Today | After T-228 |
|------|-------|-------------|
| [vue-motion-sandbox](https://github.com/tessOu56/vue-motion-sandbox) | Pages LIVE; sync from nx | **canonical** |
| [angular-dashboard-sandbox](https://github.com/tessOu56/angular-dashboard-sandbox) | sync from nx | **canonical** |

SDK: [explore-design-sdk](https://github.com/tessOu56/explore-design-sdk) — consume directly; nx `libs/design-system` is one adapter, not the only door.

Tickets are not tracked here.
