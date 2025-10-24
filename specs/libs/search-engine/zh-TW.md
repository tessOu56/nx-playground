---
id: search-engine
name: 搜尋引擎
version: 1.0.0
description: 具備關鍵字比對與意圖偵測的自訂搜尋引擎
techStack:
  - TypeScript
  - Node.js
features:
  - 關鍵字比對
  - 意圖偵測
  - 搜尋索引
  - 回應生成
  - 建議問題
status: production
category: utils
published: true
lastUpdated: '2025-01-24'
---

# Search Engine – 搜尋引擎

(AI-Powered Knowledge Search Library)

## 一、概念與定位 / Overview

這是一個**自訂建構的搜尋引擎**，提供智能關鍵字比對與意圖偵測，無需外部 AI 相依性。

不同於簡單的文字搜尋，此引擎提供：

- 理解使用者想知道什麼的意圖偵測
- 考慮情境的回應生成
- 建議的後續問題
- 從專案/部落格內容建構的搜尋索引
- 對話 session 管理

此函式庫展示**演算法設計**與**系統架構**技能，完全從零建構。

---

## 二、核心能力 / Core Capabilities

### 1. 智能關鍵字比對

- 跨專案、部落格與技術棧的多欄位搜尋
- 容錯的模糊比對
- 依欄位重要性加權評分
- 同義詞與相關詞彙擴展
- 類別感知篩選

**重點價值**：即使查詢不精確也能找到相關內容。

---

### 2. 意圖偵測

- 自然語言查詢解析
- 問題類型分類（what、how、why、where）
- 從查詢中擷取情境
- 實體辨識（技術、專案名稱）
- 查詢重新表述以獲得更好結果

**重點價值**：理解使用者意圖以提供更相關的答案。

---

### 3. 回應生成

- 基於範本的答案組成
- 內容片段擷取
- 相關內容建議
- 答案信心評分
- 未知查詢的 fallback 回應

**重點價值**：提供自然、對話式的回應，而非僅僅搜尋結果。

---

## 三、技術亮點 / Technical Highlights

| 面向           | 說明                         |
| -------------- | ---------------------------- |
| **零相依性**   | 從零建構，無 AI API 成本     |
| **型別安全**   | 完整 TypeScript 搭配嚴格型別 |
| **演算法設計** | 自訂排名與比對演算法         |
| **效能**       | 記憶體內索引實現即時結果     |

**結果**：快速、成本效益高的搜尋，無外部 API 相依性。

---

## 四、使用範圍 / Usage Scope

**應用程式**：

- Profile（AI 驅動的知識助手）
- 未來需要智能搜尋的應用程式

**搜尋領域**：

- 專案（apps 與 libs）
- 部落格文章
- 技術棧與技能
- 工作相關的一般知識

---

## 五、整合方式 / API & Integration

**使用範例**：

```tsx
import { SearchEngine } from '@nx-playground/search-engine';

const engine = new SearchEngine();

// 從內容建構索引
engine.indexProjects(projects);
engine.indexBlogs(blogs);

// 搜尋
const results = engine.search('你有哪些 React 專案？');
console.log(results.intent); // 'project_query'
console.log(results.response); // 生成的答案
console.log(results.suggestions); // 後續問題
```

**主要匯出**：

- `SearchEngine` class
- 索引建構器工具
- 意圖分類器
- 回應生成器

---

## 六、品質標準 / Quality Standards

**準確性**：

- 使用範例查詢的相關性測試
- 意圖分類準確度追蹤
- 使用者回饋整合（規劃中）

**效能**：

- 索引建構 < 100ms
- 搜尋回應 < 50ms
- 記憶體高效的資料結構

**維護**：

- 定期演算法改進
- 新增意圖模式
- 索引最佳化

---

## 七、授權 / License

MIT（開放使用與修改）

---

## 八、補充文件 / Additional Documentation

- `specs/libs/search-engine/en.md` - 英文規格說明
- `specs/libs/search-engine/zh-TW.md` - 繁中規格（本文件）
- `libs/search-engine/README.md` - 開發者文件

注意：演算法細節與索引結構請參考 README.md。
