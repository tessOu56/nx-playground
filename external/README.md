# external/ — 關聯的獨立 repo（git submodules）

此目錄放**以 git submodule 關聯進來的獨立 repo**，與 `apps/`（nx 原生擁有）區分。
每個 submodule 維持自己的 repo、CI 與部署；本 monorepo 只釘住其某個 commit。

- 加入：見 `platform-command/docs/repo-linking-pilot-ai-search-portal.md`
- 策略與取捨：`platform-command/docs/repo-linking-strategy.md`
- Nx 整合：對應 wrapper 在 `tools/external/<name>/project.json`（run-commands 委派，
  不污染子 repo 工作樹）；`external/*` 不納入 `pnpm-workspace.yaml`，避免巢狀 workspace 衝突。
- pin 記錄：`platform-command/registry/projects.json` 各專案的 `submodule` 欄位。

> 注意：先前一次失敗的 clone 可能在此留下殘骸 `external/ai-search-portal/.git`，
> 請先 `rm -rf external/ai-search-portal` 再執行正式的 `git submodule add`。
