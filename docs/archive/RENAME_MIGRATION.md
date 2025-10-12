# 專案重命名遷移指南

## 📅 更新日期
2025-10-12

## 🔄 重命名摘要

### 專案名稱變更

| 舊名稱 | 新名稱 | 說明 |
|--------|--------|------|
| `apps/console` | `apps/event-cms` | 活動內容管理系統 |
| `apps/events` | `apps/event-portal` | 公開活動展示平台 |
| `libs/vue-motion` | `apps/vue-motion` | 移至 apps，作為練習專案 |

### Package 名稱變更

| 舊名稱 | 新名稱 |
|--------|--------|
| `@nx-playground/console` | `@nx-playground/event-cms` |
| `@nx-playground/events` | `@nx-playground/event-portal` |

## 📝 主要變更

### 1. 配置檔案

**tsconfig.base.json**
```json
{
  "paths": {
    "@nx-playground/event-cms": ["apps/event-cms/src"],
    "@nx-playground/event-portal": ["apps/event-portal/src"],
    "@nx-playground/vue-motion": ["apps/vue-motion/src"]
  }
}
```

**package.json**
```json
{
  "scripts": {
    "dev:event-cms": "NX_CLOUD_NO_TIMEOUTS=true nx serve @nx-playground/event-cms",
    "dev:event-portal": "nx serve @nx-playground/event-portal"
  }
}
```

### 2. Makefile 命令

| 舊命令 | 新命令 |
|--------|--------|
| `make dev-console` | `make dev-event-cms` |
| `make dev-events` | `make dev-event-portal` |

### 3. 服務網址

| 服務 | URL | 說明 |
|------|-----|------|
| Event Portal | http://localhost:3000 | 活動展示平台 |
| Event CMS | http://localhost:3002 | 活動管理後台 |
| Profile | http://localhost:3003 | 技術展示 |
| Vue Motion | http://localhost:8080 | 動畫實驗 |
| Enterprise Admin | http://localhost:4200 | 企業管理 |

## 🚀 如何遷移本地開發

### 1. 更新代碼

如果你已經 clone 了舊版本：

```bash
# 拉取最新代碼
git pull origin main

# 清理舊的 node_modules 和建構產物
make clean

# 重新安裝依賴
make setup
```

### 2. 更新開發命令

**舊命令** → **新命令**

```bash
# 啟動服務
make dev-console    →  make dev-event-cms
make dev-events     →  make dev-event-portal

# 使用 pnpm
pnpm dev:console    →  pnpm dev:event-cms
pnpm dev:events     →  pnpm dev:event-portal

# 使用 Nx
nx serve @nx-playground/console  →  nx serve @nx-playground/event-cms
nx serve @nx-playground/events   →  nx serve @nx-playground/event-portal
```

### 3. 更新書籤

如果你有儲存本地開發的書籤：

- ~~Events~~: http://localhost:3000 → **Event Portal**: http://localhost:3000
- ~~Console~~: http://localhost:3002 → **Event CMS**: http://localhost:3002

## 📦 新功能

### libs/charts

專案重命名的同時，新增了圖表庫：

- **位置**: `libs/charts`
- **技術**: 雙軌制 (Recharts + Chart.js)
- **用途**: 為 React 應用提供圖表組件

**使用方式**:
```tsx
import { Recharts } from '@nx-playground/charts';

<Recharts.LineChart data={data} height={300} />
```

## 🏗️ 架構調整

### Vue Motion 移至 apps/

`libs/vue-motion` → `apps/vue-motion`

**原因**:
- Vue Motion 是獨立的練習專案，不作為共享函式庫
- 與其他 libs (React 專用) 定位不同
- 移至 apps 更符合專案性質

## 🔧 故障排除

### 問題 1: 找不到模組

**錯誤訊息**:
```
Cannot find module '@nx-playground/console'
```

**解決方案**:
```bash
# 確保已拉取最新代碼
git pull origin main

# 重新安裝依賴
pnpm install

# 清理 Nx 快取
nx reset
```

### 問題 2: Nx 無法識別專案

**解決方案**:
```bash
# 清理並重建
make clean
make setup
```

### 問題 3: TypeScript 錯誤

**解決方案**:
```bash
# 重建 TypeScript 配置
pnpm nx run-many --target=build --all
```

## 📚 相關文檔

- [根目錄 README](../README.md)
- [Event CMS README](../apps/event-cms/README.md)
- [Event Portal README](../apps/event-portal/README.md)
- [Charts Library README](../libs/charts/README.md)

## 🎯 未來計劃

### 可能的進一步重命名

- `apps/angular-dashboard` 可能重命名為 `apps/enterprise-admin`（待評估）

### 專案定位

| 專案 | 定位 | 技術棧 |
|------|------|--------|
| **Event CMS** | 輕量級 CMS，管理活動內容 | React + Vite |
| **Event Portal** | 公開展示平台，用戶瀏覽活動 | Next.js 15 |
| **Enterprise Admin** | 企業級管理，RBAC、審計 | Angular 20 |
| **Profile** | 技術棧展示，Nx & React 功能 | React + Vite |
| **Vue Motion** | 動畫效果實驗 | Vue 3 |

## ✅ 檢查清單

遷移完成後，請確認：

- [ ] 所有服務可以正常啟動
- [ ] 沒有 TypeScript 錯誤
- [ ] 所有測試通過
- [ ] 書籤已更新
- [ ] 團隊成員已通知

---

**注意**: 所有變更已使用 `git mv` 保留文件歷史，不會影響 Git blame 和歷史追蹤。
