---
id: 04-hooks
name: Custom Hooks
version: 0.0.1
description: Collection of reusable React hooks for common patterns
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

## Overview / 概念與定位

This is a **collection of battle-tested React hooks** encapsulating common patterns and behaviors used across applications.

Unlike inline hook logic, this library offers:
- Pre-built, tested hooks for common use cases
- Consistent patterns across all applications
- TypeScript support with full type inference
- Performance-optimized implementations
- Zero dependencies beyond React

The library serves as a **utility toolkit** reducing code duplication and demonstrating hook design patterns.

---

## Core Capabilities / 核心能力

### 1. State Management Hooks

- `useLocalStorage` - Persist state to localStorage with sync
- `useSessionStorage` - Session-scoped state persistence
- `useDebounce` - Debounced value updates for search/input
- `useThrottle` - Throttled callbacks for scroll/resize
- `usePrevious` - Access previous render values

**Key Value**: Simplifies common state patterns with performance best practices built-in.

---

### 2. Async Operation Hooks

- `useAsync` - Async state management (loading, data, error)
- `useFetch` - Simplified data fetching with caching
- `useRetry` - Automatic retry logic with exponential backoff
- `usePolling` - Interval-based data polling
- `useWebSocket` - WebSocket connection management

**Key Value**: Handles complex async scenarios with clean, predictable APIs.

---

### 3. UI Interaction Hooks

- `useModal` - Modal open/close state management
- `useToggle` - Boolean state toggling
- `useClickOutside` - Detect clicks outside element
- `useKeyPress` - Keyboard event handling
- `useHover` - Hover state detection

**Key Value**: Encapsulates common UI patterns reducing boilerplate code.

---

## Technical Highlights / 技術亮點

| Aspect                  | Description                                               |
| ----------------------- | --------------------------------------------------------- |
| **Type Safety**         | Full TypeScript with generic support for flexibility      |
| **Performance**         | Memoization and cleanup to prevent memory leaks           |
| **React 19 Compatible** | Uses latest React features and best practices             |
| **Zero Dependencies**   | Only depends on React, no additional libraries            |

**Result**: Lightweight, type-safe hooks improving code quality and developer productivity.

---

## Usage Scope / 使用範圍

**Applications Using This Library**:
- Profile (search debounce, modals, localStorage)
- Event-CMS (async operations, form state)
- Event-Portal (data fetching, polling)
- All React apps benefit from shared patterns

**Common Use Cases**:
- Search input debouncing
- Modal dialog management
- Persistent user preferences
- Async data loading states
- Keyboard shortcuts

---

## API & Integration / 整合方式

**Example Usage**:
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

**Key Exports**:
- 15+ custom hooks
- TypeScript definitions
- Hook testing utilities

---

## Quality Standards / 品質標準

**Testing**:
- Unit tests for all hooks
- React Testing Library for hook testing
- Edge case coverage

**Documentation**:
- JSDoc comments with examples
- README with all hook APIs
- Usage guidelines and best practices

**Maintenance**:
- Follows React best practices
- Regular updates for React versions
- Backward compatibility maintained

---

## License / 授權

MIT (Open for use and modification)

---

## Additional Documentation / 補充文件

- `specs/libs/hooks/en.md` - English specification (this file)
- `specs/libs/hooks/zh-TW.md` - Traditional Chinese specification
- `libs/hooks/README.md` - Developer documentation

Note: Individual hook APIs and usage examples can be found in the README.md.
