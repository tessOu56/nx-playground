---
id: 03-i18n
name: 國際化函式庫
version: 0.0.1
description: 基於 i18next 的國際化解決方案，具備功能層級翻譯
techStack:
  - i18next
  - React
  - TypeScript
  - next-intl
features:
  - 功能層級命名空間
  - 語言偵測
  - SSR 支援
  - 型別安全的 keys
  - 動態載入
status: production
category: utils
published: true
lastUpdated: '2025-01-24'
---

# Internationalization – 國際化函式庫

(i18next-based Multi-language Solution)

## 一、概念與定位 / Overview

這是一個**集中式國際化函式庫**，透過功能層級的翻譯管理，為所有應用程式提供多語言支援。

不同於基本的翻譯檔案，此函式庫提供：
- 可擴展的功能層級命名空間組織
- 自動語言偵測與 fallback
- 具備 IntelliSense 的型別安全翻譯 keys
- Next.js 的伺服器端渲染（SSR）支援
- 效能導向的動態翻譯載入

此函式庫作為整個 monorepo 的 **i18n 基礎**，展示可擴展的翻譯架構。

---

## 二、核心能力 / Core Capabilities

### 1. 功能層級翻譯組織

- 翻譯依功能/模組組織，而非全域
- 命名空間隔離，防止 key 衝突
- 功能翻譯的延遲載入
- 易於維護與擴展
- 翻譯檔案的明確所有權

**重點價值**：可擴展的 i18n 架構，隨應用程式成長而不會變得難以管理。

---

### 2. 自動語言管理

- 瀏覽器語言偵測
- 使用者偏好持久化
- 缺少翻譯時 fallback 至預設語言
- 無需重新載入即可動態切換語言
- 特定地區的日期、數字、貨幣格式化

**重點價值**：具備智能 fallbacks 的無縫多語言體驗。

---

### 3. 開發者體驗

- 具備 TypeScript 的型別安全翻譯 keys
- 所有 keys 的 IntelliSense 自動完成
- 開發時的缺失翻譯警告
- 翻譯更新的熱重載
- 翻譯管理的 CLI 工具

**重點價值**：防止翻譯錯誤並提升開發速度。

---

## 三、技術亮點 / Technical Highlights

| 面向               | 說明                                      |
| ------------------ | ----------------------------------------- |
| **i18next**        | 業界標準的 i18n 框架，具備豐富生態系      |
| **型別安全**       | 為所有翻譯 keys 生成 TypeScript 型別      |
| **SSR 支援**       | next-intl 用於 Next.js 伺服器端渲染       |
| **效能**           | 動態載入減少初始 bundle 大小              |

**結果**：處理複雜翻譯情境的強大 i18n 系統。

---

## 四、使用範圍 / Usage Scope

**使用此函式庫的應用程式**：
- Profile（en、zh-TW）
- Event-Portal（en、zh-TW）搭配 next-intl
- Event-CMS（en、zh-TW）
- Auth（en、zh-TW）

**支援語言**：
- 英文（en）- 預設
- 繁體中文（zh-TW）
- 可擴充至更多語言

---

## 五、整合方式 / API & Integration

**React 使用方式**：
```tsx
import { useTranslation } from '@nx-playground/i18n';

function MyComponent() {
  const { t } = useTranslation('featureName');
  
  return <h1>{t('welcome.title')}</h1>;
}
```

**Next.js 使用方式**：
```tsx
import { useTranslations } from 'next-intl';

function Page() {
  const t = useTranslations('featureName');
  
  return <h1>{t('welcome.title')}</h1>;
}
```

**主要匯出**：
- `createFeatureI18n()` - 功能翻譯工廠
- 具備型別安全的翻譯 hooks
- 語言切換工具

---

## 六、品質標準 / Quality Standards

**翻譯品質**：
- zh-TW 由母語者審核
- 跨功能的一致術語
- 考慮情境的翻譯

**測試**：
- 缺失翻譯偵測
- Placeholder 驗證
- 語言切換測試

**維護**：
- 定期翻譯稽核
- 清理已棄用的 keys
- 為翻譯者提供的文件

---

## 七、授權 / License

MIT（開放使用與修改）

---

## 八、補充文件 / Additional Documentation

- `specs/libs/i18n/en.md` - 英文規格說明
- `specs/libs/i18n/zh-TW.md` - 繁中規格（本文件）
- `libs/i18n/README.md` - 開發者文件

注意：翻譯檔案結構與使用指南請參考 README.md。
