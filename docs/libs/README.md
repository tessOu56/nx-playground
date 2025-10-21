# Shared Libraries Documentation

> NX Playground 共享函式庫文檔

**最後更新**: 2025-10-20

---

## 📦 Libraries 總覽

本 monorepo 共有 **9 個共享函式庫**，涵蓋 UI、數據、工具等多個層面。

---

## 🎨 UI & Design

### ui-components

**用途**: 23+ Radix UI 基礎組件庫

**包含**:

- Button, Card, Input, Select, Textarea
- Dialog, Sheet, Tabs, Tooltip
- Badge, Skeleton, Alert
- Form 系列組件

**技術**: React + Radix UI + Vanilla Extract

**使用**: `import { Button } from '@nx-playground/ui-components'`

---

### design-system

**用途**: Design tokens 系統和主題管理

**功能**:

- Style Dictionary 生成 design tokens
- CSS Variables (HSL 色彩系統)
- Tailwind 配置
- 主題切換（light/dark）

**技術**: Style Dictionary + CSS Variables

**文檔**: [libs/design-system/README.md](../../libs/design-system/README.md)

---

## 📊 Data & API

### api-client

**用途**: OpenAPI → React Query hooks 自動生成

**功能**:

- Orval 自動生成
- Type-safe API 調用
- React Query 整合

**技術**: Orval + @tanstack/react-query

---

### auth-client

**用途**: SSO 認證客戶端

**功能**:

- Ory Kratos 整合
- Session 管理
- 認證狀態

---

### enterprise-data (新)

**用途**: Angular 架構推演專案的資料處理層

**功能**:

- Models - 資料模型
- Services - 資料服務
- Transformers - 資料轉換
- Validators - 驗證邏輯

**專案**: enterprise-admin

**文檔**: [ENTERPRISE_DATA.md](./ENTERPRISE_DATA.md)

---

### animation-data (新)

**用途**: Vue 動畫 Sandbox 的數據處理層

**功能**:

- Presets - 預設動畫配置
- Transformers - CSS 轉換邏輯
- Exporters - JSON/CSS 導出
- Types - 動畫類型定義

**專案**: vue-motion

**文檔**: [ANIMATION_DATA.md](./ANIMATION_DATA.md)

---

## 🛠️ Utils

### hooks

**用途**: React hooks 集合

**包含**:

- 8 個自定義 hooks
- 20+ 重新導出的常用 hooks

**範例**:

- useDebounce
- useAsync
- useLocalStorage
- usePagination

---

### i18n

**用途**: 國際化支援

**功能**:

- Feature-based i18n
- Type-safe translation hooks
- i18next 整合
- next-intl 整合

**支援語言**: EN, ZH-TW

---

### charts

**用途**: 雙軌制圖表庫

**功能**:

- Recharts 封裝
- Chart.js 封裝
- 統一 API

**技術**: Recharts + Chart.js

---

## 📊 Libraries 對比

| Library         | 類型   | 框架依賴      | 使用專案                 |
| --------------- | ------ | ------------- | ------------------------ |
| ui-components   | UI     | React         | Profile, Event-CMS, Auth |
| design-system   | Design | 無            | 所有 React apps          |
| api-client      | Data   | React         | Event-CMS                |
| auth-client     | Auth   | React         | Auth, Event-CMS          |
| enterprise-data | Data   | 無            | Enterprise-Admin         |
| animation-data  | Data   | 無            | Vue-Motion               |
| hooks           | Utils  | React         | 所有 React apps          |
| i18n            | Utils  | React/Next.js | 所有 apps                |
| charts          | UI     | React         | Event-CMS                |

---

## 🔗 詳細文檔

- [Enterprise Data](./ENTERPRISE_DATA.md) - Angular 資料處理
- [Animation Data](./ANIMATION_DATA.md) - Vue 動畫數據

---

## 🚀 使用指南

### 在 Apps 中使用

```typescript
// UI Components
import { Button, Card } from '@nx-playground/ui-components';

// Design System
import { themeManager } from '@nx-playground/design-system';

// i18n
import { useI18n } from '@nx-playground/i18n';

// Hooks
import { useDebounce } from '@nx-playground/hooks';

// Data (Angular)
import { UserDataService } from '@nx-playground/enterprise-data';

// Animation (Vue)
import { CssGenerator } from '@nx-playground/animation-data';
```

---

**總計**: 9 個 libraries，涵蓋 UI、數據、工具等多個領域


