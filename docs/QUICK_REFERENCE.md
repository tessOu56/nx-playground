# 快速參考

> 常用命令、網址和配置速查表

## 🚀 開發命令

### 啟動服務

```bash
# 使用 Makefile
make dev-event-cms       # Event CMS (http://localhost:3002)
make dev-event-portal    # Event Portal (http://localhost:3000)
make dev-profile         # Profile (http://localhost:3003)
make dev-enterprise      # Enterprise Admin (http://localhost:4200)
make dev-vue             # Vue Motion (http://localhost:8080)

# 或使用 pnpm
pnpm dev:event-cms
pnpm dev:event-portal
pnpm dev:profile
pnpm dev:enterprise
pnpm dev:vue-motion
```

### 構建

```bash
# 構建所有專案
pnpm build:safe

# 構建單一專案
nx build event-cms
nx build event-portal
nx build profile
nx build enterprise-admin

# 構建 libs
nx build ui-components
nx build hooks
nx build charts
```

### 測試

```bash
# 所有測試
pnpm test

# 單一專案測試
nx test event-cms
nx test ui-components
```

### 清理

```bash
# 清理 Nx 快取
nx reset

# 完整清理
make clean
make setup
```

---

## 🌐 服務網址

### 開發環境

| 服務              | URL                   | Port |
| ----------------- | --------------------- | ---- |
| Event CMS         | http://localhost:3002 | 3002 |
| Event Portal      | http://localhost:3000 | 3000 |
| Profile           | http://localhost:3003 | 3003 |
| Enterprise Admin  | http://localhost:4200 | 4200 |
| Vue Motion        | http://localhost:8080 | 8080 |
| Auth              | http://localhost:5173 | 5173 |
| API Server (計劃) | http://localhost:3001 | 3001 |

---

## 📦 常用 Import

### UI 組件

```tsx
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Input,
  Textarea,
  Select,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Alert,
  Switch,
  Checkbox,
  Label,
} from '@nx-playground/ui-components';
```

### Hooks

```tsx
import {
  // 自定義
  useAsync,
  useModal,
  usePagination,
  useToast,
  useDebounce,
  useLocalStorage,

  // 重新導出
  useState,
  useEffect,
  useCallback,
  useMemo,
} from '@nx-playground/hooks';
```

### 圖表

```tsx
// Recharts
import { Recharts } from '@nx-playground/charts';

<Recharts.LineChart data={data} height={300} />
<Recharts.BarChart data={data} height={300} />
<Recharts.AreaChart data={data} height={300} />
<Recharts.PieChart data={data} height={300} />

// Chart.js
import { ChartJS } from '@nx-playground/charts';

<ChartJS.LineChart data={data} height={300} />
<ChartJS.BarChart data={data} height={300} />
<ChartJS.AreaChart data={data} height={300} />
<ChartJS.PieChart data={data} height={300} />
```

### API Client

```tsx
import {
  useGetEvents,
  useGetEvent,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
} from '@nx-playground/api-client/server/dev';

function MyComponent() {
  const { data, isLoading } = useGetEvents();
  const createMutation = useCreateEvent();

  return ...;
}
```

---

## 📁 重要文件位置

### 配置文件

```
/
├── nx.json                      # Nx workspace 配置
├── tsconfig.base.json           # TypeScript 全局配置
├── package.json                 # 依賴管理
├── pnpm-workspace.yaml          # pnpm workspace 配置
├── Makefile                     # 開發命令
└── .gitignore                   # Git 忽略

apps/event-cms/
├── project.json                 # Nx 專案配置
├── vite.config.ts               # Vite 配置
├── tsconfig.json                # TypeScript 配置
└── package.json                 # 專案依賴

libs/ui-components/
├── project.json
├── vite.config.ts
├── tsconfig.lib.json
└── package.json
```

### 文檔

```
docs/
├── CURRENT_STATUS.md            # 當前狀態
├── PROJECT_SPECIFICATION.md     # 專案規格
├── DEVELOPMENT_GUIDE.md         # 開發指南
├── QUICK_REFERENCE.md           # 本文件
├── backend/
│   ├── IMPLEMENTATION_SPEC.md   # 後端實施
│   ├── API_DESIGN.md            # API 設計
│   └── DATABASE_DESIGN.md       # 資料庫設計
└── archive/                     # 歷史文檔
```

---

## 🔧 常見問題

### Q: 構建失敗 "Cannot find module"

**A**:

```bash
# 1. 確認 tsconfig.base.json 有正確的 path
# 2. 重新構建依賴
nx build the-dependency-lib
# 3. 清理快取
nx reset
```

### Q: TypeScript 錯誤

**A**:

```bash
# 運行類型檢查
nx run-many --target=typecheck

# 重新生成類型定義
nx build your-lib
```

### Q: Port 被占用

**A**:

```bash
# 查找占用的 process
lsof -i :3002

# 殺掉 process
kill -9 <PID>
```

### Q: pnpm-lock.yaml 過時

**A**:

```bash
# 更新 lockfile
pnpm install --no-frozen-lockfile
```

---

## 🎯 快速創建

### 創建新 React App

```bash
./scripts/create-react-app.sh my-app 3005
./scripts/finish-setup.sh my-app 3005
nx serve my-app
```

### 創建新 Library

```bash
# 1. 複製參考專案
cp -r libs/ui-components libs/my-lib

# 2. 更新配置
# - project.json
# - package.json
# - tsconfig.lib.json
# - vite.config.ts

# 3. 更新 tsconfig.base.json
# 添加 "@nx-playground/my-lib": ["dist/libs/my-lib"]

# 4. 測試
nx build my-lib
```

---

## 📊 Nx 常用命令

```bash
# 查看依賴圖
nx graph

# 查看特定專案依賴
nx graph --focus=event-cms

# 影響分析
nx affected:graph

# 運行所有 target
nx run-many --target=build

# 只運行受影響的
nx affected --target=build
```

---

## 🔄 Git 工作流

```bash
# 拉取最新
git pull

# 創建分支
git checkout -b feature/your-feature

# 提交
git add .
git commit -m "feat: your changes"

# 推送
git push origin feature/your-feature
```

### Commit Message 規範

```
feat: 新功能
fix: 修復 bug
docs: 文檔更新
style: 代碼格式
refactor: 重構
test: 測試
chore: 建構/工具
```

---

## 📦 Dependencies 管理

```bash
# 添加依賴到 workspace root
pnpm add -w package-name

# 添加 dev 依賴
pnpm add -D -w package-name

# 移除依賴
pnpm remove -w package-name

# 更新所有依賴
pnpm update

# 檢查過時依賴
pnpm outdated
```

---

## 🎨 設計 Tokens

### Spacing

```css
/* 8px 基數 */
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem; /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem; /* 16px */
--space-6: 1.5rem; /* 24px */
--space-8: 2rem; /* 32px */
```

### Colors

```css
--primary: #3b82f6;
--secondary: #6b7280;
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
```

### Typography

```css
--font-sans: Inter, sans-serif;
--font-mono: Fira Code, monospace;

--text-xs: 0.75rem; /* 12px */
--text-sm: 0.875rem; /* 14px */
--text-base: 1rem; /* 16px */
--text-lg: 1.125rem; /* 18px */
--text-xl: 1.25rem; /* 20px */
```

---

## 🔍 Debugging

### Chrome DevTools

```
F12 - 開啟 DevTools
Ctrl+P - 快速搜尋文件
Ctrl+Shift+P - 命令面板
```

### VS Code / Cursor

```
Cmd+P - 快速搜尋文件
Cmd+Shift+F - 全局搜尋
F12 - 跳到定義
Shift+F12 - 查找引用
```

### Nx Console

在 VS Code / Cursor 中安裝 "Nx Console" 擴展，提供圖形化界面。

---

## 📖 延伸閱讀

- [專案規格](./PROJECT_SPECIFICATION.md)
- [開發指南](./DEVELOPMENT_GUIDE.md)
- [當前狀態](./CURRENT_STATUS.md)
- [後端規格](./backend/)

---

_最後更新: 2025-10-12_
