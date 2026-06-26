# Vue 3 學習路徑（React 開發者版）

> **實作位置**：`apps/vue-motion` → 瀏覽器開啟 `/vue-basics`  
> **鏡像預覽**：sync 至 `vue-motion-sandbox` 後 `pnpm serve`

## 目標

在動畫沙盒之外，補齊 Vue 3 核心概念，讓你能：

- 讀懂 Composition API 程式碼
- 把 React hooks 心智模型對應到 Vue
- 用 Composables / Pinia 組織邏輯
- 再進入 GSAP、Three.js 等動畫實驗

## 建議順序（約 3–5 天，每天 30–60 分鐘）

| 天 | 主題 | 互動實驗室分頁 | 對照 React |
|----|------|----------------|------------|
| 1 | 心智模型 | React 對照 | hooks、JSX vs template |
| 2 | 響應式 | 響應式 | useState、useMemo、useEffect |
| 3 | 元件 | 元件通訊 | props callback、controlled input |
| 4 | 邏輯重用 | Composables | custom hooks |
| 5 | 全域狀態 | Pinia | Zustand / Context |
| 6 | 模板與生命週期 | 生命週期 | mount effect、條件/列表渲染 |

## 程式碼地圖

```
src/
├── views/learn/VueBasics.vue      # 學習入口（分頁切換）
├── components/learn/              # 各主題互動元件
├── composables/
│   ├── useCounter.js              # 計數器 composable
│   ├── useLocalStorage.js         # 練習題 1：localStorage 同步
│   └── useMousePosition.js        # 滑鼠追蹤 + 清理
└── stores/counter.js              # Pinia（含 lastActionAt，練習題 2）
```

## 練習題（已實作）

| # | 題目 | 實作位置 | 驗證方式 |
|---|------|----------|----------|
| 1 | `useLocalStorage` 同步 query | `composables/useLocalStorage.js` · Composables 分頁 · 元件通訊 SearchBox | 輸入後 F5，內容保留 |
| 2 | Pinia `lastActionAt` | `stores/counter.js` · Pinia 分頁 | 按 +1/−1 後看「最後操作」時間 |
| 3 | `RatingStars` v-model | `components/learn/RatingStars.vue` · 元件通訊分頁 | 點星評分，再點同一星清零 |
| 4 | Particles 生命週期清理 | `views/effects/Particles.vue` 底部筆記 + setup 註解 | 離開 /particles 後 DevTools Performance 無持續 rAF |

## 延伸資源

- [Vue.js 官方文檔](https://vuejs.org/guide/introduction.html)
- [Pinia 文檔](https://pinia.vuejs.org/)
- [VueUse](https://vueuse.org/) — 本專案動畫區已使用 `@vueuse/motion`

## 與生態其他專案的關係

| 專案 | 用途 |
|------|------|
| **vue-motion**（本 app） | Vue 學習 + 動畫實驗 SSOT |
| **vue-motion-sandbox** | 輕量 mirror，獨立 `pnpm serve` |
| **apps/profile** | React 動畫 promote（T-2026-010） |
| **develop-md** | 規格知識庫（DOM、Fetch 等底層補強） |

完成基礎實驗室後，建議依序練習：Motion → GSAP → Particles → Three.js。
