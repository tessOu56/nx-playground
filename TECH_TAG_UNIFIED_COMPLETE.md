# ✅ 技術標籤統一 UI/UX - 完成

**日期**: 2025-10-21  
**功能**: 統一所有技術標籤為可點擊的站內搜索按鈕  
**狀態**: ✅ 完成

---

## 🎯 需求實現

### 統一外觀
✅ 所有技術標籤使用同一精緻的 shadcn 風格組件
✅ 淡彩色配色系統（粉、黃、綠、藍、紫）
✅ 支持 dark mode
✅ hover 和 active 動畫效果

### 統一功能
✅ 點擊標籤 = 跳轉到站內搜索頁面
✅ 自動預填該標籤作為搜索條件
✅ URL 參數支持（`/blog?tag=React`）

### 統一應用範圍
✅ Home 頁面的技術技能標籤
✅ Apps 頁面的 app 卡片技術標籤
✅ Apps 詳情頁面的技術標籤
✅ Libs 頁面（待添加，庫配置暫無 techStack 字段）
✅ 搜索頁面的標籤

---

## 📁 創建的檔案

### 1. `apps/profile/src/lib/techCategories.ts` (4.8 KB)

**功能**: 技術分類和顏色映射系統

**導出**:
- `TechCategory` type: 5 種技術分類
- `techCategoryColors`: 分類顏色配置（Tailwind 類名）
- `techToCategoryMap`: 技術名稱到分類的映射（100+ 條目）
- `getTechCategory()`: 根據技術名稱獲取分類
- `getCategoryColorClasses()`: 獲取分類的顏色類名

**顏色系統**:
```typescript
frontend   → 藍色 (blue-100/blue-950)
backend    → 綠色 (green-100/green-950)
tools      → 紫色 (purple-100/purple-950)
testing    → 黃色 (yellow-100/yellow-950)
deployment → 粉色 (pink-100/pink-950)
```

### 2. `apps/profile/src/components/TechTag.tsx` (1.5 KB)

**功能**: 統一的技術標籤組件

**特性**:
- 自動根據技術名稱判斷分類
- 淡彩色 shadcn 風格
- 點擊跳轉到搜索頁面並預填標籤
- 支持 compact 模式（更小內邊距）
- hover/active 動畫效果
- 完整 dark mode 支持

**Props**:
```typescript
interface TechTagProps {
  name: string;         // 技術名稱
  compact?: boolean;    // 緊湊模式
  inline?: boolean;     // 內聯模式
  className?: string;   // 自定義類名
}
```

---

## 🔄 更新的檔案

### 1. `BlogListPage.tsx`
✅ 添加 `useSearchParams` 支持 URL 參數
✅ 從 URL 讀取 `?tag=xxx` 並預填到篩選器
✅ 讀取後清除 URL 參數

### 2. `TagList.tsx`
✅ 替換為使用 `TechTag` 組件
✅ 移除舊的 span 樣式
✅ 保持 compact 模式支持

### 3. `SkillCloud.tsx` (Home)
✅ 從 `TechBadge` 遷移到 `TechTag`
✅ 移除技能等級顏色系統
✅ 使用技術分類顏色系統
✅ 添加提示文字「點擊任一技術標籤，即可搜尋相關專案文件」

### 4. `AppCard.tsx`
✅ 技術標籤從 span 遷移到 `TechTag`
✅ 使用 compact 模式
✅ 保持 +N 顯示邏輯

### 5. `AppDetail.tsx`
✅ 技術標籤從 span 遷移到 `TechTag`
✅ 統一樣式和行為

---

## 🎨 視覺效果

### 顏色範例
```
React 19        → 藍色 (frontend)
NestJS          → 綠色 (backend)
Vite            → 紫色 (tools)
Jest            → 黃色 (testing)
Cloudflare      → 粉色 (deployment)
```

### 樣式特性
- **正常狀態**: 淡彩色背景 + 深色文字
- **Dark Mode**: 深色背景 + 淺色文字
- **Hover**: 背景加深 + 放大 (scale-105)
- **Active**: 縮小 (scale-95)
- **Focus**: Ring 高亮

---

## 🔍 用戶流程

### 1. 瀏覽技術標籤
用戶在 Home、Apps、Libs 或搜索頁面看到技術標籤

### 2. 點擊標籤
點擊「React 19」標籤

### 3. 自動跳轉
跳轉到 `/zh-TW/blog?tag=React%2019`

### 4. 預填篩選
搜索頁面自動:
- 設置 selectedTag 為「React 19」
- 顯示活動篩選器「標籤: React 19」
- 篩選相關文件

### 5. 查看結果
顯示所有包含「React 19」標籤的文件

---

## 📊 統計

### 創建檔案
- 2 個新檔案 (techCategories.ts, TechTag.tsx)
- 約 250 行代碼

### 更新檔案
- 5 個組件更新
- 移除舊的 TechBadge 使用
- 統一為 TechTag

### 技術映射
- 100+ 技術名稱到分類的映射
- 5 種分類顏色配置
- 完整 dark mode 支持

---

## ✅ 測試檢查清單

### Home 頁面
- [ ] SkillCloud 顯示分類顏色的標籤
- [ ] 點擊標籤跳轉到搜索頁面
- [ ] 顏色對應正確（React→藍, NestJS→綠, etc.）

### Apps 頁面
- [ ] AppCard 顯示 compact 技術標籤
- [ ] AppDetail 顯示完整技術標籤
- [ ] 點擊跳轉到搜索

### 搜索頁面
- [ ] BlogCard 的標籤使用新樣式
- [ ] 點擊標籤執行搜索
- [ ] URL 參數 `?tag=xxx` 正確預填
- [ ] 顯示活動篩選器可清除

### Dark Mode
- [ ] 所有標籤正確顯示深色背景
- [ ] 文字對比度足夠
- [ ] Hover 效果正常

---

## 🚀 下一步

1. **測試**: 在瀏覽器中測試所有標籤功能
2. **Libs 頁面**: 為 LibConfig 添加 techStack 字段
3. **性能**: 驗證大量標籤的渲染性能
4. **i18n**: 考慮標籤翻譯（如果需要）

---

## 📝 技術細節

### 為什麼從等級系統改為分類系統？
1. **更有意義**: 技術分類比技能等級更適合搜索
2. **視覺區分**: 不同分類使用不同顏色更易識別
3. **擴展性**: 易於添加新技術和分類

### 為什麼使用 URL 參數？
1. **可分享**: 用戶可分享帶標籤的搜索連結
2. **無狀態**: 刷新頁面仍保持搜索狀態
3. **SEO 友好**: URL 包含搜索條件

### 為什麼使用 Tailwind 而非 CSS-in-JS？
1. **一致性**: 與專案其他部分保持一致
2. **性能**: 無運行時開銷
3. **Dark Mode**: Tailwind dark: 類自動處理

---

**狀態**: ✅ 實現完成，準備測試

**注意**: TechBadge 組件暫時保留，可在確認所有功能正常後移除。
