# AGENTS.md — nx-playground

## Purpose

Nx monorepo for the **event + commerce integration stack**: `event-portal`, `event-cms`, `api-server`, `auth`.

**Planning SSOT is not this repo.** Stages and tickets live in private **platform-command** (`planning/projects/nx-playground.md`, `planning/portfolio-velocity.md`). Public `docs/PROJECT-PLAN.md` is setup/ports only.

**Tickets are not tracked here.** Paste the central ticket when implementing.

## Before coding

1. Runnable how-to: `docs/PROJECT-PLAN.md` (ports) · `docs/DEV-ENVIRONMENT.md` · `docs/CONTRACT-PIPELINE.md`.
2. Mirror status: `docs/ECOSYSTEM.md` — Angular/Vue independent repos; do not double-write.
3. Design system: consume `explore-design-sdk`; this repo’s `libs/design-system` is one adapter.
4. Long specs → link only; do not revive a public roadmap.

## Quick start

```bash
make setup          # or: pnpm install && scripts/env-setup.sh
# Platform differences: docs/DEV-ENVIRONMENT.md
pnpm dev:event-portal  # localhost:3000
pnpm dev:event-cms     # localhost:3002
pnpm dev:api           # localhost:3001
pnpm dev:api-mock      # localhost:3011 (same OpenAPI, in-memory)
pnpm dev:auth          # localhost:3004
```

Profile / vue-motion / enterprise-admin / mobile-approvals still exist on disk; **no new features** there until graduate tickets (platform-command T-228–230).

## Allowed

- `apps/event-portal`, `apps/event-cms`, `apps/api-server`, `apps/auth`, shared libs used by those apps, `docs/` how-to, `.cursor/`

## Forbidden

- Copying portal UI or agent-core from ai-search-portal into this repo
- New Angular/Vue features in both nx and the satellite repos
- New profile or mobile-approvals features (not event-stack)
- Committing `docs/platform-inbox/` (gitignored local-only path)
- Treating this repo’s PROJECT-PLAN as phase SSOT

## Integration

- SDK: `explore-design-sdk` (any framework)
- Portal HITL mobile mock is not event QR check-in

## 開發環境

- Node 22（`.nvmrc`/`engines`）· pnpm 10.13.1（`packageManager`，`corepack enable`）
- 平台差異：[docs/DEV-ENVIRONMENT.md](docs/DEV-ENVIRONMENT.md)
