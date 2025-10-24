---
id: tech-stack-data
name: 技術棧資料
version: 0.0.1
description: 自動收集與管理 Nx workspace 的技術棧資料
techStack:
  - TypeScript
  - Nx
  - Node.js
features:
  - 從 package.json 自動收集
  - 手動資料補充
  - 專案相依性分析
  - 分類分類
status: production
category: data
published: true
lastUpdated: '2025-01-24'
---

# Tech Stack Data – 技術棧資料

(Technology Stack Management Library)

## 一、概念與定位 / Overview

這是一個**自動化技術棧收集器**，從 Nx workspace 收集與管理技術資訊。

不同於手動的技術清單，此函式庫提供：

- 從 package.json 檔案自動擷取
- 跨專案的相依性分析
- 技術分類（前端、後端、工具）
- 版本追蹤與相容性檢查
- 集中式技術棧資料用於顯示

此函式庫展示 **workspace 內省**與 **metadata 擷取**能力。

---

## 二、核心能力 / Core Capabilities

### 1. 自動收集

- 掃描 workspace 中所有 package.json 檔案
- 擷取 dependencies 與 devDependencies
- 識別框架與函式庫版本
- 偵測建置工具與配置
- 相依性變更時自動更新

**重點價值**：免除手動技術棧文件化，永遠準確且最新。

---

### 2. 分類與分析

- 依類型分類技術（UI、狀態、樣式等）
- 識別共享與專案特定的相依性
- 偵測跨專案的版本不符
- 強調未使用的相依性
- 生成相依性圖表

**重點價值**：提供 monorepo 技術景觀與維護需求的洞察。

---

### 3. 顯示資料生成

- 為 UI 元件格式化資料（TechProfile、cards）
- 生成技能層級指標
- 為經驗視覺化建立時間軸資料
- 匯出用於作品集顯示
- 可客製化的資料轉換

**重點價值**：以真實、當前的資料驅動 Profile app 中的 Tech Stack 區塊。

---

## 三、技術亮點 / Technical Highlights

| 面向         | 說明                               |
| ------------ | ---------------------------------- |
| **Nx 整合**  | 利用 Nx workspace 結構與 metadata  |
| **自動化**   | 零手動維護，自我更新               |
| **型別安全** | 為所有技術資料生成 TypeScript 型別 |
| **彈性**     | 手動覆寫用於顯示客製化             |

**結果**：準確、自動化的技術棧管理，減少文件負擔。

---

## 四、使用範圍 / Usage Scope

**應用程式**：

- Profile（TechProfile 區塊、專案技術徽章）
- 未來的作品集網站
- 技術棧視覺化工具

**資料來源**：

- Workspace 中所有 package.json 檔案
- 配置檔案中的手動補充
- Nx 專案 metadata

---

## 五、整合方式 / API & Integration

**使用範例**：

```tsx
import { getTechStack, categorizeByType } from '@nx-playground/tech-stack-data';

function TechStackDisplay() {
  const allTech = getTechStack();
  const byCategory = categorizeByType(allTech);

  return (
    <div>
      {Object.entries(byCategory).map(([category, techs]) => (
        <TechCategory key={category} name={category} items={techs} />
      ))}
    </div>
  );
}
```

**主要匯出**：

- 技術棧收集函數
- 分類工具
- 技術資料的型別定義
- 顯示格式化器

---

## 六、品質標準 / Quality Standards

**資料準確性**：

- 自動收集防止過時資料
- 版本資訊永遠最新
- 擷取資料的驗證

**測試**：

- 收集邏輯的單元測試
- 與真實 workspace 的整合測試
- 資料轉換測試

---

## 七、授權 / License

MIT（開放使用與修改）

---

## 八、補充文件 / Additional Documentation

- `specs/libs/tech-stack-data/en.md` - 英文規格說明
- `specs/libs/tech-stack-data/zh-TW.md` - 繁中規格（本文件）
- `libs/tech-stack-data/README.md` - 開發者文件

注意：收集腳本與資料格式詳情請參考 README.md。
