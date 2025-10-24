---
id: search-engine
name: 搜尋引擎
version: 1.0.0
description: 具備關鍵字比對與意圖偵測的自訂搜尋引擎
techStack:
  - TypeScript
  - Node.js
features:
  - Keyword matching
  - Intent detection
  - Search indexing
  - Response generation
  - Suggested questions
lastUpdated: '2025-01-24'
category: utils
status: production
published: true

shortDesc: |
  具備意圖偵測與情境建議的智能關鍵字搜尋引擎，
  無需外部 AI 依賴，從零打造。

purpose: |
  為 Profile app 提供智能搜尋功能，展示演算法設計、系統架構與軟體工程技能。
  
  作為零依賴函式庫展示：
  - 搜尋演算法實作
  - 乾淨的 API 設計
  - 型別安全的 TypeScript 架構
  - 測試驅動開發方法

highlights:
  - 自建倒排索引實作
  - 多欄位關鍵字匹配與評分
  - 意圖偵測（專案/部落格/技術/通用）
  - 情境建議問題生成
  - 零外部依賴
  - 完整 TypeScript 型別安全

stats:
  components: 4
  utilities: 6
  algorithms: 3

useCases:
  - Profile app AI Search 功能（Phase 1）
  - 知識庫查詢
  - 內容探索與發現
  - 未來：可擴展至其他搜尋需求

targetAudience: |
  向雇主與客戶展示：
  - 演算法設計技能（索引、匹配、評分）
  - 軟體架構（模組化、可擴展）
  - API 設計（乾淨介面、型別安全）
  - 效能意識（高效搜尋）

reviewer: tessou
reviewedAt: '2025-10-24'
nextReview: '2025-11-24'
updateFrequency: per-feature
draftStatus: false
approvalStatus: approved

relatedDocs:
  - 'libs/search-engine/README.md'
  - 'apps/profile/AI_SEARCH_PLAN.md'

lastSync: '2025-10-24'
---

# Search Engine - 自建智能搜尋函式庫

輕量級、零依賴的搜尋引擎，從零打造以支援 Profile app 的 AI Search 功能。展示演算法實作、系統設計與軟體工程最佳實踐。

## 架構

### 核心元件

1. **Indexer**（`indexer.ts`）
   - 從專案、部落格、技術棧建立倒排索引
   - 提取並正規化關鍵字
   - 建立可搜尋資料結構

2. **Matcher**（`matcher.ts`）
   - 關鍵字提取與正規化
   - 多欄位搜尋與評分
   - 意圖偵測演算法
   - 結果排序

3. **Suggestions**（`suggestions.ts`）
   - 情境後續問題生成
   - 基於意圖的建議
   - 基於關鍵字的提示
   - 對話流程優化

4. **Templates**（`templates.ts`）
   - 基於意圖的回應生成
   - 自然語言格式化
   - 錯誤處理訊息
   - 無結果 fallback

## 演算法設計

### 搜尋評分

- 名稱匹配：+5 分
- 描述匹配：+3 分
- 關鍵字匹配：+2 分
- 技術棧匹配：+2 分
- 內容匹配：+1 分

### 意圖偵測

查詢分類的模式匹配。

### 建議生成

雙層方法：情境式 + 意圖式，隨機取前 5 個。

## 價值

展示從零實作搜尋引擎的能力，證明演算法與系統架構思維。

