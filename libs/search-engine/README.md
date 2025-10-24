# @nx-playground/search-engine

> 智能關鍵字搜尋引擎，為 AI Search 功能提供基礎

## 功能特色

- 🔍 **關鍵字匹配** - 多層級權重計分
- 🎯 **意圖偵測** - 自動識別查詢類型
- 📝 **模板回覆** - 根據查詢類型生成回覆
- 🚀 **零成本** - 不需要 AI API
- 🔧 **可擴展** - 可作為 RAG 系統的基礎

## 使用方式

### 1. 建立搜尋索引

```typescript
import { buildSearchIndex } from '@nx-playground/search-engine';

const index = buildSearchIndex({
  projects: await loadAllProjects(),
  blogs: await loadAllBlogs(),
  techStack: getTechStack(),
});
```

### 2. 搜尋

```typescript
import { searchItems, detectIntent } from '@nx-playground/search-engine';

const query = "What projects use React?";
const intent = detectIntent(query);
const results = searchItems(query, [...index.projects, ...index.blogs], 10);
```

### 3. 生成回覆

```typescript
import { generateResponse } from '@nx-playground/search-engine';

const response = generateResponse(query, results, intent);
// "I found 5 projects related to your query:..."
```

## 匹配權重

- **名稱精確匹配**: 10 分
- **關鍵字匹配**: 5 分
- **描述匹配**: 2 分
- **內容匹配**: 1 分

## 意圖類型

- `project` - 專案相關查詢
- `blog` - 部落格文章查詢
- `tech` - 技術棧查詢
- `experience` - 經驗相關查詢
- `general` - 一般查詢

## 回覆模板

每種意圖類型都有對應的回覆模板：
- 專案列表格式
- 部落格時間線格式
- 技術棧分組格式
- 經驗總結格式

## 整合範例

```typescript
// In SearchPage
const handleSearch = async (query: string) => {
  const intent = detectIntent(query);
  const allItems = [...index.projects, ...index.blogs, ...index.tech];
  const results = searchItems(query, allItems, 10);
  const response = generateResponse(query, results, intent);
  
  setMessages(prev => [...prev, {
    role: 'assistant',
    content: response,
  }]);
};
```

## 下一步

此搜尋引擎可作為 RAG 系統的基礎：
1. 使用此引擎檢索相關文件
2. 將文件作為 context 提供給 AI
3. AI 基於 context 生成回覆

## 效能

- 索引建立：< 100ms
- 單次搜尋：< 10ms
- 適合即時互動

