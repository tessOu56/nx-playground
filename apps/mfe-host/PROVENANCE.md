# Provenance — mfe-host / mfe-ui

Re-implemented from [`tessOu56/micro_frontends`](https://github.com/tessOu56/micro_frontends) as Nx Module Federation apps. Turbo setup and git history were **not** copied.

| Field | Value |
| --- | --- |
| Source | https://github.com/tessOu56/micro_frontends |
| Source commit | `85f1b647514f2208d44833b1cfd8d6843668e91d` (2026-10-20, `feat: ship @my-org/ui as a built workspace library (#8)`) |
| Import method | Useful source only (Button + Web3 host copy). Not `git subtree`. |
| Source repo | Left unmodified |

## What the source was

The satellite is a Turbo + pnpm **host + workspace package** lab (`apps/web3` imports `@my-org/ui`). Its README states it is **not module federation**.

## What this repo does instead

Nx Module Federation (webpack) with a Consumer host and a Producer remote:

| App | Role | Port |
| --- | --- | --- |
| `mfe-host` | Vite-era Web3 host idea: “Hello from Web3!” + federated Button | 5173 |
| `mfe-ui` | Exposes `./Button` (original `@my-org/ui` Button) | 5174 |

Turbo, nested lockfiles, and the satellite `pnpm` overrides were not brought over.

## Dependencies added (required to build)

- `@nx/module-federation@22.7.12` on the two app packages (matches workspace Nx; not a root bump, not a downgrade)
