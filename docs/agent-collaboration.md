# Agent 協作 — nx-playground

生態 SSOT：`platform-command/docs/agent-collaboration.md`

## Design system

Explore SDK 獨立 repo：**explore-design-sdk**（skill `claude-design` 在該 repo）。  
nx `libs/design-system` = Tailwind / Style Dictionary 適配層。

## Skills

| Skill | 路徑 | 用途 |
|-------|------|------|
| nx-affected-work | （待建） | Nx affected build/test |

## Commands

```bash
pnpm design:tokens
pnpm dev:vue-motion
```

## 跨 repo

- **explore-design-sdk**：L2/L3 token SSOT
- Mirror：勿在 vue-motion-sandbox / angular-dashboard-sandbox 開發
- Promote：prototype → ai-search-portal `labs/motion/`

