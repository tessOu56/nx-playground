---
id: 02-design-system
name: 設計系統
version: 0.1.0
description: 整合 Style Dictionary 的設計 token 與主題系統
techStack:
  - Style Dictionary
  - CSS Variables
  - Tailwind CSS
  - TypeScript
features:
  - 設計 tokens
  - 多主題
  - CSS 變數
  - Tailwind 整合
  - Token 視覺化
status: production
category: ui
published: true
lastUpdated: '2025-01-24'
---

# Design System – 設計系統

(Design Tokens and Theming Foundation)

## 一、概念與定位 / Overview

這是一個**集中式設計 token 系統**，確保 monorepo 中所有應用程式的視覺一致性。

不同於寫死的設計值，此系統提供：
- 所有設計決策的單一真實來源（顏色、間距、字體）
- 可轉換為任何格式的平台無關 tokens
- 多主題支援（淺色、深色、自訂）
- 跨應用程式的自動同步
- 為設計師與開發者提供的視覺 token 瀏覽器

此系統作為整個平台的**設計基礎**，展示系統化設計思維與可擴展性。

---

## 二、核心能力 / Core Capabilities

### 1. 設計 Token 管理

- 集中式 token 定義（顏色、間距、字體、陰影）
- 語意命名系統（primary、secondary、surface 等）
- Token 別名與參照
- 自動驗證與型別檢查
- 設計變更的版本控制

**重點價值**：一次變更即可即時更新所有應用程式，確保設計一致性。

---

### 2. 多主題支援

- 內建淺色與深色主題
- 使用 token 覆寫建立自訂主題
- 無需重新載入頁面即可切換主題
- 每個元件的主題客製化
- 主題預覽工具

**重點價值**：彈性的主題系統，支援多樣化的品牌需求。

---

### 3. 跨平台 Token 轉換

- Style Dictionary 用於 token 轉換
- 為 Web 應用程式提供 CSS 變數
- 生成 Tailwind 配置
- TypeScript 型別定義
- 為設計工具匯出 JSON

**重點價值**：設計 tokens 可用於任何平台或框架。

---

## 三、技術亮點 / Technical Highlights

| 面向                | 說明                                  |
| ------------------- | ------------------------------------- |
| **Style Dictionary** | 業界標準的 token 轉換管線             |
| **CSS Variables**   | 執行時主題切換，無需重新建置          |
| **Tailwind 整合**   | 從設計 tokens 自動生成配置            |
| **型別安全**        | 所有 tokens 的 TypeScript 定義        |

**結果**：支援多個應用程式與主題的可擴展設計系統。

---

## 四、使用範圍 / Usage Scope

**使用此函式庫的應用程式**：
- 所有 React 應用（Profile、Event-CMS、Event-Portal、Auth）
- 跨專案共享的 Tailwind 配置
- 全域可用的 CSS 變數

**主要使用案例**：
- 跨應用程式的一致色彩方案
- 標準化間距與尺寸
- 字體系統
- 陰影與圓角標準

---

## 五、整合方式 / API & Integration

**在 CSS 中使用 Token**：
```css
.card {
  background: var(--color-surface);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}
```

**在 Tailwind 中使用 Token**：
```tsx
<div className="bg-surface p-4 rounded-md shadow-sm">
  Content
</div>
```

**主要匯出**：
- `tokens.css` 中的 CSS 變數
- `tailwind.config.js` 中的 Tailwind 配置
- `tokens.ts` 中的 TypeScript 型別

---

## 六、品質標準 / Quality Standards

**驗證**：
- 建置時自動 token 驗證
- Token 參照的型別檢查
- 無孤立或未定義的 tokens

**文件**：
- 視覺 token 瀏覽器
- 使用指南
- 更新時的遷移指南

**維護**：
- 破壞性變更的語意版本控制
- 所有 token 更新的變更日誌
- Token 生成的自動化測試

---

## 七、授權 / License

MIT（開放使用與修改）

---

## 八、補充文件 / Additional Documentation

- `specs/libs/design-system/en.md` - 英文規格說明
- `specs/libs/design-system/zh-TW.md` - 繁中規格（本文件）
- `libs/design-system/README.md` - 開發者文件

注意：Token 定義與轉換設定請參考 README.md。
