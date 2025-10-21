---
id: hooks
name: hooks
version: 0.0.1
description: 此函式庫已整合到 workspace，所有 React 專案可直接使用：
techStack: []
features: []
lastUpdated: '2025-10-21'
---
# @nx-playground/hooks

> React Hooks 集合，基於 usehooks-ts 並添加自定義 hooks

## 📦 在 Monorepo 中使用

此函式庫已整合到 workspace，所有 React 專案可直接使用：

```tsx
import {
  useDebounce,
  useLocalStorage,
  useThrottle,
} from '@nx-playground/hooks';
```

## 🚀 可用的 Hooks

### 自定義 Hooks

#### useDebounce

防抖 hook，延遲更新值直到停止變化

```tsx
import { useDebounce } from '@nx-playground/hooks';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500); // 500ms 延遲

  useEffect(() => {
    // 只在 debounced 值變化時執行搜索
    if (debouncedSearch) {
      performSearch(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <input
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
      placeholder='搜索...'
    />
  );
}
```

#### useThrottle

節流 hook，限制函數執行頻率

```tsx
import { useThrottle } from '@nx-playground/hooks';

function ScrollComponent() {
  const [scrollY, setScrollY] = useState(0);
  const throttledScrollY = useThrottle(scrollY, 200); // 200ms 間隔

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <div>Scroll position: {throttledScrollY}</div>;
}
```

#### useLocalStorage

本地存儲 hook，支援類型安全

```tsx
import { useLocalStorage } from '@nx-playground/hooks';

function SettingsComponent() {
  const [settings, setSettings, removeSettings] = useLocalStorage(
    'app-settings',
    {
      theme: 'light',
      language: 'zh-TW',
    }
  );

  return (
    <div>
      <button onClick={() => setSettings({ ...settings, theme: 'dark' })}>
        切換到深色模式
      </button>
      <button onClick={removeSettings}>重置設定</button>
    </div>
  );
}
```

#### useSessionStorage

會話存儲 hook，類似 useLocalStorage 但使用 sessionStorage

```tsx
import { useSessionStorage } from '@nx-playground/hooks';

function FormComponent() {
  const [formData, setFormData] = useSessionStorage('form-draft', {});

  // 表單數據會在瀏覽器標籤關閉時自動清除
}
```

### 從 usehooks-ts 重新導出

以下 hooks 直接從 usehooks-ts 導出，可直接使用：

#### 狀態管理

- `useBoolean` - 布爾值狀態管理
- `useCounter` - 計數器
- `useToggle` - 切換狀態
- `useMap` - Map 數據結構
- `useStep` - 步驟管理

#### DOM 和事件

- `useEventListener` - 事件監聽器
- `useClickAnyWhere` - 點擊任何地方
- `useOnClickOutside` - 點擊外部
- `useHover` - 懸停檢測
- `useScrollLock` - 鎖定滾動

#### 瀏覽器 API

- `useCopyToClipboard` - 複製到剪貼板
- `useMediaQuery` - 媒體查詢
- `useWindowSize` - 視窗大小
- `useScreen` - 螢幕信息
- `useReadLocalStorage` - 讀取本地存儲

#### 工具

- `useDebounceCallback` - 防抖回調
- `useDebounceValue` - 防抖值
- `useInterval` - 定時器
- `useTimeout` - 延遲執行
- `useCountdown` - 倒計時

#### 生命週期

- `useIsClient` - 檢測客戶端渲染
- `useIsMounted` - 檢測組件掛載
- `useUnmount` - 卸載時執行
- `useIsomorphicLayoutEffect` - 同構 layout effect

#### 其他

- `useDocumentTitle` - 設置文檔標題
- `useDarkMode` - 深色模式
- `useTernaryDarkMode` - 三態深色模式
- `useIntersectionObserver` - 交叉觀察
- `useResizeObserver` - 大小觀察
- `useScript` - 動態加載腳本

## 💡 使用範例

### 組合多個 Hooks

```tsx
import {
  useDebounce,
  useLocalStorage,
  useMediaQuery,
} from '@nx-playground/hooks';

function ResponsiveSearch() {
  const [search, setSearch] = useLocalStorage('search-history', '');
  const debouncedSearch = useDebounce(search, 300);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (debouncedSearch) {
      fetchResults(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <input
      type='text'
      value={search}
      onChange={e => setSearch(e.target.value)}
      placeholder={isMobile ? '搜索...' : '輸入關鍵字搜索...'}
    />
  );
}
```

### 性能優化

```tsx
import { useDebounce, useThrottle } from '@nx-playground/hooks';

function OptimizedComponent() {
  const [input, setInput] = useState('');
  const [scrollPos, setScrollPos] = useState(0);

  // 防抖：適合搜索、輸入驗證
  const debouncedInput = useDebounce(input, 500);

  // 節流：適合滾動、窗口大小調整
  const throttledScroll = useThrottle(scrollPos, 100);

  return <div>優化後的組件</div>;
}
```

## 🔧 開發

### 添加新的自定義 Hook

1. 在 `src/` 創建新文件 `useMyHook.ts`
2. 實現 hook 邏輯
3. 在 `src/index.ts` 中導出
4. 添加文檔到此 README

### 構建

```bash
# 在 Monorepo 根目錄
nx build hooks
```

## 📚 完整文檔

查看 [usehooks-ts documentation](https://usehooks-ts.com/) 獲取所有 hooks 的詳細說明。

## 🔗 相關連結

- [usehooks-ts](https://usehooks-ts.com/)
- [React Hooks Documentation](https://react.dev/reference/react)
