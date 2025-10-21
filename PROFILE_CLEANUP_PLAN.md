# Profile 專案清理計劃

## 目標

移除冗餘程式碼，簡化為最新需求：從 README + PRD 讀取資料，統一由 ProjectCard 管理。

## 分析

### ❌ 需要刪除的檔案/目錄

**features/apps/**:
- ❌ `locales/` - 整個目錄（不再需要翻譯）
- ❌ `hooks/useAppsTranslation.ts` - 不再需要
- ❌ `i18n.ts` - 不再需要

**features/libs/**:
- ❌ `locales/` - 整個目錄
- ❌ `hooks/useLibsTranslation.ts` - 不再需要
- ❌ `i18n.ts` - 不再需要

**data/**:
- ❌ `apps.config.ts` - 資料從 README + PRD 讀取
- ❌ `libs.config.ts` - 資料從 README + PRD 讀取

**components/**:
- ❌ `TechBadge.tsx` - 已被 TechTag 取代

### ✅ 需要保留的

**features/blog/** - 完整保留（Blog 仍需 i18n）
**features/home/** - 完整保留（Home 仍需 i18n）
**lib/i18n/** - 核心 i18n 基礎設施
**data/profile.config.ts** - 個人資料
**data/techStack.ts** - 技術堆疊（SkillCloud 使用）

### 🔧 需要修改的檔案

**main.tsx**:
```typescript
// 刪除
import { appsI18n } from './features/apps';
import { libsI18n } from './features/libs';
appsI18n.init();
libsI18n.init();

// 保留
import { blogI18n } from './features/blog';
import { homeI18n } from './features/home';
blogI18n.init();
homeI18n.init();
```

**AppsPage.tsx**:
```typescript
// 刪除
import { useAppsTranslation } from '../hooks/useAppsTranslation';
import { appsConfig } from '../../../data/apps.config';
const { t } = useAppsTranslation();
String(t('page.title'))

// 改為硬編碼或使用 home i18n
<h1>Applications</h1>
<p>Browse all applications in the monorepo</p>
```

**LibsPage.tsx**:
```typescript
// 刪除
import { useLibsTranslation } from '../hooks/useLibsTranslation';
import { libsConfig, libBenefits, libCategories } from '../../../data/libs.config';
const { t } = useLibsTranslation();

// 改為硬編碼
<h1>Shared Libraries</h1>
<p>Reusable components and utilities</p>
```

**AppDetailPage.tsx**:
```typescript
// 使用 loadApp() 載入資料
// 顯示 README content
// 不需要 i18n 翻譯（資料本身已經是 locale-aware）
```

**features/apps/index.ts**:
```typescript
// 刪除
export { default as appsI18n } from './i18n';
export { useAppsTranslation } from './hooks/useAppsTranslation';

// 只保留
export { AppsPage } from './pages/AppsPage';
export { AppDetailPage } from './pages/AppDetailPage';
export { AppCard } from './components/AppCard';
```

**features/libs/index.ts**:
```typescript
// 類似 apps/index.ts
```

## 清理步驟

### Step 1: 刪除檔案

```bash
# Apps feature 清理
rm -rf apps/profile/src/features/apps/locales
rm apps/profile/src/features/apps/hooks/useAppsTranslation.ts
rm apps/profile/src/features/apps/i18n.ts

# Libs feature 清理
rm -rf apps/profile/src/features/libs/locales
rm apps/profile/src/features/libs/hooks/useLibsTranslation.ts
rm apps/profile/src/features/libs/i18n.ts

# Data config 清理
rm apps/profile/src/data/apps.config.ts
rm apps/profile/src/data/libs.config.ts

# 舊組件清理
rm apps/profile/src/components/TechBadge.tsx
```

### Step 2: 更新 main.tsx

移除 appsI18n 和 libsI18n 的初始化

### Step 3: 簡化 AppsPage

```typescript
export const AppsPage: FC = () => {
  const { locale } = useParams<{ locale: string }>();
  const currentLocale = (locale ?? 'en') as SupportedLocale;
  const [apps, setApps] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllApps(currentLocale).then(setApps).finally(() => setLoading(false));
  }, [currentLocale]);

  return (
    <div>
      <h1>Applications</h1>
      <p>Browse all applications built in the Nx monorepo</p>
      <div className="grid">
        {apps.map(app => <AppCard key={app.id} app={app} />)}
      </div>
    </div>
  );
};
```

### Step 4: 簡化 LibsPage

類似 AppsPage，移除所有翻譯和 config

### Step 5: 更新 AppDetailPage

```typescript
export const AppDetailPage: FC = () => {
  const { appId, locale } = useParams();
  const currentLocale = (locale ?? 'en') as SupportedLocale;
  const [app, setApp] = useState<AppData | null>(null);

  useEffect(() => {
    loadApp(appId!, currentLocale).then(setApp);
  }, [appId, currentLocale]);

  return (
    <div>
      <h1>{app?.name}</h1>
      <div dangerouslySetInnerHTML={{ __html: app?.readmeContent || '' }} />
    </div>
  );
};
```

### Step 6: 清理 index.ts 導出

移除不需要的導出

### Step 7: 刪除空目錄

```bash
# 刪除 hooks/ 目錄（如果空了）
rmdir apps/profile/src/features/apps/hooks 2>/dev/null
rmdir apps/profile/src/features/libs/hooks 2>/dev/null
```

## 清理後的結構

```
apps/profile/src/
├── components/
│   ├── CategoryBadge.tsx
│   ├── LanguageSwitcher.tsx
│   ├── Layout.tsx
│   ├── ProjectCard.tsx  ← 統一卡片
│   ├── StatsRow.tsx
│   ├── StatusBadge.tsx
│   └── TechTag.tsx  ← 統一技術標籤
├── data/
│   ├── profile.config.ts  ← 保留
│   └── techStack.ts  ← 保留
├── features/
│   ├── apps/
│   │   ├── components/
│   │   ├── pages/
│   │   └── index.ts
│   ├── libs/
│   │   ├── components/
│   │   ├── pages/
│   │   └── index.ts
│   ├── blog/  ← 完整保留
│   └── home/  ← 完整保留
├── lib/
│   ├── i18n/  ← 保留
│   ├── techCategories.ts  ← 保留
│   ├── readmeLoader.ts  ← 保留
│   ├── specLoader.ts  ← 保留
│   ├── changelogLoader.ts  ← 保留
│   └── projectLoader.ts  ← 保留
└── types/
    └── projectData.ts  ← 保留
```

## 優勢

1. ✅ **程式碼減少 50%+** - 移除所有冗餘翻譯
2. ✅ **維護簡單** - 單一資料來源（README + PRD）
3. ✅ **清晰架構** - 只保留必要的 feature i18n（blog, home）
4. ✅ **統一管理** - ProjectCard 統一處理所有展示

## 驗證

清理後應該：
- ✅ Apps 頁面正常運作（從 README + PRD）
- ✅ Libs 頁面正常運作（從 README + PRD）
- ✅ Blog 頁面正常（保留 i18n）
- ✅ Home 頁面正常（保留 i18n）
- ✅ 無 linter 錯誤
- ✅ 無 TypeScript 錯誤

