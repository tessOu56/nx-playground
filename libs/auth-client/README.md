---
id: auth-client
name: auth-client
version: 0.1.0
description: 這個 library 專門處理前端驗證頁面跳轉邏輯，提供全域 auth 狀態管理和 SSO 整合。
techStack: []
features: []
lastUpdated: '2025-10-21'
---
# @nx-playground/auth-client

這個 library 專門處理前端驗證頁面跳轉邏輯，提供全域 auth 狀態管理和 SSO 整合。

## 功能
- 全域 auth 狀態管理（AuthProvider）
- 自動跳轉未登入用戶到 SSO 站台
- 路由保護（ProtectedRoute）
- 用戶登入/登出/更新功能
- SSO 相關工具函數

## 自動跳轉邏輯
當用戶需要驗證但沒有登入資料時，會自動重定向到 SSO 站台（apps/auth 部署的站台），並將 `return_to` 參數設為原畫面的網址。

## 安裝與使用

### 1. 在 App 根層級設置 AuthProvider

```tsx
import { AuthProvider } from '@nx-playground/auth-client';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* 你的路由 */}
      </Router>
    </AuthProvider>
  );
}
```

### 2. 在需要保護的頁面使用 ProtectedRoute

```tsx
import { ProtectedRoute } from '@nx-playground/auth-client';

function Dashboard() {
  return (
    <ProtectedRoute ssoUrl="https://auth.nx-playground.local">
      <div>Protected Dashboard Content</div>
    </ProtectedRoute>
  );
}
```

### 3. 在組件中使用 useAuth

```tsx
import { useAuth } from '@nx-playground/auth-client';

function UserProfile() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 4. 手動跳轉到 SSO（可選）

```tsx
import { useAuthRedirect, redirectToSSO } from '@nx-playground/auth-client';

// 使用 hook
function CustomPage() {
  const isAuthenticated = ... // 你的驗證邏輯
  useAuthRedirect(isAuthenticated, 'https://auth.nx-playground.local');
  return <div>Content</div>;
}

// 或直接跳轉
function LoginButton() {
  const handleLogin = () => {
    redirectToSSO('https://auth.nx-playground.local', '/dashboard');
  };
  
  return <button onClick={handleLogin}>Login</button>;
}
```

### 5. 處理 SSO 回調

```tsx
import { getReturnToFromUrl, clearReturnToFromUrl } from '@nx-playground/auth-client';

function SSOCallback() {
  useEffect(() => {
    const returnTo = getReturnToFromUrl();
    if (returnTo) {
      clearReturnToFromUrl();
      window.location.href = returnTo;
    }
  }, []);
  
  return <div>Processing login...</div>;
}
```

## API 參考

### AuthProvider
- `initialUser?: User` - 初始用戶資料

### useAuth
- `user: User | null` - 當前用戶資料
- `isAuthenticated: boolean` - 是否已登入
- `login(user: User)` - 登入
- `logout()` - 登出
- `updateUser(user: Partial<User>)` - 更新用戶資料

### ProtectedRoute
- `children: ReactNode` - 要保護的內容
- `ssoUrl?: string` - SSO 站台網址（預設 'https://auth.nx-playground.local'）
- `fallback?: ReactNode` - 未登入時顯示的內容

### useAuthRedirect
- `isAuthenticated: boolean` - 是否已登入
- `ssoUrl?: string` - SSO 站台網址（預設 'https://auth.nx-playground.local'）

### 工具函數
- `redirectToSSO(ssoUrl?: string, returnTo?: string)` - 手動跳轉到 SSO
- `getReturnToFromUrl(): string | null` - 從 URL 取得 return_to 參數
- `clearReturnToFromUrl()` - 清除 URL 中的 return_to 參數 
