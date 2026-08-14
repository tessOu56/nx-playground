# AGENTS.md — nx-playground

## Purpose

Nx 21 monorepo 樞紐：跨框架前端練習、共享 charts、NestJS api-server.  
**Phase SSOT**：`docs/PROJECT-PLAN.md` · **Agent 協作**：`docs/agent-collaboration.md`

**Tickets are not tracked in this repo.** Use phase checklists in PROJECT-PLAN for in-repo work items.

## Before coding

1. Read `docs/PROJECT-PLAN.md` for current phase.
2. Read `docs/ECOSYSTEM.md` for mirror repo boundaries (vue-motion-sandbox, angular-dashboard-sandbox).
3. Read `docs/CONTRACT-PIPELINE.md` when touching API contracts.
4. **Design system**：消費 `explore-design-sdk`；規格見該 repo `docs/EXPLORE-SDK.md`。
5. Long specs → link only in docs; do not duplicate full vision bodies here.

## Quick start

```bash
make setup          # or: pnpm install && scripts/env-setup.sh
# Platform differences: docs/DEV-ENVIRONMENT.md + scripts/detect-platform.ps1
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
- Committing `docs/platform-inbox/` (gitignored local-only path)

## Integration

- Promote motion experiments → ai-search-portal `labs/motion/`
- API contract alignment → polyglot-labs `docs/api-contract.md`

## 開發環境（2026-07 統一）

- Node 22（`.nvmrc`/`engines`）· pnpm 10.13.1（`packageManager`，`corepack enable` 生效）
- 平台差異與 workaround：[docs/DEV-ENVIRONMENT.md](docs/DEV-ENVIRONMENT.md)
