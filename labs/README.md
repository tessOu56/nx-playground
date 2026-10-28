# Labs — archived mirrors (not product)

This folder holds leftover showcase apps that are **not** on the product path
(`event-portal` + LINE exhibition discovery, `event-cms`, `api-server`, `api-mock`, `auth`).

| Folder | Canonical repo | Do not |
|--------|----------------|--------|
| `vue-motion/` | [vue-motion-sandbox](https://github.com/tessOu56/vue-motion-sandbox) | Add features here **and** in the sandbox |
| `enterprise-admin/` | [angular-dashboard-sandbox](https://github.com/tessOu56/angular-dashboard-sandbox) | Add features here **and** in the sandbox |

Nx-wired imports (not this folder): [`apps/angular-dashboard`](../apps/angular-dashboard/README.md), [`apps/vue-motion`](../apps/vue-motion/README.md).

They are excluded from the default Nx graph (`.nxignore`) and from the pnpm workspace
(`pnpm-workspace.yaml` lists `apps/*` + `libs/*` only). Interview / product demos never
start these apps — see [`docs/EVENT-STACK-DEMO.md`](../docs/EVENT-STACK-DEMO.md).

To run a leftover locally, use the satellite repo (or `cd` into the folder and use its
own `package.json` scripts). Do not extend these copies in this monorepo.
