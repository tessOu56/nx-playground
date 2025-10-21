# PRD (Product Requirements Document) 規範

## 目的

定義產品需求文件的格式，用於 Profile 網站展示產品資訊和商業價值。

## Front Matter 格式

### 必填欄位

```yaml
---
id: 'profile'                    # 專案識別碼（與 README 一致）
version: '1.0.0'                 # 版本號（與專案版本同步）
category: 'react'                # 專案分類
status: 'production'             # 專案狀態
published: true                  # 是否在 Profile 顯示
shortDesc: |                     # 卡片簡短描述（2-3 行）
  簡短的產品描述
purpose: |                       # 產品目的/價值主張
  說明產品為何存在
highlights:                      # 產品亮點（使用者視角）
  - 亮點一
  - 亮點二
---
```

### 推薦欄位

```yaml
lastUpdated: '2025-10-21'        # PRD 更新日期
lastSync: '2025-10-21'           # i18n 同步日期
reviewer: 'tessou'               # 審核責任人
updateFrequency: 'per-feature'   # 更新頻率
useCases:                        # 使用場景
  - 場景一
  - 場景二
targetAudience: |                # 目標受眾
  描述目標使用者
```

### 治理欄位（生產級）

```yaml
reviewedAt: '2025-10-21'         # 審核日期
nextReview: '2025-11-21'         # 下次審核日期
draftStatus: false               # 是否為草稿
approvalStatus: 'approved'       # draft | pending | approved
changesSince: 'v1.0.0'           # 自哪個版本有變更
relatedDocs:                     # 相關文件
  - 'specs/apps/profile/CHANGELOG.md'
  - 'apps/profile/CHANGELOG.md'
```

### 統計欄位（Libs 專用）

```yaml
stats:
  components: 40                 # 元件數量
  hooks: 10                      # Hooks 數量
  utilities: 25                  # 工具函式數量
```

## category 可選值

### Apps
- `react` - React 應用
- `angular` - Angular 應用
- `vue` - Vue 應用
- `nextjs` - Next.js 應用

### Libs
- `ui` - UI 與設計
- `data` - 資料與狀態
- `utils` - 工具與輔助

## status 可選值

- `production` - 生產環境
- `development` - 開發中
- `coming-soon` - 即將推出

## updateFrequency 可選值

- `per-feature` - 每個功能更新
- `weekly` - 每週
- `monthly` - 每月
- `on-demand` - 按需求

## approvalStatus 可選值

- `draft` - 草稿
- `pending` - 待審核
- `approved` - 已批准

## 範例

### Apps PRD

```markdown
---
id: 'profile'
version: '1.2.0'
lastUpdated: '2025-10-21'
lastSync: '2025-10-21'
reviewer: 'tessou'
reviewedAt: '2025-10-21'
updateFrequency: 'per-feature'
category: 'react'
status: 'production'
published: true
shortDesc: |
  個人技術展示網站，採用 React 19 + Vite 構建，
  展示 monorepo 架構下的應用程式和共享函式庫。
purpose: |
  提供專業平台展示技術能力、專案架構和程式碼品質，
  協助技術招募和專案推廣。
highlights:
  - 清晰的專案分類展示
  - 即時技術文件搜尋
  - 響應式多語系介面
  - 技術標籤導航系統
useCases:
  - 技術面試作品展示
  - 開源專案推廣
  - 技術能力證明
targetAudience: |
  技術招募人員、潛在合作夥伴、開發者社群
draftStatus: false
approvalStatus: 'approved'
---

# Profile - 產品規格文件

## 產品概述

Profile 是一個專業的技術作品集平台...

## 功能需求

### FR-1: 專案展示
- 使用者可以瀏覽所有 Apps 和 Libs
- 每個專案顯示技術堆疊和核心功能
- 支援詳細頁面查看

### FR-2: 技術搜尋
- 使用者可以搜尋技術文件
- 支援按標籤篩選
- 即時搜尋結果

## 非功能需求

### NFR-1: 效能
- 首次載入 < 2s
- 互動延遲 < 100ms

### NFR-2: 可訪問性
- WCAG 2.1 AA 標準
- 鍵盤導航支援
```

### Libs PRD

```markdown
---
id: 'ui-components'
version: '2.1.0'
lastUpdated: '2025-10-21'
category: 'ui'
status: 'production'
published: true
shortDesc: |
  完整的 React UI 元件庫，基於 Radix UI 和 Tailwind CSS，
  提供 40+ 個可重用的元件。
purpose: |
  提供一致、可重用的 UI 元件，加速開發流程，
  確保所有應用程式的視覺一致性。
highlights:
  - 40+ 生產級元件
  - 完整 TypeScript 支援
  - Accessibility-first 設計
  - 深色模式支援
stats:
  components: 40
  hooks: 0
  utilities: 0
useCases:
  - 快速建立一致的使用者介面
  - 確保無障礙設計標準
  - 跨專案共享 UI 元件
---

# UI Components - 產品規格

...
```

## 注意事項

1. **版本同步**: PRD 的 `version` 必須與專案版本一致
2. **i18n 同步**: 更新中文版後，記得更新英文版並執行 `pnpm run prd:sync`
3. **審核流程**: 重大變更需要設置 `draftStatus: true` 並等待審核
4. **定期檢視**: 根據 `updateFrequency` 定期檢視和更新 PRD

## 驗證

```bash
# 驗證 Front Matter 格式
node specs/.scripts/validate-frontmatter.js

# 檢查 i18n 同步狀態
node specs/.scripts/sync-i18n.js

# 檢查版本一致性
node specs/.scripts/check-version.js
```

