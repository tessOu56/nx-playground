# 快速建立 React 專案

這個文檔說明如何使用 React 模板快速建立新的應用程式。

## 🚀 快速開始

### 方式 1: 使用自動化腳本（推薦）

```bash
# 1. 建立新專案
./scripts/create-react-app.sh my-new-app 3005

# 2. 完成設置（自動更新配置）
./scripts/finish-setup.sh my-new-app 3005

# 3. 啟動專案
pnpm dev:my-new-app
```

### 方式 2: 手動建立

```bash
# 1. 複製模板
cp -r templates/react-template apps/my-new-app

# 2. 手動替換變數
cd apps/my-new-app
# 編輯 project.json, package.json, vite.config.ts, index.html
# 將 {{PROJECT_NAME}}, {{PORT}}, {{PROJECT_TITLE}} 替換為實際值

# 3. 更新 tsconfig.base.json
# 添加: "@nx-playground/my-new-app": ["apps/my-new-app/src"]

# 4. 更新 root package.json
# 添加: "dev:my-new-app": "nx serve @nx-playground/my-new-app"

# 5. 啟動專案
nx serve @nx-playground/my-new-app
```

## 📦 模板內容

React 模板包含以下內容：

### 配置文件
- `project.json` - Nx 專案配置
- `package.json` - 依賴管理
- `vite.config.ts` - Vite 構建配置
- `tsconfig.*.json` - TypeScript 配置
- `eslint.config.mjs` - ESLint 配置
- `index.html` - HTML 模板

### 源代碼
- `src/main.tsx` - 應用入口
- `src/App.tsx` - 根組件
- `src/index.css` - 全局樣式
- `src/components/Layout.tsx` - 佈局組件
- `src/pages/HomePage.tsx` - 首頁

### 整合功能
- ✅ React 19 + TypeScript
- ✅ React Router 路由
- ✅ Tailwind CSS 樣式
- ✅ Design System 整合
- ✅ UI Components 整合
- ✅ i18n 國際化支援
- ✅ Custom Hooks
- ✅ API Client

## 🎯 腳本說明

### create-react-app.sh

建立新專案的主要腳本：

**參數:**
- `$1` - 專案名稱（必填）
- `$2` - 開發端口（選填，預設 3004）

**功能:**
1. 檢查專案名稱有效性
2. 複製模板到目標目錄
3. 替換模板變數
4. 生成配置文件

**變數替換:**
- `{{PROJECT_NAME}}` → 專案名稱（kebab-case）
- `{{PROJECT_TITLE}}` → 專案標題（Title Case）
- `{{PORT}}` → 開發端口
- `{{PROJECT_DESCRIPTION}}` → 專案描述

### finish-setup.sh

完成專案設置的輔助腳本：

**參數:**
- `$1` - 專案名稱（必填）
- `$2` - 開發端口（選填，預設 3004）

**功能:**
1. 自動更新 `tsconfig.base.json` 的 paths
2. 自動更新 root `package.json` 的 scripts
3. 使用 Node.js 安全處理 JSON

## 📝 範例

### 建立一個名為 "dashboard" 的專案

```bash
# 使用 port 4000
./scripts/create-react-app.sh dashboard 4000
./scripts/finish-setup.sh dashboard 4000

# 啟動專案
pnpm dev:dashboard
# 訪問 http://localhost:4000
```

### 建立一個名為 "admin-panel" 的專案

```bash
# 使用預設 port 3004
./scripts/create-react-app.sh admin-panel
./scripts/finish-setup.sh admin-panel

# 啟動專案
pnpm dev:admin-panel
# 訪問 http://localhost:3004
```

## 🔧 自定義模板

如果你想修改模板內容：

1. 編輯 `templates/react-template/` 中的文件
2. 使用 `{{VARIABLE}}` 標記需要替換的內容
3. 更新 `create-react-app.sh` 腳本處理新變數

常用變數：
- `{{PROJECT_NAME}}` - 專案名稱
- `{{PROJECT_TITLE}}` - 專案標題
- `{{PROJECT_DESCRIPTION}}` - 專案描述
- `{{PORT}}` - 端口號

## ⚠️ 注意事項

1. **專案命名**: 使用 kebab-case（如：my-app, admin-panel）
2. **端口衝突**: 確保指定的端口未被佔用
3. **依賴管理**: 新專案會使用 workspace 共享依賴
4. **TypeScript**: 會自動配置 TypeScript 路徑映射

## 🎓 進階

### 添加更多頁面

```tsx
// src/pages/AboutPage.tsx
export function AboutPage() {
  return <div>About Page</div>;
}

// src/App.tsx
import { AboutPage } from './pages/AboutPage';

<Route path="/about" element={<AboutPage />} />
```

### 使用共享組件

```tsx
import { Button, Card } from '@nx-playground/ui-components';
import { useTranslation } from '@nx-playground/i18n';
import { useDebounce } from '@nx-playground/hooks';

export function MyComponent() {
  const { t } = useTranslation();
  return (
    <Card>
      <Button>{t('common.submit')}</Button>
    </Card>
  );
}
```

### 添加測試

```tsx
// src/components/MyComponent.spec.tsx
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## 📚 相關文檔

- [Nx 官方文檔](https://nx.dev)
- [React 官方文檔](https://react.dev)
- [Vite 官方文檔](https://vitejs.dev)
- [TypeScript 官方文檔](https://www.typescriptlang.org)
