# 📋 下一階段計劃 - 文檔清理與功能推展

**規劃日期**: 2025-10-20
**當前狀態**: Clean Code Refactor 100% 完成
**下一目標**: 文檔整理 + 功能開發

---

## Phase A: 文檔清理與重組 (預估 1 小時)

### A1: 根目錄清理 (15 分鐘)

**刪除過程記錄** (4 個):

- ❌ `PROFILE_RESTRUCTURE_COMPLETE.md` - 內容已在 docs/apps/PROFILE.md
- ❌ `MIGRATION.md` - 2025-10-08 遷移記錄，已過時
- ❌ `CLEAN_CODE_PROGRESS.md` - 進度追蹤，已完成
- ❌ `CLEANUP_COMPLETE.md` - 清理報告，已完成

**移動到 archive/** (2 個):

```bash
mv REFACTOR_COMPLETE.md docs/archive/2025-10-20-CLEAN_CODE_REFACTOR.md
mv CLEAN_CODE_AUDIT.md docs/archive/2025-10-20-CLEAN_CODE_AUDIT.md
```

**結果**: 根目錄只保留 `README.md`

---

### A2: docs/ 重組 (20 分鐘)

**移動到 archive/**:

```bash
mv docs/BACKEND_IMPLEMENTATION.md docs/archive/
mv docs/backend/ docs/archive/backend/
```

**原因**: 後端使用 NestJS，這些是舊的設計文檔

**創建 libs/ 目錄**:

```bash
mkdir docs/libs/
```

---

### A3: 補充缺少的 App 文檔 (25 分鐘)

創建以下文檔：

**docs/apps/AUTH.md**:

- 專案定位：認證服務
- Ory Kratos 整合
- 品牌設計（磚紅色）
- SSO 提供商
- 技術棧：React 19 + Vite + react-hook-form

**docs/apps/ENTERPRISE_ADMIN.md**:

- 專案定位：架構推演
- 資料處理在 libs/enterprise-data
- Angular 20 + Signal Store
- RBAC + Dual-control
- 技術架構圖

**docs/apps/VUE_MOTION.md**:

- 專案定位：動畫 Sandbox
- 資料處理在 libs/animation-data
- Vue 3 + Composition API
- 動畫技術展示
- GSAP, Three.js, Lottie

**docs/apps/API_SERVER.md**:

- NestJS 後端
- Prisma ORM
- OpenAPI 規範
- Events/Users API

更新 **docs/apps/README.md**:

- 補充所有 7 個 apps 的索引
- 對比表格更新

---

### A4: 創建 Libs 文檔 (20 分鐘)

**docs/libs/README.md**:

```markdown
# Shared Libraries

本 monorepo 共有 9 個共享函式庫：

## UI & Design

- ui-components - 23+ Radix UI 組件
- design-system - Design tokens 系統

## Data & API

- api-client - OpenAPI → React Query
- auth-client - SSO 認證
- enterprise-data - Angular 資料處理 (新)
- animation-data - Vue 動畫數據 (新)

## Utils

- hooks - React hooks 集合
- i18n - 國際化
- charts - 雙軌制圖表
```

**docs/libs/ENTERPRISE_DATA.md**:

- 為 Angular 架構推演提供資料層
- Models, Services, Transformers, Validators
- 使用範例

**docs/libs/ANIMATION_DATA.md**:

- 為 Vue Sandbox 提供動畫數據
- Presets, Transformers, Exporters
- CSS 生成邏輯

---

### A5: 更新核心文檔 (10 分鐘)

**docs/README.md**:

- 更新文檔結構
- 添加 Clean Code Refactor 成果
- 添加 libs/ 文檔索引
- 更新版本歷史

**docs/CURRENT_STATUS.md**:

- 確保 Phase 4 (Clean Code Refactor) 章節完整
- 更新 libs 數量為 9 個
- 更新完成度

---

## Phase B: 功能推展規劃 (選擇一個方向)

### 選項 1: Profile 部落格系統 (推薦 - 2-3 週)

#### 目標

將 Profile 從靜態展示升級為動態內容平台

#### 功能規劃

**Week 1: 基礎架構**

創建 `apps/profile/src/features/blog/`:

```
features/blog/
├── components/
│   ├── BlogCard.tsx          # 文章卡片
│   ├── BlogPost.tsx          # 文章內容
│   ├── MarkdownRenderer.tsx  # MDX 渲染器
│   ├── TableOfContents.tsx   # 目錄
│   ├── CodeBlock.tsx         # 程式碼區塊
│   └── ShareButtons.tsx      # 分享按鈕
├── pages/
│   ├── BlogListPage.tsx      # 文章列表
│   └── BlogPostPage.tsx      # 文章詳情
├── data/
│   └── posts/                # MDX 文章
│       ├── 2025-10-react-19.mdx
│       ├── 2025-10-nx-monorepo.mdx
│       └── index.ts
├── utils/
│   ├── markdown.ts           # MDX 處理
│   ├── generateRss.ts        # RSS 生成
│   └── readingTime.ts        # 閱讀時間
├── hooks/
│   └── useBlogTranslation.ts
├── locales/
│   ├── en/blog.json
│   └── zh-TW/blog.json
├── types.ts
├── i18n.ts
└── index.ts
```

**技術堆疊**:

- `@mdx-js/mdx` - MDX 支援
- `remark-gfm` - GitHub Flavored Markdown
- `rehype-highlight` - 語法高亮
- `rehype-slug` - 標題 ID
- `rehype-autolink-headings` - 標題連結
- `gray-matter` - Front matter 解析
- `reading-time` - 閱讀時間估算

**路由**:

```
/:locale/blog         → BlogListPage
/:locale/blog/:slug   → BlogPostPage
```

---

**Week 2: 內容功能**

實現：

- MDX 文章渲染
- 程式碼語法高亮（支援多種語言）
- 自動生成目錄
- 標籤分類系統
- 搜尋功能（客戶端）
- 文章排序（日期、標籤）

---

**Week 3: SEO 與分享**

實現：

- RSS Feed 生成
- Sitemap 更新
- Open Graph meta tags
- Twitter Card
- 社群分享按鈕
- 閱讀進度條

---

#### 價值

✅ **求職/接案**:

- 展示技術寫作能力
- 建立個人品牌
- SEO 帶來流量

✅ **技術展示**:

- MDX 處理
- SEO 優化
- 內容管理

✅ **投資回報**:

- 可持續產出內容
- 被動吸引潛在客戶
- 展示專業度

---

### 選項 2: Event-CMS API 整合 (2-3 週)

#### 目標

將 Event-CMS 從 Mock 數據升級為真實 API 整合

#### 規劃

**Week 1: 後端 API 完成**

整合 `apps/api-server`:

- Events CRUD endpoints
- 圖片上傳（Cloudflare R2）
- Sessions/Tickets 管理
- Forms API

**Week 2: 前端整合**

更新 Event-CMS:

- eventsService 實作真實 API 調用
- React Query 數據獲取
- 錯誤處理
- Loading states

**Week 3: 測試與優化**

- E2E 測試
- 性能優化
- 錯誤處理完善

---

### 選項 3: Real-time 協作編輯器 (3-4 週)

#### 目標

在 Event-CMS 添加多人即時協作編輯活動

#### 規劃

**Week 1: WebSocket 基礎**

創建 `libs/realtime/`:

```
libs/realtime/
├── client/
│   ├── websocket.client.ts
│   └── hooks/
│       ├── useWebSocket.ts
│       ├── usePresence.ts
│       └── useCollaboration.ts
├── server/
│   └── websocket.server.ts
└── types/
    └── events.ts
```

**Week 2-3: CRDT 實現**

- Yjs 整合
- Collaborative editing
- Conflict resolution
- Offline support

**Week 4: UI 實現**

- User presence indicators
- Real-time cursors
- Comment threads
- Version history

**技術**: WebSocket, Yjs, @tiptap/extension-collaboration

---

### 選項 4: Vue Animation Sandbox UI (2 週)

#### 目標

實現完整的動畫實驗 Sandbox

#### 規劃

**Week 1: Sandbox 介面**

```vue
views/Sandbox.vue ├── CSS Editor (Monaco Editor) ├── Parameter Controls
(duration, easing, etc.) ├── Live Preview Area └── Export Panel (JSON/CSS/Code)
```

**Week 2: 功能完善**

- 預設動畫庫
- 自定義動畫創建
- Keyframe 視覺化編輯器
- 實時預覽
- 導出為多種格式

**技術**: Monaco Editor, anime.js/GSAP integration

---

## 🎯 推薦執行順序

### 立即執行 (本週)

**Phase A: 文檔清理** (1 小時)

- 清理根目錄
- 重組 docs/
- 補充缺少的文檔

### 近期開發 (2-4 週)

**推薦: 選項 1 - Profile 部落格**

**理由**:

1. **最高投資回報率**

   - SEO 流量
   - 個人品牌
   - 被動行銷

2. **技術價值**

   - MDX 是熱門技術
   - SSG/SEO 優化經驗
   - 內容管理能力

3. **求職/接案幫助**

   - 展示技術寫作
   - 建立專業形象
   - 持續產出內容

4. **可行性高**
   - 技術難度適中
   - 2-3 週可完成 MVP
   - 可漸進式添加文章

---

### 替代方案

**如果想展示技術深度**: 選項 3 - Real-time 協作

- CRDT 是前沿技術
- 面試話題性強
- 可獨立成作品集項目

**如果想快速完成**: 選項 4 - Vue Sandbox

- 2 週可完成
- 視覺化強
- 展示動畫技術

---

## 📊 預期成果

### Phase A 完成後

**文檔結構**:

```
/
├── README.md                    # 唯一根目錄文檔
│
└── docs/
    ├── README.md                # 文檔導覽
    ├── CURRENT_STATUS.md        # 即時狀態
    ├── DEVELOPMENT_GUIDE.md     # 開發指南
    ├── PROJECT_SPECIFICATION.md # 專案規格
    ├── QUICK_REFERENCE.md       # 快速參考
    │
    ├── apps/                    # 7 個 apps 文檔
    │   ├── README.md
    │   ├── EVENT_CMS.md
    │   ├── EVENT_PORTAL.md
    │   ├── PROFILE.md
    │   ├── AUTH.md              # 新增
    │   ├── ENTERPRISE_ADMIN.md  # 新增
    │   ├── VUE_MOTION.md        # 新增
    │   └── API_SERVER.md        # 新增
    │
    ├── libs/                    # Libs 文檔（新建）
    │   ├── README.md
    │   ├── ENTERPRISE_DATA.md
    │   └── ANIMATION_DATA.md
    │
    └── archive/                 # 歷史文檔（整理）
        ├── 2025-10-20-CLEAN_CODE_REFACTOR.md
        ├── 2025-10-20-CLEAN_CODE_AUDIT.md
        ├── BACKEND_IMPLEMENTATION.md
        ├── backend/
        ├── BACKEND_NESTJS_PLAN.md
        ├── ... (其他歷史文檔)
```

**改善**:

- ✅ 根目錄清爽（只有 1 個 MD）
- ✅ docs/ 結構化（apps/, libs/, archive/）
- ✅ 所有 apps 都有文檔
- ✅ 新 libs 有文檔
- ✅ 歷史記錄歸檔

---

### Phase B 完成後（以 Profile 部落格為例）

**新功能**:

```
apps/profile/
└── src/features/blog/
    ├── components/      # 6+ 組件
    ├── pages/          # 2 頁面
    ├── data/posts/     # MDX 文章
    ├── utils/          # MDX 處理
    └── ...
```

**技術能力證明**:

- ✅ MDX 整合
- ✅ SSG/SEO 優化
- ✅ 內容管理系統
- ✅ 技術寫作能力

**商業價值**:

- ✅ SEO 流量增長
- ✅ 個人品牌建立
- ✅ 被動式行銷
- ✅ 展示持續學習

---

## 📋 詳細執行步驟

### Phase A: 文檔清理

#### Step A1: 刪除過時文檔

```bash
rm PROFILE_RESTRUCTURE_COMPLETE.md
rm MIGRATION.md
rm CLEAN_CODE_PROGRESS.md
rm CLEANUP_COMPLETE.md
```

#### Step A2: 移動到 Archive

```bash
mv REFACTOR_COMPLETE.md docs/archive/2025-10-20-CLEAN_CODE_REFACTOR.md
mv CLEAN_CODE_AUDIT.md docs/archive/2025-10-20-CLEAN_CODE_AUDIT.md
mv docs/BACKEND_IMPLEMENTATION.md docs/archive/
mv docs/backend docs/archive/backend
```

#### Step A3: 創建新文檔

```bash
# 創建 libs 目錄
mkdir -p docs/libs

# 創建文檔（使用 write 工具）
# - docs/apps/AUTH.md
# - docs/apps/ENTERPRISE_ADMIN.md
# - docs/apps/VUE_MOTION.md
# - docs/apps/API_SERVER.md
# - docs/libs/README.md
# - docs/libs/ENTERPRISE_DATA.md
# - docs/libs/ANIMATION_DATA.md
```

#### Step A4: 更新索引文檔

```bash
# 更新以下文檔：
# - docs/README.md
# - docs/apps/README.md
# - docs/CURRENT_STATUS.md
```

---

### Phase B: Profile 部落格開發

#### Step B1: 設置 MDX 支援 (Week 1, Day 1-2)

```bash
# 安裝依賴
pnpm add @mdx-js/mdx @mdx-js/react remark-gfm rehype-highlight rehype-slug rehype-autolink-headings gray-matter reading-time

# 配置 Vite
# 更新 vite.config.ts 添加 MDX plugin
```

#### Step B2: 創建 Blog Feature (Week 1, Day 3-5)

```typescript
// 創建所有必要組件
// 設置路由
// 實現文章列表頁
```

#### Step B3: 內容功能 (Week 2)

```typescript
// 語法高亮
// 目錄生成
// 標籤系統
// 搜尋功能
```

#### Step B4: SEO 優化 (Week 3)

```typescript
// RSS Feed
// Sitemap
// Meta tags
// Open Graph
```

---

## ✅ 完成標準

### Phase A

- [ ] 根目錄只有 1 個 MD (README.md)
- [ ] docs/apps/ 有所有 7 個 apps 文檔
- [ ] docs/libs/ 創建完成，有 3 個文檔
- [ ] docs/archive/ 整理完畢
- [ ] 所有索引文檔已更新

### Phase B (以 Profile 部落格為例)

- [ ] MDX 支援完整
- [ ] 至少 3 篇技術文章
- [ ] 語法高亮正常
- [ ] RSS Feed 運作
- [ ] SEO meta tags 完整
- [ ] 多語系支援
- [ ] 部署成功

---

## 🎯 建議

### 立即執行

**Phase A: 文檔清理** (1 小時)

- 重要性: ⭐⭐⭐⭐⭐
- 緊急性: ⭐⭐⭐⭐
- 難度: ⭐

**理由**: 專案剛完成大重構，趁記憶猶新整理文檔

---

### 接著執行

**Phase B, 選項 1: Profile 部落格** (2-3 週)

- 重要性: ⭐⭐⭐⭐⭐
- ROI: ⭐⭐⭐⭐⭐
- 難度: ⭐⭐⭐

**理由**:

1. Profile 即將部署，需要內容
2. SEO 是長期投資，越早越好
3. 技術寫作展示專業度
4. 可持續產出價值

---

## 📅 時間規劃

```
Week 1 (2025-10-21 ~ 10-27):
├── Day 1: Phase A 文檔清理
├── Day 2-3: Profile 部署到 Cloudflare
├── Day 4-5: 設置 MDX + 創建 Blog feature
└── Day 6-7: 實現文章列表和詳情頁

Week 2-3: 部落格功能完善
Week 4+: 持續產出技術文章
```

---

**準備開始了嗎？**
