# AGENTS.md — nx-playground

## Purpose

Nx 21 monorepo 樞紐：跨框架前端練習、共享 charts、NestJS api-server。  
**中央規劃 SSOT**：`platform-command/planning/projects/nx-playground.md`  
**階段 SSOT**：`docs/PROJECT-PLAN.md` · **生態**：`platform-command/docs/agent-collaboration.md`

## Before coding

1. Read [`docs/platform-inbox/PROFILE.md`](docs/platform-inbox/PROFILE.md) for business×technical×objectives context (platform-command 派送).
2. Read `docs/PROJECT-PLAN.md` for current phase.
3. Read `docs/platform-inbox/CURRENT.md` for P0/P1 tickets from platform-command.
4. Read `docs/ECOSYSTEM.md` for mirror repo boundaries (vue-motion-sandbox, angular-dashboard-sandbox).
5. **Design system**：消費 `explore-design-sdk`；規格見該 repo `docs/EXPLORE-SDK.md`。
6. Long specs → **develop-md**; link only, do not duplicate.

## Quick start

```bash
make setup          # or: pnpm install && scripts/env-setup.sh
# Windows / CI differences: docs/DEV-ENVIRONMENT.md + scripts/detect-platform.ps1
pnpm dev:api        # localhost:3001
pnpm dev:profile    # localhost:3003
pnpm dev:vue-motion # localhost:8080
pnpm dev:enterprise # localhost:4200
```

## Allowed

- `apps/*`, `libs/*`, `docs/`, `.cursor/` (project skills/hooks)

## Forbidden

- Copying portal UI or agent-core from ai-search-portal into this repo
- New features in vue-motion-sandbox or angular-dashboard-sandbox (mirror repos only)
- Replacing develop-md vision bodies (link only)

## Integration

- Tickets: `docs/platform-inbox/` ← `platform-command/scripts/distribute-inbox.ps1`
- Promote motion experiments → ai-search-portal `labs/motion/`
- API contract alignment → polyglot-labs `docs/api-contract.md`

## 開發環境（2026-07 統一）

- Node 22（`.nvmrc`/`engines`）· pnpm 10.13.1（`packageManager`，`corepack enable` 生效）
- 平台差異與 workaround：[docs/DEV-ENVIRONMENT.md](docs/DEV-ENVIRONMENT.md)；生態矩陣：`platform-command/docs/dev-environment.md`
- Claude/Cowork agent sandbox 限制：`platform-command/docs/cowork-sandbox.md`
