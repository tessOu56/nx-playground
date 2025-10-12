# NX Playground 專案規格

> AI 和新開發者接手必讀文檔

## 🎯 專案目的

NX Playground 是一個實驗性 Monorepo，用於：

1. **展示現代前端技術整合** - React, Next.js, Angular, Vue 共存
2. **建立可復用的設計系統** - Tokens + 組件庫
3. **實驗企業級功能** - RBAC, Dual-control, SSE
4. **練習 Monorepo 開發** - 代碼共享、依賴管理

### 專案定位

| 專案             | 角色     | 目標用戶   | 業務範圍                     |
| ---------------- | -------- | ---------- | ---------------------------- |
| event-cms        | 後台管理 | 活動管理員 | 創建活動、管理用戶、表單設計 |
| event-portal     | 前台展示 | 一般用戶   | 瀏覽活動、報名、查看訂單     |
| enterprise-admin | 企業管理 | 系統管理員 | RBAC、審計、系統監控         |
| profile          | 技術展示 | 開發者     | Nx/React 功能展示            |
| auth             | 認證服務 | 所有用戶   | 統一登入/註冊                |
| vue-motion       | 動畫實驗 | 學習者     | 動畫技術練習                 |

**關係**:

- event-cms 和 event-portal 配合使用（前後台）
- enterprise-admin 獨立運作（企業級管理）
- 所有 apps 共享 libs（ui-components, hooks 等）

---

## 🏗️ 架構設計

### Monorepo 結構

```
nx-playground/
├── apps/                    # 6 個應用
│   ├── event-cms/          # React CMS
│   ├── event-portal/       # Next.js 前台
│   ├── enterprise-admin/   # Angular 企業管理
│   ├── profile/            # React 展示
│   ├── auth/               # React 認證
│   └── vue-motion/         # Vue 動畫
│
├── libs/                    # 7 個共享庫
│   ├── api-client/         # OpenAPI → Hooks
│   ├── charts/             # 圖表庫
│   ├── ui-components/      # UI 組件
│   ├── hooks/              # React Hooks
│   ├── design-system/      # Tokens
│   ├── i18n/               # 國際化
│   └── auth-client/        # 認證
│
├── templates/               # 專案模板
│   └── react-template/     # React App 模板
│
└── scripts/                 # 自動化腳本
```

### 依賴關係

```
event-cms 依賴:
  → ui-components → design-system
  → hooks
  → charts
  → api-client
  → i18n
  → auth-client

event-portal 依賴:
  → api-client
  → i18n
  → 自己的組件 (不依賴 ui-components)

enterprise-admin:
  → 完全獨立，使用 Angular 生態

libs 之間:
  ui-components → design-system, i18n
  其他 libs → 獨立
```

---

## 🔧 開發規範

### ⚠️ CRITICAL: 創建新 Libs/Apps

**千萬不要用 `nx g` 預設指令！**

Nx 預設生成器會創建不兼容的配置。

**正確做法**:

#### 創建新 Lib

1. 選擇參考專案:

   - Vite library: `libs/ui-components`, `libs/charts`
   - TypeScript library: `libs/hooks`

2. 複製整個目錄結構
3. 複製這些文件並修改:

   - `project.json` (name, sourceRoot, outputPath)
   - `package.json` (name)
   - `tsconfig.json` (outDir, rootDir)
   - `tsconfig.lib.json` (paths, references)
   - `vite.config.ts` (cacheDir, outDir)

4. 更新 `tsconfig.base.json` paths
5. 測試構建: `nx build your-lib`

#### 創建新 App

1. 選擇參考專案:

   - React app: `apps/profile`, `apps/event-cms`
   - Next.js app: `apps/event-portal`

2. 複製配置文件
3. 更新所有路徑
4. 立即測試

**關鍵配置** (以 Vite lib 為例):

**project.json**:

```json
{
  "name": "your-lib",
  "targets": {
    "build": {
      "executor": "@nx/vite:build",
      "options": {
        "outputPath": "dist/libs/your-lib",
        "tsConfig": "libs/your-lib/tsconfig.lib.json"
      },
      "dependsOn": [{ "target": "build", "projects": "dependencies" }]
    }
  }
}
```

**tsconfig.lib.json**:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "../../dist/libs/your-lib",
    "rootDir": "./src",
    "composite": true,
    "declaration": true,
    "module": "ESNext",
    "moduleResolution": "node"
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "references": [...]  // 依賴的其他 libs
}
```

**vite.config.ts**:

```typescript
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import dts from 'vite-plugin-dts';

export default defineConfig({
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
    lib: {
      entry: 'src/index.ts',
      name: '@nx-playground/your-lib',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
});
```

### 代碼規範

#### TypeScript

- 使用嚴格模式
- 所有組件必須有類型定義
- Props 使用 interface
- 避免 any 類型

#### React 組件

```tsx
// ✅ 好的範例
import { forwardRef } from 'react';
import { cn } from '../utils';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', children, onClick, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn('btn', variant)}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
```

#### 文件組織

```
feature/
├── components/      # UI 組件
├── pages/           # 頁面組件
├── hooks/           # 自定義 hooks
├── types/           # TypeScript 類型
├── mock/            # Mock 數據
├── utils/           # 工具函數
└── index.ts         # 導出
```

---

## 🔄 OpenAPI 工作流程

### 當前流程 (Spec-First)

```
1. 手寫 OpenAPI spec
2. 放到 libs/api-client/specs/
3. 運行 orval 生成 hooks
4. 前端使用 hooks
```

### 計劃流程 (Code-First with NestJS)

```
1. 寫 NestJS Controller + DTOs
   ↓
2. NestJS 自動生成 openapi.json
   ↓
3. 腳本自動複製到 libs/api-client/specs/
   ↓
4. Orval 自動生成 React Query hooks
   ↓
5. 前端直接使用類型安全的 hooks
```

### 使用範例

**NestJS 端**:

```typescript
@Controller('events')
@ApiTags('events')
export class EventsController {
  @Get()
  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({ status: 200, type: [EventDto] })
  findAll(): EventDto[] {
    return this.eventsService.findAll();
  }
}

export class EventDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;
}
```

**前端使用**:

```tsx
import { useGetEvents } from '@nx-playground/api-client/server/dev';

function EventsList() {
  const { data, isLoading, error } = useGetEvents();

  // data 是 EventDto[]，完全類型安全！
  return (
    <div>
      {data?.map(event => (
        <div key={event.id}>{event.name}</div>
      ))}
    </div>
  );
}
```

---

## 📝 常見開發任務

### 任務 1: 添加新的 API

#### 後端 (NestJS)

1. 創建 module: `src/modules/your-feature/`
2. 寫 DTOs with `@ApiProperty` decorators
3. 寫 Controller with `@ApiOperation` decorators
4. 寫 Service 實現邏輯
5. 啟動 server

#### 自動化

6. OpenAPI 自動生成
7. 運行 `pnpm api:sync`
8. React Query hooks 自動生成

#### 前端使用

9. Import 生成的 hooks
10. 在組件中使用
11. TypeScript 自動檢查

### 任務 2: 添加新的 UI 組件

1. 在 `libs/ui-components/src/components/core/YourComponent/` 創建
2. 寫組件（參考 Button.tsx）
3. 導出從 `index.ts`
4. 添加到 `libs/ui-components/src/index.ts`
5. 構建: `nx build ui-components`
6. 在 app 中使用: `import { YourComponent } from '@nx-playground/ui-components'`

### 任務 3: 添加新頁面到 event-cms

1. 創建 `apps/event-cms/src/features/your-feature/`
2. 目錄結構:
   ```
   your-feature/
   ├── components/
   ├── pages/
   │   └── YourFeaturePage.tsx
   ├── hooks/
   ├── types/
   └── index.ts
   ```
3. 在 `router/routes/` 添加路由
4. 在 Sidebar 添加導航

### 任務 4: 添加新的 Hook

1. 在 `libs/hooks/src/` 創建 `useYourHook.ts`
2. 寫 hook 邏輯，添加 JSDoc
3. 導出從 `libs/hooks/src/index.ts`
4. 構建: `nx build hooks`
5. 在組件中使用

---

## 🧪 測試策略

### 構建測試

```bash
# 測試所有專案
pnpm build:safe

# 測試單一專案
nx build your-project
```

### 運行測試

```bash
# 所有測試
pnpm test

# 特定測試
nx test your-project
```

---

## 🚀 部署

### 前端部署

- event-cms: Cloudflare Pages
- event-portal: Vercel / Cloudflare Pages
- 其他: 靜態託管

### 後端部署 (計劃)

- NestJS: Railway / Render
- 資料庫: Railway PostgreSQL

---

## 📖 相關文檔

- [當前狀態](./CURRENT_STATUS.md) - 進度和功能
- [開發指南](./DEVELOPMENT_GUIDE.md) - 詳細開發步驟
- [快速參考](./QUICK_REFERENCE.md) - 命令速查
- [後端規格](./backend/) - NestJS 實施

---

## 🎯 給 AI 的提示

當你（AI）接手這個專案時：

1. **先讀這份文檔** - 了解架構和規範
2. **查看 CURRENT_STATUS.md** - 知道進度
3. **參考現有代碼** - 不要用 nx g
4. **遵循命名規範** - 保持一致性
5. **測試構建** - 每次改動後測試
6. **查看 .cursor/rules/** - 了解禁止事項（如果存在）

### 禁止事項

- ❌ **不要用 `nx g` 創建新專案**
- ❌ 不要修改現有 libs 的 public API（會影響所有 apps）
- ❌ 不要跳過 OpenAPI 生成步驟
- ❌ 不要提交 .cursor, .vscode, .woodpecker

### 推薦做法

- ✅ 參考現有專案複製配置
- ✅ 立即測試構建
- ✅ 遵循現有代碼風格
- ✅ 寫清楚的 commit message
- ✅ 更新相關文檔

---

_最後更新: 2025-10-12_
_專案進度: 前端 85%, 後端 0%, 總體 42%_
