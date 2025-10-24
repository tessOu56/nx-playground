# AI Search 實作規劃

## 現況分析

### 當前實作
- ✅ UI 完整（輸入框、對話介面、範例問題）
- ✅ 深色主題與紫色主視覺
- ✅ 流暢的使用者體驗
- ⚠️ Mock 回覆（固定訊息）
- ⚠️ 無實際 AI 整合
- ⚠️ 無知識庫搜尋

### 資料來源
Profile app 有豐富的資料可供 AI 查詢：
1. **Projects Data** - Apps 和 Libs 的詳細資訊
2. **Blog Posts** - 年度技術文章
3. **Tech Stack** - 技術棧資料
4. **README 和 Specs** - 專案文件

## 技術方案評估

### Option A: Vercel AI SDK + OpenAI

**優點**：
- 成熟的 SDK，簡化整合
- 支援 streaming responses
- Edge functions 部署
- 官方維護，文件完整

**缺點**：
- 需要 OpenAI API key
- API 調用成本
- 依賴第三方服務

**適用場景**：
- 需要高品質回覆
- 可接受 API 成本
- Cloudflare Pages 部署（支援 Edge functions）

**實作複雜度**：⭐⭐⭐ (Medium)

---

### Option B: 本地 LLM（Ollama）

**優點**：
- 完全免費
- 資料隱私
- 無 API 限制

**缺點**：
- 需要伺服器運算資源
- 回覆品質可能較低
- 需要自行部署和維護

**適用場景**：
- 有自己的伺服器
- 重視隱私和成本
- 可接受較低的回覆品質

**實作複雜度**：⭐⭐⭐⭐ (High)

---

### Option C: 簡化版 - 關鍵字搜尋 + 模板回覆

**優點**：
- 不需要 AI API
- 實作簡單快速
- 完全可控
- 零成本

**缺點**：
- 不是真正的 AI
- 回覆較生硬
- 功能有限

**適用場景**：
- 快速 MVP
- 展示用途
- 過渡方案

**實作複雜度**：⭐⭐ (Low)

---

## 建議實作方案（階段性）

### Phase 1: 智能關鍵字搜尋（1-2 天）

不使用 AI API，但提供智能的搜尋和回覆。

**實作內容**：

1. **關鍵字匹配引擎**
   ```typescript
   // libs/search-engine/src/lib/matcher.ts
   interface SearchableItem {
     type: 'project' | 'blog' | 'tech';
     id: string;
     name: string;
     description: string;
     keywords: string[];
     content: string;
   }
   
   function matchQuery(query: string, items: SearchableItem[]): SearchableItem[] {
     // Fuzzy matching, keyword extraction
     // Return ranked results
   }
   ```

2. **回覆模板系統**
   ```typescript
   // 根據查詢類型生成回覆
   const templates = {
     projects: (results) => `I found ${results.length} projects...`,
     techStack: (tech) => `I use ${tech} in the following projects...`,
     experience: (years) => `I have ${years} years of experience...`,
   };
   ```

3. **資料索引**
   - 建立 projects, blogs, tech stack 的索引
   - 預處理關鍵字和摘要
   - 建立 inverted index

**優點**：
- 快速實作
- 零成本
- 完全可控
- 作為後續 AI 整合的基礎

**檔案結構**：
```
libs/search-engine/
├── src/
│   ├── lib/
│   │   ├── indexer.ts        # 建立搜尋索引
│   │   ├── matcher.ts        # 關鍵字匹配
│   │   ├── ranker.ts         # 結果排序
│   │   └── templates.ts      # 回覆模板
│   ├── types.ts
│   └── index.ts
├── README.md
└── package.json
```

---

### Phase 2: RAG 系統（1-2 週）

整合 AI 與知識庫檢索。

**架構設計**：

```
使用者查詢
    ↓
關鍵字搜尋（Phase 1 的引擎）
    ↓
取得相關文件（Top 3-5）
    ↓
組合 Prompt（Context + Query）
    ↓
AI API 呼叫
    ↓
串流回覆給使用者
```

**技術選擇**：Vercel AI SDK + OpenAI

**實作步驟**：

1. **建立 API Route**（Cloudflare Workers）
   ```typescript
   // api/chat/route.ts
   export async function POST(req: Request) {
     const { messages } = await req.json();
     
     // 1. 搜尋相關文件
     const context = await searchRelevantDocs(lastMessage);
     
     // 2. 組合 prompt
     const prompt = buildPrompt(context, lastMessage);
     
     // 3. 呼叫 OpenAI
     const stream = await openai.chat.completions.create({
       model: 'gpt-4-turbo-preview',
       messages: [systemPrompt, ...prompt],
       stream: true,
     });
     
     return new Response(stream);
   }
   ```

2. **Prompt Engineering**
   ```typescript
   const systemPrompt = `
   You are Tess's AI assistant. Answer questions about:
   - Projects and applications
   - Tech stack and tools
   - Development experience
   - Blog posts and insights
   
   Context provided: {context}
   
   Be concise, friendly, and accurate.
   `;
   ```

3. **前端整合**
   ```typescript
   // useChat hook from Vercel AI SDK
   const { messages, input, handleSubmit, isLoading } = useChat({
     api: '/api/chat',
   });
   ```

**成本估算**：
- GPT-4 Turbo: ~$0.01 per query
- 預算控制：設定每日/每月上限

---

### Phase 3: 向量搜尋（進階，可選）

若 Phase 2 搜尋品質不足，可升級為向量搜尋。

**技術**：
- OpenAI Embeddings
- 向量資料庫（Pinecone / Supabase Vector）
- Cosine similarity 排序

**優點**：
- 語義搜尋（semantic search）
- 更準確的相關文件檢索

**缺點**：
- 額外成本（embeddings API + 向量 DB）
- 實作複雜度更高

---

## 立即可執行的步驟

### 步驟 1: 建立 Search Engine Library（建議先做）

```bash
# 建立 library 結構
mkdir -p libs/search-engine/src/lib
```

### 步驟 2: 建立資料索引

```typescript
// 收集所有可搜尋的資料
const buildSearchIndex = async () => {
  const projects = await loadAllProjects();
  const blogs = await loadAllBlogs();
  const techStack = getTechStack();
  
  return {
    projects: projects.map(p => ({
      type: 'project',
      id: p.id,
      name: p.name,
      keywords: [p.name, ...p.techStack, ...p.features],
      content: p.description + ' ' + p.features.join(' '),
    })),
    // ... blogs, tech
  };
};
```

### 步驟 3: 實作簡單匹配

```typescript
// 簡單的關鍵字匹配
function matchKeywords(query: string, index: SearchIndex) {
  const keywords = query.toLowerCase().split(' ');
  const results = [];
  
  for (const item of index.projects) {
    const score = keywords.reduce((acc, kw) => {
      return acc + (item.keywords.some(k => k.includes(kw)) ? 1 : 0);
    }, 0);
    
    if (score > 0) {
      results.push({ item, score });
    }
  }
  
  return results.sort((a, b) => b.score - a.score);
}
```

### 步驟 4: 生成回覆

```typescript
function generateResponse(query: string, results: SearchResult[]) {
  if (results.length === 0) {
    return "I couldn't find anything matching your query. Try asking about specific projects or technologies!";
  }
  
  if (query.includes('project')) {
    const projectList = results.map(r => `- ${r.item.name}: ${r.item.content.slice(0, 100)}...`).join('\n');
    return `I found ${results.length} projects:\n\n${projectList}`;
  }
  
  // ... more templates
}
```

## 決策建議

### 建議採用：Phase 1 → Phase 2

**理由**：
1. **Phase 1** 提供立即可用的功能，無需 API key
2. **Phase 1** 作為 **Phase 2** 的基礎（搜尋引擎可重用）
3. **Phase 2** 提供真正的 AI 體驗，值得投資
4. 可根據使用情況決定是否進行 Phase 3

### 時程規劃

**Week 1**：Phase 1 實作
- Day 1-2: 建立 search-engine library
- Day 3-4: 實作索引和匹配
- Day 5-6: 整合到 SearchPage，測試

**Week 2-3**：Phase 2 實作（若決定採用）
- Day 1-3: API route 設計
- Day 4-6: OpenAI 整合
- Day 7-9: Streaming responses
- Day 10+: 測試和優化

## 需要的資源

### Phase 1（無額外資源）
- ✅ 已有所有資料
- ✅ 已有 UI
- ✅ 可立即開始

### Phase 2（需要）
- ⚠️ OpenAI API key（~$5 初始額度）
- ⚠️ Cloudflare Workers（免費方案可能足夠）
- ⚠️ 環境變數管理

---

## 下一步決策點

請決定：
1. 是否從 Phase 1 開始？
2. 是否要規劃 Phase 2（AI 整合）？
3. 預算考量（Phase 2 需要 API 成本）

建議：**先完成 Phase 1**，驗證搜尋品質，再決定是否投資 Phase 2。

