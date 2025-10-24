# Spec 維護分析與改進方案

**Created**: 2025-10-24  
**Purpose**: 分析當前 spec 維護問題，提出改進方案

---

## 當前 Spec 結構

### 目錄組織

```
specs/
├── apps/
│   ├── profile/en.md
│   ├── event-cms/en.md
│   └── ...
├── libs/
│   ├── ui-components/en.md
│   └── ...
├── blogs/
│   ├── 2024-architecture-patterns.md
│   └── ...
└── STANDARDS/
    ├── PRD_SPEC.md
    ├── README_SPEC.md
    └── WORKFLOW.md
```

### 資料流向

```
specs/ (來源)
    ↓
Profile App (讀取 & 顯示)
    ↓
specLoader.ts / blogLoader.ts
    ↓
Projects/Blogs 頁面
```

---

## 問題分析

### 1. Spec 內容品質問題

**當前狀況**:
- ✅ 有完整的 PRD 規範（`specs/STANDARDS/PRD_SPEC.md`）
- ⚠️ 實際 spec 內容不完整（如 `specs/apps/profile/en.md` 只有 TODO）
- ⚠️ Blog spec 完整，但 app/lib spec 大多是 placeholder

**影響**:
- Profile Projects 頁面顯示的資料不完整
- shortDesc, purpose, highlights 等欄位為空或 TODO
- 使用者體驗不佳

---

### 2. Spec 更新流程問題

**當前流程**:
```
1. 開發功能
2. (可能) 更新 README
3. (經常忘記) 更新 Spec
4. (沒有) 同步到 Profile 顯示
```

**理想流程**:
```
1. 規劃功能 → 寫 Spec
2. 開發功能
3. 更新 README
4. Sync Spec (lastSync 更新)
5. Profile 自動同步顯示
```

---

### 3. 多語言維護問題

**當前狀況**:
- Apps/Libs: 只有 `en.md`（缺少 `zh-TW.md`）
- Blogs: 單一檔案（混合語言？）

**問題**:
- 切換語系時無法顯示對應內容
- 多語言維護困難

---

### 4. Spec 與 README 的關係混亂

**當前問題**:
- README（技術文檔）vs Spec（產品文檔）定位不清
- 資料重複（version, techStack 等）
- 同步困難

**理想關係**:
- **README**: 開發者導向（如何使用、API、架構）
- **Spec**: 使用者導向（為什麼存在、解決什麼問題）
- **Profile 顯示**: 合併兩者（`mergeProjectData`）

---

## 改進方案

### 方案 A: Spec-First 開發流程 ⭐⭐⭐⭐⭐

**概念**: Spec 作為單一事實來源

**實作**:
1. 創建 `specs/apps/{app-name}/en.md` 和 `zh-TW.md`
2. Front matter 包含所有 Profile 需要的欄位
3. README 專注於技術細節
4. Profile 優先讀取 Spec，README 作為補充

**優點**:
- 清晰的文檔分工
- 維護簡單
- 多語言完整

**缺點**:
- 需要補完所有 spec
- 初期工作量大

**工作量**: 5-7 天（補完所有 spec）

---

### 方案 B: 自動化 Spec 生成 ⭐⭐⭐⭐

**概念**: 從程式碼自動提取資訊生成 Spec

**實作**:
1. 建立 spec generator 腳本
2. 從 `package.json`, `README.md`, 原始碼提取資訊
3. 自動生成 spec front matter
4. 人工補充 purpose, highlights 等欄位

**範例**:
```bash
pnpm nx run profile:generate-spec
# 自動生成 specs/apps/profile/en.md (基礎部分)
# 開發者補充商業價值欄位
```

**優點**:
- 減少手動維護
- 保持同步
- 降低錯誤

**缺點**:
- 需要開發腳本
- 仍需人工補充部分內容

**工作量**: 3-5 天（開發腳本 + 模板）

---

### 方案 C: Spec 驗證與 CI 檢查 ⭐⭐⭐

**概念**: 確保 spec 品質

**實作**:
1. Spec validator 腳本
2. 檢查必填欄位
3. 檢查 front matter 格式
4. 多語言一致性檢查
5. CI 自動執行

**範例**:
```bash
pnpm nx run workspace:validate-specs
# 檢查所有 spec 是否符合規範
# 列出缺少的欄位
# 檢查 en/zh-TW 是否都存在
```

**優點**:
- 保證品質
- 防止錯誤
- 自動化檢查

**工作量**: 2-3 天

---

### 方案 D: Spec 編輯 UI（進階） ⭐⭐

**概念**: 視覺化 spec 編輯器

**實作**:
1. 建立 Spec Editor 頁面（可整合到 Profile 或獨立）
2. Form-based 編輯
3. 即時預覽
4. 儲存到 specs/ 目錄

**優點**:
- 非技術人員也能編輯
- 即時預覽效果
- 降低錯誤

**缺點**:
- 開發成本高
- 需要 file system API

**工作量**: 7-10 天

---

## Blog Spec 維護分析

### 當前狀況

**檔案位置**: `specs/blogs/2024-architecture-patterns.md`

**Front matter 欄位**:
```yaml
id, slug, title, year, publishDate, 
excerpt, techStack, tags, coverImage
```

**問題**:
1. ✅ Front matter 完整
2. ✅ 內容豐富
3. ⚠️ 缺少 `zh-TW` 版本
4. ⚠️ 沒有 `lastUpdated`, `reviewer` 等治理欄位

### Blog 多語言策略

**選項 1**: 單檔案雙語言
```markdown
---
id: 2024-arch
title:
  en: "Architecture Patterns"
  zh-TW: "架構模式"
---

# Architecture Patterns

[EN content...]

---

# 架構模式

[ZH-TW content...]
```

**選項 2**: 分開檔案（推薦）
```
specs/blogs/
├── 2024-architecture-patterns.en.md
└── 2024-architecture-patterns.zh-TW.md
```

**選項 3**: 子目錄
```
specs/blogs/2024-architecture-patterns/
├── en.md
└── zh-TW.md
```

---

## 對 Profile App 的影響

### 當前影響

**Projects 頁面**:
- 顯示的資料來自 `mergeProjectData(readme, spec)`
- 如果 spec 不完整 → 卡片資訊不完整
- shortDesc, purpose 等欄位為空

**Blogs 頁面**:
- 顯示的資料來自 blog spec front matter
- 目前完整，運作正常
- 但缺少 zh-TW 版本

**Detail 頁面**:
- Notion 風格重構後更依賴完整的 spec 資料
- 空白區塊影響視覺效果

---

## 建議的改進步驟

### 第一階段：補完 Spec（必要）

**工作項目**:
1. 補完所有 apps spec（7 個 apps）
   - 參考 `specs/STANDARDS/PRD_SPEC.md`
   - 填寫完整的 front matter
   - 補充內容區塊

2. 建立所有 libs spec（10+ libs）
   - 目前大多缺少
   - 影響 Profile Projects 頁面

3. Blog 多語言化
   - 選擇策略（推薦：分開檔案）
   - 建立 zh-TW 版本

**工作量**: 3-5 天

**優先級**: ⭐⭐⭐⭐⭐ (Critical for Profile)

---

### 第二階段：自動化工具（提升效率）

**工作項目**:
1. Spec generator 腳本
2. Spec validator
3. CI 整合

**工作量**: 3-5 天

**優先級**: ⭐⭐⭐ (Medium)

---

### 第三階段：進階功能（可選）

**工作項目**:
1. Spec 編輯 UI
2. 版本比較
3. 自動翻譯建議

**工作量**: 7-10 天

**優先級**: ⭐ (Low)

---

## 立即可做的改進

### Quick Win 1: 補完 Profile App Spec (1 小時)

更新 `specs/apps/profile/en.md`:

```yaml
---
id: profile
version: 1.0.0
category: react
status: production
published: true
shortDesc: |
  Full-Stack Developer Portfolio showcasing React expertise, 
  Nx monorepo architecture, and modern web development skills.
purpose: |
  Personal portfolio website to showcase technical projects, 
  share knowledge through blog posts, and demonstrate 
  full-stack development capabilities.
highlights:
  - Modern tech stack (React 19, Vite, TypeScript)
  - AI-powered project search
  - Multi-language support (en, zh-TW)
  - Notion-style design
  - PWA with offline support
  - Lighthouse optimized
useCases:
  - Job applications
  - Client presentations
  - Knowledge sharing
targetAudience: |
  Recruiters, potential clients, and fellow developers
  interested in modern web development practices.
---
```

**效益**: Profile Projects 頁面立即顯示完整資訊

---

### Quick Win 2: 建立 Spec Template (30 分鐘)

在 `specs/TEMPLATES/` 建立模板：
- `app-spec-template.md`
- `lib-spec-template.md`
- `blog-spec-template.md`

**效益**: 降低建立新 spec 的門檻

---

### Quick Win 3: Spec Checklist (15 分鐘)

建立 `specs/CHECKLIST.md`:
- 必填欄位清單
- 品質檢查項目
- 多語言確認

**效益**: 確保 spec 品質一致

---

## 決策建議

### 如果目標是快速改善 Profile 展示

**建議**: 
1. 立即補完 Profile 相關的 spec（apps + libs）
2. 更新 blog 的 zh-TW 版本
3. 暫緩自動化工具

**工作量**: 1-2 天
**效益**: Profile 立即可展示完整資訊

---

### 如果目標是長期維護性

**建議**:
1. 先建立 spec template 和 checklist
2. 逐步補完所有 spec
3. 開發 validator 和 generator
4. 整合到開發流程

**工作量**: 1-2 週
**效益**: 永續的維護機制

---

## 對 Profile 的直接影響

### Projects 頁面

**依賴的 Spec 欄位**:
- `shortDesc` → 卡片描述
- `category` → 分類
- `status` → 狀態標籤
- `techStack` → Tech badges

**缺少會導致**:
- 卡片顯示不完整
- 無法過濾
- 視覺效果差

---

### Detail 頁面（Notion 風格）

**依賴的 Spec 欄位**:
- `purpose` → Purpose 區塊
- `highlights` → Technical Highlights
- `useCases` → Use Cases
- `targetAudience` → Target Audience
- `stats` → Stats (for libs)

**缺少會導致**:
- 整個區塊不顯示
- 頁面空洞
- Notion 風格失效

---

### Blogs 頁面

**依賴的 Blog Spec 欄位**:
- `title`, `excerpt`, `year`, `publishDate`
- `techStack`, `tags`
- `coverImage`

**當前狀況**: ✅ 完整
**問題**: 缺少 zh-TW 版本

---

## 推薦的行動方案

### 立即行動（今天）

1. **補完 Profile App Spec** (1 小時)
   - 更新 `specs/apps/profile/en.md`
   - 補充所有必填欄位
   - 立即改善 Projects 頁面顯示

2. **補完核心 Libs Spec** (2-3 小時)
   - ui-components
   - design-system
   - i18n
   - search-engine
   - 這些會出現在 Profile Projects 頁面

3. **建立 Spec Template** (30 分鐘)
   - 降低未來建立 spec 的成本

---

### 短期行動（本週）

1. **補完所有 Apps Spec** (1-2 天)
2. **補完所有 Libs Spec** (1-2 天)
3. **Blog 多語言化** (1 天)

---

### 中期行動（下週）

1. **開發 Spec Validator** (2-3 天)
2. **開發 Spec Generator** (2-3 天)
3. **整合到 CI** (1 天)

---

## 結論

**關鍵問題**: Profile App 的展示品質**直接依賴** Spec 的完整性

**建議優先順序**:
1. ⚠️ **Critical**: 補完 Profile 相關 spec（今天完成）
2. ⭐ **High**: 補完所有 spec（本週完成）
3. 💡 **Medium**: 自動化工具（下週開始）

**最快見效**: 花 3-4 小時補完 Profile + 核心 libs 的 spec，Profile 頁面立即變完整！

---

## 下一步選擇

請選擇：

**A. 立即補完 Spec**（推薦）
- 3-4 小時手動補完
- Profile 立即改善

**B. 先建立工具再補完**
- 2-3 天開發工具
- 再用工具輔助補完

**C. 先研究，暫不動手**
- 繼續分析其他面向
- 等待更完整的計畫

告訴我你的選擇！

