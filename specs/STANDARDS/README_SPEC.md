# README Front Matter 規範

## 目的

定義專案 README 檔案的 Front Matter 格式，用於 Profile 網站讀取和展示技術資訊。

## Front Matter 格式

### 必填欄位

```yaml
---
id: 'profile'                    # 專案唯一識別碼（與資料夾名稱一致）
name: 'Profile'                  # 專案顯示名稱
version: '1.0.0'                 # 專案版本（與 package.json 同步）
description: '專案簡短描述'       # 一句話描述專案功能
techStack:                       # 技術堆疊陣列
  - React 19
  - Vite
  - TypeScript
features:                        # 核心功能列表
  - 功能一
  - 功能二
---
```

### 可選欄位

```yaml
demoUrl: 'https://example.com'   # 線上展示連結
repoUrl: 'https://github.com/...' # 儲存庫連結
lastUpdated: '2025-10-21'        # 最後更新日期（YYYY-MM-DD）
author: 'Your Name'              # 作者名稱
license: 'MIT'                   # 授權協議
```

## 範例

### Apps README

```markdown
---
id: 'profile'
name: 'Profile'
version: '1.2.0'
description: '專業的技術展示平台，展示個人技能、monorepo 專案和共享函式庫'
techStack:
  - React 19
  - Vite
  - i18n
  - Tailwind CSS
  - React Router
features:
  - Feature-based i18n 架構
  - Locale-based 路由系統
  - Design System 整合
  - Markdown 渲染引擎
  - 技術文件搜尋
demoUrl: 'https://profile.example.com'
repoUrl: 'https://github.com/user/nx-playground'
lastUpdated: '2025-10-21'
---

# Profile - 技術展示與 Portfolio 網站

> 專業的技術展示平台

## 安裝

\`\`\`bash
pnpm install
pnpm dev:profile
\`\`\`

## 技術架構

...
```

### Libs README

```markdown
---
id: 'ui-components'
name: 'UI Components'
version: '2.1.0'
description: '完整的 React UI 元件庫，基於 Radix UI 和 Tailwind CSS'
techStack:
  - React 19
  - Radix UI
  - Tailwind CSS
  - TypeScript
features:
  - 40+ 生產級元件
  - 完整 TypeScript 支援
  - Accessibility-first 設計
  - 深色模式支援
lastUpdated: '2025-10-21'
---

# UI Components

完整的元件庫文檔...
```

## 注意事項

1. **版本同步**: `version` 欄位必須與 `package.json` 中的版本一致
2. **唯一性**: `id` 必須與專案資料夾名稱完全一致
3. **技術堆疊**: `techStack` 中的技術名稱應與 `libs/profile/src/lib/techCategories.ts` 中的映射一致
4. **日期格式**: 所有日期使用 `YYYY-MM-DD` 格式
5. **YAML 語法**: 多行文字使用 `|` 或 `>`，陣列使用 `-` 開頭

## 驗證

使用以下指令驗證 Front Matter 格式：

```bash
node specs/.scripts/validate-frontmatter.js
```

