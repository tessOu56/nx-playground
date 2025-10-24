---
id: 01-ui-components
name: UI 元件庫
version: 0.1.0
description: 使用 React、TypeScript 與 Radix UI 建構的完整 UI 元件庫
techStack:
  - React 19
  - Radix UI
  - Tailwind CSS
  - TypeScript
features:
  - 40+ 元件
  - TypeScript 支援
  - 無障礙優先
  - 表單元件
  - 導覽元件
status: production
category: ui
published: true
lastUpdated: '2025-01-24'
---

# UI Components – UI 元件庫

(Comprehensive React Component Library)

## 一、概念與定位 / Overview

這是一個**集中式 UI 元件庫**，為 monorepo 中的所有 React 應用程式提供 40+ 個生產就緒的元件。

不同於分散的元件檔案，此函式庫提供：
- 所有應用程式的一致設計語言
- 建構於 Radix UI primitives 的無障礙優先元件
- 完整 TypeScript 支援與完善的 prop 型別
- Tailwind CSS 整合，易於客製化
- 經過測試且有文件的元件，隨時可用

此函式庫作為**所有 React UI 的基礎**，展示元件設計模式與可重用性策略。

---

## 二、核心能力 / Core Capabilities

### 1. 表單元件

- 具備驗證狀態的輸入欄位
- 含搜尋的下拉選單
- 核取方塊與單選按鈕群組
- 日期/時間選擇器
- 含預覽的檔案上傳
- 表單佈局與包裝器

**重點價值**：使用經過實戰驗證、無障礙的元件加速表單開發。

---

### 2. 導覽元件

- 響應式導覽列
- 含鍵盤支援的下拉選單
- 麵包屑與分頁
- 標籤頁與手風琴
- 側邊欄導覽
- 行動選單抽屜

**重點價值**：提供所有應用程式一致的導覽模式。

---

### 3. 回饋元件

- Toast 通知
- 警示橫幅
- 載入轉圈與骨架
- 進度指示器
- 空狀態
- 錯誤邊界

**重點價值**：透過清晰、一致的回饋機制提升使用者體驗。

---

### 4. 資料展示元件

- 各種佈局的卡片
- 含排序與篩選的表格
- 列表與網格
- 徽章與標籤
- 頭像與使用者晶片
- 統計顯示

**重點價值**：以最少程式碼實現美觀、響應式的資料呈現。

---

## 二、技術亮點 / Technical Highlights

| 面向               | 說明                                      |
| ------------------ | ----------------------------------------- |
| **無障礙性**       | 建構於 Radix UI primitives，符合 WCAG AA |
| **型別安全**       | 完整 TypeScript 搭配嚴格的 prop 介面      |
| **設計整合**       | 使用 Design System tokens 實現一致主題    |
| **開發者體驗**     | 完善的 prop APIs 搭配 IntelliSense 支援   |

**結果**：生產就緒的元件，減少開發時間 50% 以上。

---

## 三、使用範圍 / Usage Scope

**使用此函式庫的應用程式**：
- Profile（作品集網站）
- Event-CMS（管理後台）
- Event-Portal（公開平台）
- Auth（認證頁面）

**主要使用案例**：
- 表單密集的管理介面
- 面向公眾的內容頁面
- 認證流程
- 儀表板與分析顯示

---

## 四、整合方式 / API & Integration

**匯入範例**：
```tsx
import { Button, Input, Card } from '@nx-playground/ui-components';

function MyForm() {
  return (
    <Card>
      <Input label="Email" type="email" />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

**主要匯出**：
- 40+ 元件（Button、Input、Card、Modal 等）
- 5+ 佈局元件
- 所有 props 的型別定義

---

## 五、品質標準 / Quality Standards

**測試**：
- 元件邏輯的單元測試
- 使用 jest-axe 的無障礙測試
- 視覺回歸測試（規劃中）

**文件**：
- 所有元件的 JSDoc 註解
- README 中的使用範例
- Storybook 文件（規劃中）

**維護**：
- 積極開發與更新
- 維持向後相容性
- 定期相依性更新

---

## 六、授權 / License

MIT（開放使用與修改）

---

## 七、補充文件 / Additional Documentation

- `specs/libs/ui-components/en.md` - 英文規格說明
- `specs/libs/ui-components/zh-TW.md` - 繁中規格（本文件）
- `libs/ui-components/README.md` - 開發者文件

注意：元件 API 詳情與使用範例請參考 README.md。
