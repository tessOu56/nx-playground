# Dashboard 功能

## 📁 文件結構

```
dashboard/
├── components/                     # UI 組件
│   └── FormsDemo.tsx              # 表單展示組件
├── pages/                         # 頁面組件
│   └── DashboardPage.tsx          # 主要頁面組件
├── hooks/                         # React Hooks
│   └── useDashboardTranslation.ts # 本地翻譯 hook
├── types/                         # TypeScript 類型定義
│   └── metaData.ts                # SEO 元數據
├── locales/                       # 翻譯文件
│   ├── zh-TW/
│   │   └── dashboard.json         # 繁體中文翻譯
│   └── en/
│       └── dashboard.json         # 英文翻譯
├── i18n.ts                        # 本地 i18n 配置
├── index.ts                       # 模組入口點
└── README.md                      # 本文檔
```

## 🌍 多語系支援

Dashboard 功能使用本地化的翻譯系統，翻譯文件存放在 `locales/` 目錄下：

### 翻譯文件結構

```json
{
  "dashboard": {
    "title": "儀表板",
    "welcome": "歡迎來到 NX Playground 管理後台",
    "stats": {
      "totalEvents": "總活動數",
      "activeUsers": "活躍用戶",
      "monthlyRevenue": "本月收入",
      "systemStatus": "系統狀態",
      "normal": "正常"
    },
    "quickActions": {
      "title": "快速操作",
      "createEvent": "創建活動",
      "manageUsers": "管理用戶",
      "viewReports": "查看報表",
      "systemSettings": "系統設定"
    },
    "searchAndFilter": {
      "title": "搜尋和篩選",
      "searchEvents": "搜尋活動",
      "searchPlaceholder": "輸入活動名稱或 ID...",
      "statusFilter": "狀態篩選",
      "statusPlaceholder": "選擇狀態",
      "all": "全部",
      "active": "進行中",
      "upcoming": "即將開始",
      "completed": "已完成",
      "cancelled": "已取消",
      "search": "搜尋",
      "reset": "重置"
    }
  }
}
```

## 🔧 使用方法

### 在組件中使用翻譯

```tsx
import { useDashboardTranslation } from '../hooks/useDashboardTranslation';

export const Dashboard: React.FC = () => {
  const { t } = useDashboardTranslation();

  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('dashboard.welcome')}</p>
    </div>
  );
};
```

### 初始化 i18n

在 Dashboard 組件中導入 i18n 配置：

```tsx
import '../i18n'; // 初始化本地 i18n 配置
```

## 🎯 設計原則

1. **模組化**：每個功能模組管理自己的翻譯文件
2. **類型安全**：使用 TypeScript 確保翻譯鍵的正確性
3. **可維護性**：翻譯文件與組件放在同一目錄下
4. **可擴展性**：可以輕鬆添加新的語言支援

## 📝 添加新語言

1. 在 `locales/` 目錄下創建新的語言目錄
2. 複製現有翻譯文件並翻譯內容
3. 更新 `i18n.ts` 配置

## 🔗 與全域 i18n 的關係

- **全域 i18n** (`@nx-playground/i18n`)：管理通用翻譯（common.json）
- **本地 i18n**：管理功能特定的翻譯（dashboard.json）

這種分離確保了：

- 通用翻譯可以在整個應用中共享
- 功能特定的翻譯保持模組化
- 更好的代碼組織和維護性

## 🛠️ 共用工具

Dashboard 使用共用的 i18n 工具來簡化配置：

### 使用的共用工具

- `createFeatureI18n` - 用於創建 i18n 配置
- `createFeatureTranslation` - 用於創建翻譯 hook

詳見 [共用 i18n 工具文檔](../../utils/README.md)。

### 優勢

- **代碼重用**：避免重複的 i18n 配置代碼
- **一致性**：確保所有功能模組使用相同的配置方式
- **易於維護**：統一的 API 和配置結構
