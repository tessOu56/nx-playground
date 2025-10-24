---
id: charts
name: 圖表元件庫
version: 0.1.0
description: 支援 Chart.js 與 Recharts 的圖表元件庫
techStack:
  - Chart.js
  - Recharts
  - React 19
  - TypeScript
features:
  - 多種圖表類型
  - 雙函式庫支援
  - 響應式設計
  - 主題整合
status: production
category: ui
published: true
lastUpdated: '2025-01-24'
---

# Chart Components – 圖表元件庫

(Data Visualization Library)

## 一、概念與定位 / Overview

這是一個**圖表元件庫**，提供雙函式庫支援（Chart.js 與 Recharts）的資料視覺化元件。

不同於直接使用函式庫，此包裝器提供：

- Chart.js 與 Recharts 的統一 API
- 與 Design System 整合的一致樣式
- 適應容器大小的響應式圖表
- 嚴格型別的 TypeScript 支援
- 預配置的常見圖表類型

此函式庫作為**視覺化基礎**，展示資料呈現與元件抽象模式。

---

## 二、核心能力 / Core Capabilities

### 1. 多種圖表類型

- 折線圖、長條圖、圓餅圖、面積圖、散點圖
- 具備多個資料集的組合圖表
- 可客製化的軸與圖例
- 互動式工具提示與標籤
- 動畫與轉場效果

**重點價值**：以一致的 API 涵蓋所有常見的資料視覺化需求。

---

### 2. 雙函式庫支援

- Chart.js 用於基於 canvas 的渲染
- Recharts 用於基於 SVG 的圖表
- 依使用案例自動選擇函式庫
- 相容性的 fallback 選項
- 每個函式庫的效能最佳化

**重點價值**：採用兩全其美的方式，為每種情境使用正確的工具。

---

### 3. 主題整合

- 從 Design System 自動套用色彩方案
- 深色模式支援
- 自訂色彩調色盤
- 響應式字體大小
- 無障礙的顏色對比

**重點價值**：圖表自動符合應用程式主題，無需手動配置。

---

## 三、技術亮點 / Technical Highlights

| 面向         | 說明                                     |
| ------------ | ---------------------------------------- |
| **雙函式庫** | Chart.js（canvas）與 Recharts（SVG）支援 |
| **響應式**   | 使用容器觀察自動縮放                     |
| **型別安全** | 完整 TypeScript 用於資料與配置           |
| **主題感知** | 與 Design System tokens 整合             |

**結果**：適用於多樣化視覺化需求的彈性圖表函式庫。

---

## 四、使用範圍 / Usage Scope

**應用程式**：

- Event-CMS（分析儀表板）
- Enterprise-Admin（監控圖表）
- 未來需要資料視覺化的應用程式

**圖表類型**：

- 折線圖用於趨勢
- 長條圖用於比較
- 圓餅圖用於分布
- 面積圖用於累積資料

---

## 五、整合方式 / API & Integration

**使用範例**：

```tsx
import { LineChart, BarChart } from '@nx-playground/charts';

function Analytics() {
  const data = [
    { month: 'Jan', users: 100 },
    { month: 'Feb', users: 150 },
  ];

  return (
    <>
      <LineChart data={data} xKey='month' yKey='users' />
      <BarChart data={data} xKey='month' yKey='users' />
    </>
  );
}
```

---

## 六、品質標準 / Quality Standards

**效能**：

- 圖表函式庫的延遲載入
- Memoization 防止不必要的重新渲染
- 高效的資料轉換

**文件**：

- 每種圖表類型的範例
- 配置選項文件化
- 函式庫間的遷移指南

---

## 七、授權 / License

MIT（開放使用與修改）

---

## 八、補充文件 / Additional Documentation

- `specs/libs/charts/en.md` - 英文規格說明
- `specs/libs/charts/zh-TW.md` - 繁中規格（本文件）
- `libs/charts/README.md` - 開發者文件
