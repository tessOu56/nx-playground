# 🎨 技術標籤視覺效果指南

## 顏色系統範例

### Frontend (藍色系)

```
React 19        → bg-blue-100   text-blue-700   (淺藍背景 深藍文字)
Angular 20      → bg-blue-100   text-blue-700
Vue 3           → bg-blue-100   text-blue-700
Next.js 15      → bg-blue-100   text-blue-700
Tailwind CSS    → bg-blue-100   text-blue-700
```

### Backend (綠色系)

```
NestJS          → bg-green-100  text-green-700  (淺綠背景 深綠文字)
Prisma          → bg-green-100  text-green-700
PostgreSQL      → bg-green-100  text-green-700
Ory Kratos      → bg-green-100  text-green-700
REST API        → bg-green-100  text-green-700
```

### Tools (紫色系)

```
Vite            → bg-purple-100 text-purple-700 (淺紫背景 深紫文字)
Nx Monorepo     → bg-purple-100 text-purple-700
Webpack         → bg-purple-100 text-purple-700
OpenAPI         → bg-purple-100 text-purple-700
```

### Testing (黃色系)

```
Jest            → bg-yellow-100 text-yellow-700 (淺黃背景 深黃文字)
Vitest          → bg-yellow-100 text-yellow-700
Playwright      → bg-yellow-100 text-yellow-700
```

### Deployment (粉色系)

```
Cloudflare      → bg-pink-100   text-pink-700   (淺粉背景 深粉文字)
Docker          → bg-pink-100   text-pink-700
ArgoCD          → bg-pink-100   text-pink-700
```

---

## Dark Mode 顏色

### Frontend (深藍)

```
React 19        → bg-blue-950   text-blue-300   (深藍背景 淺藍文字)
```

### Backend (深綠)

```
NestJS          → bg-green-950  text-green-300  (深綠背景 淺綠文字)
```

### Tools (深紫)

```
Vite            → bg-purple-950 text-purple-300 (深紫背景 淺紫文字)
```

### Testing (深黃)

```
Jest            → bg-yellow-950 text-yellow-300 (深黃背景 淺黃文字)
```

### Deployment (深粉)

```
Cloudflare      → bg-pink-950   text-pink-300   (深粉背景 淺粉文字)
```

---

## 互動效果

### Normal (正常狀態)

```css
opacity: 100%
scale: 100%
border: 1px solid (category-200)
```

### Hover (滑鼠懸停)

```css
background: darker (category-200)
scale: 105%
shadow: sm
cursor: pointer
transition: all 200ms
```

### Active (點擊時)

```css
scale: 95%;
```

### Focus (鍵盤導航)

```css
outline: none
ring: 2px offset-2 (ring-opacity-50)
```

---

## 尺寸變化

### Normal Mode (預設)

```
padding: 0.75rem 0.875rem (py-1.5 px-3)
font-size: 0.875rem (text-sm)
font-weight: 500 (medium)
```

### Compact Mode (緊湊)

```
padding: 0.125rem 0.5rem (py-0.5 px-2)
font-size: 0.75rem (text-xs)
font-weight: 500 (medium)
```

---

## 使用場景

### 1. Home - SkillCloud

- **模式**: Normal
- **顯示**: 按分類分組
- **數量**: 全部技術 (30+)
- **互動**: 點擊跳轉搜索

### 2. Apps - AppCard

- **模式**: Compact
- **顯示**: 前 4 個 + "+N"
- **數量**: 最多 4 個可見
- **互動**: 點擊跳轉搜索

### 3. Apps - AppDetail

- **模式**: Normal
- **顯示**: 全部技術
- **數量**: 全部技術 (5-10)
- **互動**: 點擊跳轉搜索

### 4. Blog - BlogCard

- **模式**: Compact
- **顯示**: 文件標籤
- **數量**: 3-8 個
- **互動**: 點擊跳轉搜索

### 5. Blog - BlogPostPage

- **模式**: Normal
- **顯示**: 文件標籤
- **數量**: 3-8 個
- **互動**: 點擊跳轉搜索

---

## 對比效果

### 舊版 vs 新版

#### 舊版 (TechBadge)

```
基於技能等級:
- Expert     → 主色調 (hsl(var(--badge-expert)))
- Advanced   → 次要色 (bg-secondary)
- Intermediate → 灰色 (bg-muted)

問題:
❌ 技能等級對搜索無意義
❌ 顏色區分不明顯
❌ 沒有點擊功能
❌ 無法跳轉搜索
```

#### 新版 (TechTag)

```
基於技術分類:
- Frontend   → 藍色
- Backend    → 綠色
- Tools      → 紫色
- Testing    → 黃色
- Deployment → 粉色

優點:
✅ 分類清晰有意義
✅ 顏色視覺區分明顯
✅ 點擊跳轉搜索
✅ URL 參數支持
✅ 淡彩色 shadcn 風格
✅ 完整 dark mode
```

---

## 可訪問性

### 顏色對比度

所有顏色組合都符合 WCAG AA 標準:

- Light Mode: -100 背景 + -700 文字 (對比度 > 4.5:1)
- Dark Mode: -950 背景 + -300 文字 (對比度 > 4.5:1)

### 鍵盤導航

- ✅ 可通過 Tab 鍵導航
- ✅ Enter/Space 觸發點擊
- ✅ Focus ring 清晰可見

### 屏幕閱讀器

- ✅ 按鈕語義 (`<button>`)
- ✅ Title 屬性說明功能
- ✅ ARIA 標籤友好

---

## 測試場景

### 視覺測試

1. **Light Mode**: 所有顏色清晰可辨
2. **Dark Mode**: 所有顏色清晰可辨
3. **Hover**: 背景變深 + 放大效果
4. **Active**: 縮小效果
5. **Focus**: Ring 高亮

### 功能測試

1. **點擊 Home 標籤**: 跳轉到 `/blog?tag=React`
2. **點擊 Apps 標籤**: 跳轉到 `/blog?tag=Vite`
3. **點擊 Blog 標籤**: 跳轉到 `/blog?tag=TypeScript`
4. **URL 參數**: `/blog?tag=React` 自動預填篩選
5. **篩選結果**: 顯示包含該標籤的文件

### 響應式測試

1. **桌面 (1920px)**: 標籤正常顯示
2. **平板 (768px)**: 標籤正常換行
3. **手機 (375px)**: Compact 模式適應小屏

---

## 實現細節

### 自動分類邏輯

```typescript
const category = getTechCategory('React 19');
// → 'frontend'

const category = getTechCategory('NestJS');
// → 'backend'

const category = getTechCategory('未知技術');
// → 'frontend' (默認)
```

### 顏色類名生成

```typescript
const colors = getCategoryColorClasses('frontend');
// → {
//     bg: 'bg-blue-100 dark:bg-blue-950',
//     text: 'text-blue-700 dark:text-blue-300',
//     border: 'border-blue-200 dark:border-blue-800',
//     hover: 'hover:bg-blue-200 dark:hover:bg-blue-900'
//   }
```

### 點擊跳轉

```typescript
const handleClick = () => {
  navigate(`${getLocalizedPath('/blog')}?tag=${encodeURIComponent(name)}`);
};
```

---

## 完成狀態

✅ **創建**: techCategories.ts (分類系統)
✅ **創建**: TechTag.tsx (統一組件)
✅ **更新**: SkillCloud (Home)
✅ **更新**: AppCard (Apps)
✅ **更新**: AppDetail (Apps)
✅ **更新**: TagList (Blog)
✅ **更新**: BlogListPage (URL 參數)
✅ **測試**: Linter 無錯誤
✅ **提交**: Commit 19dd790

---

**立即體驗**: http://localhost:3003/zh-TW
