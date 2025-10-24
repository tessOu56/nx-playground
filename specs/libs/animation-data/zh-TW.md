---
id: animation-data
name: 動畫資料
version: 0.0.1
description: Vue 動態應用程式的動畫資料管理
techStack:
  - Vue 3
  - TypeScript
features:
  - 動畫預設
  - 資料轉換器
  - 匯出工具
status: production
category: data
published: true
lastUpdated: '2025-01-24'
---

# Animation Data – 動畫資料

(Animation Data Management for Vue)

## 一、概念與定位 / Overview

這是一個**動畫資料管理函式庫**，透過結構化的預設儲存與轉換工具支援 Vue Motion Sandbox。

不同於行內的動畫配置，此函式庫提供：

- 可重用的動畫預設函式庫
- 不同動畫函式庫的資料轉換器
- 分享用的匯入/匯出功能
- 動畫配置的 TypeScript 支援
- 動畫資料結構的驗證

此函式庫服務需要**結構化動畫資料管理**的 Vue 應用程式。

---

## 二、核心能力 / Core Capabilities

### 1. 動畫預設函式庫

- 預建的動畫配置
- 依類型分類（進入、離開、注意等）
- 可客製化參數
- 預設的版本追蹤
- 搜尋與篩選預設

**重點價值**：可重用的動畫模式加速動態設計開發。

---

### 2. 資料轉換

- 在 GSAP、Three.js、Lottie 格式間轉換
- 正規化動畫時間與緩動
- 程式化縮放與調整動畫
- 集合的批次轉換
- 驗證與錯誤處理

**重點價值**：實現跨不同函式庫與情境的動畫重複使用。

---

### 3. 匯入/匯出系統

- 將動畫配置儲存為 JSON
- 從檔案載入預設
- 與團隊分享預設
- 匯出程式碼片段以直接使用
- 版本化預設格式

**重點價值**：促進協作與動畫資產管理。

---

## 三、技術亮點 / Technical Highlights

| 面向         | 說明                           |
| ------------ | ------------------------------ |
| **Vue 3**    | Vue 應用程式的可組合資料層     |
| **型別安全** | 所有動畫資料的 TypeScript 定義 |
| **驗證**     | 執行時驗證防止無效配置         |
| **模組化**   | 框架無關的核心搭配 Vue 包裝器  |

**結果**：支援創意開發的有組織動畫資料層。

---

## 四、使用範圍 / Usage Scope

**應用程式**：

- Vue Motion Sandbox（主要使用者）
- 未來的 Vue 動畫專案

**使用案例**：

- 儲存可重用的動畫模式
- 在函式庫間轉換動畫
- 分享動畫配置
- 驗證動畫資料

---

## 五、整合方式 / API & Integration

**使用範例**：

```tsx
import { getPreset, transformToGSAP } from '@nx-playground/animation-data';

const fadeInPreset = getPreset('fadeIn');
const gsapConfig = transformToGSAP(fadeInPreset);

// 在 GSAP 中使用
gsap.from('.element', gsapConfig);
```

---

## 六、品質標準 / Quality Standards

**驗證**：

- 所有預設的 schema 驗證
- 編譯與執行時的型別檢查
- 無效配置的錯誤訊息

**文件**：

- 含範例的預設目錄
- 轉換指南
- API 參考

---

## 七、授權 / License

MIT（開放使用與修改）

---

## 八、補充文件 / Additional Documentation

- `specs/libs/animation-data/en.md` - 英文規格說明
- `specs/libs/animation-data/zh-TW.md` - 繁中規格（本文件）
- `libs/animation-data/README.md` - 開發者文件
