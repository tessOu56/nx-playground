# NX Playground 開發指南

## ⚠️ 重要：創建新 Libs/Apps 的正確方式

### 為什麼不能用 `nx g`？

Nx 預設生成器創建的配置**不符合本專案的需求**：

1. **TypeScript 配置不兼容** - module resolution, project references
2. **Vite 配置缺失** - 缺少必要的 Nx plugins
3. **路徑映射錯誤** - tsconfig.base.json paths 不正確
4. **建構依賴錯誤** - dependsOn 配置不完整

**實際經驗**: 創建 `libs/charts` 時，最初用錯誤配置導致建構失敗，必須參考 `libs/ui-components` 重新配置。

---

## 📦 創建新 Library

### Step 1: 選擇參考專案

根據你要創建的 library 類型選擇：

| 類型 | 參考專案 | 特點 |
|------|---------|------|
| **UI 組件庫** | `libs/ui-components` | Vite + dts + Radix UI |
| **React Hooks** | `libs/hooks` | TypeScript + TSC |
| **圖表組件** | `libs/charts` | Vite + 雙軌制 |
| **工具函數** | `libs/i18n` | Vite + React |

### Step 2: 複製結構

```bash
# 複製整個目錄
cp -r libs/ui-components libs/your-new-lib

# 進入目錄
cd libs/your-new-lib
```

### Step 3: 更新配置文件

#### 3.1 project.json
```json
{
  "name": "your-new-lib",  // 更新名稱
  "sourceRoot": "libs/your-new-lib/src",  // 更新路徑
  "targets": {
    "build": {
      "options": {
        "outputPath": "dist/libs/your-new-lib",  // 更新輸出路徑
        "tsConfig": "libs/your-new-lib/tsconfig.lib.json"  // 更新 tsconfig 路徑
      }
    },
    "lint": {
      "options": {
        "lintFilePatterns": ["libs/your-new-lib/src/**/*.{ts,tsx}"]  // 更新 lint 路徑
      }
    },
    "typecheck": {
      "options": {
        "outputPath": "dist/libs/your-new-lib/tsc",
        "main": "libs/your-new-lib/src/index.ts",
        "tsConfig": "libs/your-new-lib/tsconfig.typecheck.json"
      }
    }
  }
}
```

#### 3.2 package.json
```json
{
  "name": "@nx-playground/your-new-lib",
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}
```

#### 3.3 tsconfig.lib.json
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "../../dist/libs/your-new-lib",
    "rootDir": "./src",
    "tsBuildInfoFile": "../../dist/libs/your-new-lib/tsconfig.lib.tsbuildinfo"
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "references": [
    // 添加依賴的 libs
    // { "path": "../design-system/tsconfig.lib.json" }
  ]
}
```

#### 3.4 vite.config.ts
```typescript
import * as path from 'path';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/your-new-lib',  // 更新
  plugins: [
    react(),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
      pathsToAliases: false,
    }),
  ],
  build: {
    outDir: '../../dist/libs/your-new-lib',  // 更新
    lib: {
      entry: 'src/index.ts',
      name: '@nx-playground/your-new-lib',  // 更新
      fileName: 'index',
      formats: ['es' as const, 'cjs' as const],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
}));
```

### Step 4: 更新全局配置

#### 4.1 tsconfig.base.json
```json
{
  "paths": {
    "@nx-playground/your-new-lib": ["dist/libs/your-new-lib"]
  }
}
```

### Step 5: 清理和測試

```bash
# 清理參考專案的代碼
rm -rf src/*

# 創建基本的 index.ts
echo "export const hello = 'world';" > src/index.ts

# 測試構建
nx build your-new-lib

# 如果成功，開始開發功能
```

---

## 🚀 創建新 App

### Step 1: 選擇參考專案

| App 類型 | 參考專案 | 說明 |
|---------|---------|------|
| **React + Vite** | `apps/profile` 或 `apps/event-cms` | 簡單清晰 |
| **Next.js** | `apps/event-portal` | App Router |
| **Angular** | `apps/enterprise-admin` | 企業級 |

### Step 2: 複製並修改

```bash
# 複製目錄
cp -r apps/profile apps/your-new-app

# 更新 project.json（同 lib 步驟）
# 更新 package.json
# 更新 vite.config.ts
# 更新 tsconfig files
```

### Step 3: 使用 React Template (推薦)

```bash
# 使用腳本快速創建
./scripts/create-react-app.sh my-app 3005
./scripts/finish-setup.sh my-app 3005
```

---

## 🎨 UI 組件開發

### 使用現有組件

```tsx
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Dialog,
  DialogContent,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@nx-playground/ui-components';

function MyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>標題</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="primary">按鈕</Button>
      </CardContent>
    </Card>
  );
}
```

### 創建新組件

1. 在 `libs/ui-components/src/components/core/YourComponent/` 創建
2. 使用 forwardRef 和 TypeScript
3. 使用 `cn()` 合併 className
4. 導出從 `index.ts`

---

## 🎣 Hooks 開發

### 使用現有 Hooks

```tsx
import {
  useAsync,
  useModal,
  usePagination,
  useDebounce,
  useLocalStorage,
} from '@nx-playground/hooks';

function MyComponent() {
  const modal = useModal();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  
  return <div>...</div>;
}
```

### 創建新 Hook

```typescript
// libs/hooks/src/useYourHook.ts
import { useState, useCallback } from 'react';

/**
 * useYourHook - 功能描述
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { value, setValue } = useYourHook();
 *   return <div>{value}</div>;
 * }
 * ```
 */
export function useYourHook() {
  const [value, setValue] = useState('');
  
  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
  }, []);
  
  return { value, setValue: handleChange };
}
```

---

## 📊 圖表使用

### 選擇圖表庫

```tsx
import { Recharts, ChartJS } from '@nx-playground/charts';

// Recharts - 適合簡單圖表
<Recharts.LineChart 
  data={data}
  height={300}
  showGrid={true}
/>

// Chart.js - 適合複雜圖表或需要高性能
<ChartJS.BarChart
  data={data}
  height={300}
  colors={['#3b82f6']}
/>
```

---

## 🔧 常見問題

### Q1: 建構失敗 "Cannot find module"

**原因**: tsconfig paths 配置錯誤

**解決**:
1. 檢查 `tsconfig.base.json` 是否有正確的 path
2. 確認路徑指向 `dist/libs/...` 或 `apps/.../src`
3. 重新構建依賴: `nx build dependency-lib`

### Q2: TypeScript 錯誤 "File not listed in project"

**原因**: tsconfig include 設定錯誤

**解決**:
1. 檢查 `tsconfig.lib.json` 的 include
2. 確保包含所有 `src/**/*.ts` 和 `src/**/*.tsx`
3. 檢查 exclude 沒有誤刪文件

### Q3: Vite 建構錯誤

**原因**: 缺少 Nx plugins 或配置錯誤

**解決**:
1. 確認有 `nxViteTsPaths()` plugin
2. 確認有 `dts()` plugin（如果需要類型定義）
3. 檢查 external dependencies 設定

### Q4: Import 錯誤

**原因**: 循環依賴或路徑錯誤

**解決**:
1. 檢查是否有循環依賴
2. 使用 `nx graph` 查看依賴圖
3. 確認 import 路徑正確

---

## 🎯 編碼規範

### 文件命名
- 組件: PascalCase `Button.tsx`
- Hooks: camelCase `useModal.ts`
- Utils: camelCase `formatDate.ts`
- Types: PascalCase `User.ts` or camelCase `types.ts`

### Import 順序
```tsx
// 1. React/框架
import { useState } from 'react';

// 2. 第三方庫
import { cn } from 'class-variance-authority';

// 3. @nx-playground libs
import { Button } from '@nx-playground/ui-components';

// 4. 相對 imports
import { MyComponent } from './components';
```

### 組件結構
```tsx
// 1. Imports
import { ... } from '...';

// 2. Types/Interfaces
interface MyComponentProps {
  ...
}

// 3. 組件
export function MyComponent({ ... }: MyComponentProps) {
  // 3.1 Hooks
  const [state, setState] = useState();
  
  // 3.2 Handlers
  const handleClick = () => { ... };
  
  // 3.3 Render
  return ( ... );
}
```

---

## 📦 Dependencies 管理

### 添加依賴

```bash
# 添加到 workspace root
pnpm add -w package-name

# 原因: Monorepo 使用單一 node_modules
```

### 檢查依賴

```bash
# 查看依賴圖
nx graph

# 查看特定專案依賴
nx graph --focus=your-project
```

---

## 🚀 開發工作流

### 日常開發

```bash
# 1. 拉取最新代碼
git pull

# 2. 安裝依賴（如有更新）
pnpm install

# 3. 啟動開發服務
make dev-event-cms

# 4. 開發...

# 5. 測試構建
nx build event-cms

# 6. 提交
git add .
git commit -m "feat: your changes"
git push
```

### 添加新功能

```bash
# 1. 創建 feature 分支（可選）
git checkout -b feature/your-feature

# 2. 開發功能

# 3. 測試
nx build your-project
nx test your-project

# 4. 提交
git commit -m "feat: add your feature"
```

---

## 📚 學習資源

### 參考現有代碼

**最佳學習方式**: 閱讀現有代碼

| 學習目標 | 參考專案 |
|---------|---------|
| UI 組件開發 | `libs/ui-components/src/components/core/Button/` |
| Custom Hook | `libs/hooks/src/useModal.ts` |
| 完整頁面 | `apps/event-cms/src/features/users/pages/UsersPage.tsx` |
| Dialog 使用 | `apps/event-cms/src/features/users/components/UserEditDialog.tsx` |
| 圖表使用 | `apps/event-cms/src/features/dashboard/components/charts/` |
| Tabs 使用 | `apps/event-cms/src/features/settings/pages/SettingsPage.tsx` |

---

## 🔍 Troubleshooting

### 構建問題

```bash
# 清理 Nx 快取
nx reset

# 清理並重建
make clean
make setup

# 查看詳細錯誤
nx build your-project --verbose
```

### TypeScript 錯誤

```bash
# 檢查類型
nx run-many --target=typecheck

# 重新生成類型定義
nx build your-dependency-lib
```

### Import 錯誤

```bash
# 確認 lib 已構建
nx build the-lib-you-import

# 檢查 tsconfig.base.json paths
cat tsconfig.base.json | grep your-lib
```

---

## 📖 延伸閱讀

- [專案規格](./PROJECT_SPECIFICATION.md)
- [當前狀態](./CURRENT_STATUS.md)
- [快速參考](./QUICK_REFERENCE.md)
- [後端規格](./backend/IMPLEMENTATION_SPEC.md)

