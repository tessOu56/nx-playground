# @nx-playground/hooks

這個庫提供了常用的 React hooks，基於 `usehooks-ts` 並添加了一些自定義的 hooks。

## 安裝

```bash
pnpm add @nx-playground/hooks
```

## 使用

```tsx
import { useLocalStorage, useDebounce, useThrottle } from '@nx-playground/hooks';

function MyComponent() {
  const [value, setValue, removeValue] = useLocalStorage('my-key', 'default');
  const debouncedValue = useDebounce(value, 500);
  const throttledValue = useThrottle(value, 1000);

  return (
    <div>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <p>Debounced: {debouncedValue}</p>
      <p>Throttled: {throttledValue}</p>
    </div>
  );
}
```

## 可用的 Hooks

### 從 usehooks-ts 重新導出

- `useLocalStorage` - 本地存儲 hook
- `useSessionStorage` - 會話存儲 hook
- `useDebounce` - 防抖 hook
- `useThrottle` - 節流 hook
- 以及其他 usehooks-ts 提供的 hooks

### 自定義 Hooks

- 目前提供了一些常用 hooks 的封裝版本
