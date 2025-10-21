---
id: tech-stack-data
name: Tech Stack Data
version: 0.0.1
description: Automatically collect and manage technology stack data from nx workspace
techStack:
  - TypeScript
  - Nx
  - Node.js
features:
  - Auto-collect from package.json
  - Manual data supplement
  - Project dependency analysis
  - Category classification
lastUpdated: '2025-10-21'
---

# @nx-playground/tech-stack-data

自動從 Nx workspace 和 package.json 收集技術堆疊資料的工具庫。

## 功能特點

- 🤖 **自動收集** - 從所有專案的 package.json 自動提取依賴
- 📊 **專案分析** - 分析哪些專案使用了哪些技術
- 🏷️ **自動分類** - 自動將技術分類（frontend, backend, tools, testing, deployment）
- ✍️ **手動補充** - 支援手動維護細節資訊（level, icon, color, url 等）
- 🔄 **合併策略** - 自動合併生成和手動資料

## 使用方式

### 安裝

```bash
# 作為內部 lib，已在 monorepo 中
pnpm install
```

### 導入

```typescript
import { techStack, techCategories, type TechItem } from '@nx-playground/tech-stack-data';

// 使用技術堆疊資料
techStack.forEach(tech => {
  console.log(`${tech.name} (${tech.category})`);
  console.log(`Used by: ${tech.projects?.join(', ')}`);
});

// 使用分類
console.log(techCategories.frontend.en); // "Frontend Frameworks"
```

## 收集技術堆疊

執行收集腳本：

```bash
# 在 lib 目錄下
cd libs/tech-stack-data
pnpm run collect

# 或使用 nx
nx run tech-stack-data:collect
```

這會：
1. 掃描所有 nx 專案
2. 讀取每個專案的 package.json
3. 提取所有依賴（dependencies, devDependencies, peerDependencies）
4. 分析專案相依性
5. 生成 `src/lib/generated-tech-stack.ts`

## 資料結構

### TechItem

```typescript
interface TechItem {
  name: string;
  category: 'frontend' | 'backend' | 'tools' | 'testing' | 'deployment';
  level?: 'expert' | 'advanced' | 'intermediate';
  icon?: string;
  color?: string;
  url?: string;
  version?: string;
  projects?: string[]; // 哪些專案使用此技術
}
```

## 手動維護

編輯 `src/lib/manual-tech-stack.ts` 添加或更新技術細節：

```typescript
export const manualTechStack: TechItem[] = [
  {
    name: 'React 19',
    category: 'frontend',
    level: 'expert',
    color: '#61DAFB',
    url: 'https://react.dev',
  },
  // ... more
];
```

## Build 流程

tech-stack-data 的 build 會自動執行 collect：

```bash
nx build tech-stack-data
# 1. 執行 collect (生成 generated-tech-stack.ts)
# 2. 編譯 TypeScript
# 3. 輸出到 dist/libs/tech-stack-data
```

## 開發原則

- **code-first**: 技術堆疊從實際 package.json 生成
- **自動化優先**: 盡可能自動收集，減少手動維護
- **手動補充**: 只有無法自動獲取的細節才手動維護

## License

MIT

