---
id: 04-hooks
name: 自訂 Hooks
version: 0.0.1
description: 可重用的 React hooks 集合，適用於常見模式
techStack:
  - React 19
  - TypeScript
features:
  - useDebounce
  - useLocalStorage
  - useAsync
  - useModal
  - usePagination
status: production
category: utils
published: true
lastUpdated: '2025-01-24'
---

# Custom Hooks – 自訂 Hooks

(Reusable React Hook Library)

## 一、概念與定位 / Overview

這是一個**經過實戰驗證的 React hooks 集合**，封裝跨應用程式使用的常見模式與行為。

不同於行內的 hook 邏輯，此函式庫提供：
- 針對常見使用案例的預建、測試過的 hooks
- 所有應用程式的一致模式
- 完整型別推斷的 TypeScript 支援
- 效能最佳化的實作
- 除了 React 外無相依性

此函式庫作為**工具套件**，減少程式碼重複並展示 hook 設計模式。

---

## 二、核心能力 / Core Capabilities

### 1. 狀態管理 Hooks

- `useLocalStorage` - 將狀態持久化至 localStorage 並同步
- `useSessionStorage` - Session 範圍的狀態持久化
- `useDebounce` - 為搜尋/輸入延遲更新值
- `useThrottle` - 為捲動/縮放節流回呼
- `usePrevious` - 存取前一次渲染的值

**重點價值**：簡化常見狀態模式，內建效能最佳實踐。

---

### 2. 非同步操作 Hooks

- `useAsync` - 非同步狀態管理（loading、data、error）
- `useFetch` - 簡化的資料取得，具備快取
- `useRetry` - 指數退避的自動重試邏輯
- `usePolling` - 基於間隔的資料輪詢
- `useWebSocket` - WebSocket 連線管理

**重點價值**：以乾淨、可預測的 APIs 處理複雜的非同步情境。

---

### 3. UI 互動 Hooks

- `useModal` - Modal 開啟/關閉狀態管理
- `useToggle` - 布林狀態切換
- `useClickOutside` - 偵測元素外的點擊
- `useKeyPress` - 鍵盤事件處理
- `useHover` - 懸停狀態偵測

**重點價值**：封裝常見 UI 模式，減少樣板程式碼。

---

## 三、技術亮點 / Technical Highlights

| 面向                | 說明                                  |
| ------------------- | ------------------------------------- |
| **型別安全**        | 完整 TypeScript 搭配泛型支援靈活性    |
| **效能**            | Memoization 與清理以防止記憶體洩漏    |
| **React 19 相容**   | 使用最新 React 功能與最佳實踐         |
| **零相依性**        | 僅相依 React，無額外函式庫            |

**結果**：輕量、型別安全的 hooks，提升程式碼品質與開發者生產力。

---

## 四、使用範圍 / Usage Scope

**使用此函式庫的應用程式**：
- Profile（搜尋 debounce、modals、localStorage）
- Event-CMS（非同步操作、表單狀態）
- Event-Portal（資料取得、輪詢）
- 所有 React 應用皆受益於共享模式

**常見使用案例**：
- 搜尋輸入 debouncing
- Modal 對話框管理
- 持久化使用者偏好
- 非同步資料載入狀態
- 鍵盤快捷鍵

---

## 五、整合方式 / API & Integration

**使用範例**：
```tsx
import { useDebounce, useLocalStorage, useAsync } from '@nx-playground/hooks';

function SearchComponent() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  
  const { data, loading, error } = useAsync(
    () => searchAPI(debouncedQuery),
    [debouncedQuery]
  );
  
  const [recentSearches, setRecentSearches] = useLocalStorage('searches', []);
  
  return (/* UI */);
}
```

**主要匯出**：
- 15+ 自訂 hooks
- TypeScript 定義
- Hook 測試工具

---

## 六、品質標準 / Quality Standards

**測試**：
- 所有 hooks 的單元測試
- 使用 React Testing Library 測試 hooks
- 邊緣情況涵蓋

**文件**：
- 含範例的 JSDoc 註解
- 包含所有 hook APIs 的 README
- 使用指南與最佳實踐

**維護**：
- 遵循 React 最佳實踐
- 定期更新以支援 React 版本
- 維持向後相容性

---

## 七、授權 / License

MIT（開放使用與修改）

---

## 八、補充文件 / Additional Documentation

- `specs/libs/hooks/en.md` - 英文規格說明
- `specs/libs/hooks/zh-TW.md` - 繁中規格（本文件）
- `libs/hooks/README.md` - 開發者文件

注意：個別 hook APIs 與使用範例請參考 README.md。
