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

- **explore-design-sdk**：L2/L3 token SSOT；Angular／Vue 獨立後直接消費
- **vue-motion-sandbox / angular-dashboard-sandbox**：canonical after inversion — do not double-write with nx apps
- Planning：platform-command only

