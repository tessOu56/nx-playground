---
id: auth-client
name: 認證客戶端
version: 0.1.0
description: 認證工具與 context providers
techStack:
  - React 19
  - TypeScript
features:
  - Auth context
  - 受保護路由
  - Session 管理
  - Token 處理
status: production
category: utils
published: true
lastUpdated: '2025-01-24'
---

# Auth Client – 認證客戶端

(Authentication Utilities Library)

## 一、概念與定位 / Overview

這是一個**共享認證函式庫**，提供 React context、hooks 與工具，用於管理跨應用程式的使用者認證。

不同於分散的認證邏輯，此函式庫提供：

- 集中式認證狀態管理
- 受保護路由元件
- Token 儲存與更新邏輯
- 跨頁面重新載入的 session 持久化
- 認證資料的 TypeScript 支援

此函式庫為 monorepo 中的所有 React 應用程式提供**一致的認證模式**。

---

## 二、核心能力 / Core Capabilities

### 1. Auth Context Provider

- 全域認證狀態
- 使用者個人檔案資料管理
- 登入/登出狀態處理
- Token 儲存與擷取
- 認證狀態監聽器

**重點價值**：整個應用程式認證狀態的單一真實來源。

---

### 2. 受保護路由元件

- 基於認證狀態的路由守衛
- 基於角色的路由保護
- 自動重新導向至登入頁
- 權限檢查工具
- 認證檢查期間的載入狀態

**重點價值**：宣告式路由保護，防止未授權存取。

---

### 3. Token 管理

- 安全的 token 儲存（httpOnly cookies 或記憶體）
- 過期前自動 token 更新
- Token 驗證與解析
- 多分頁同步
- Token 過期時登出

**重點價值**：自動處理複雜的 token 生命週期，確保安全 sessions。

---

## 三、技術亮點 / Technical Highlights

| 面向              | 說明                                  |
| ----------------- | ------------------------------------- |
| **React Context** | 全域認證狀態的 Provider 模式          |
| **型別安全**      | 使用者資料與 tokens 的完整 TypeScript |
| **安全性**        | 具備自動更新的安全 token 儲存         |
| **整合**          | 適用於任何認證後端（Ory Kratos 等）   |

**結果**：減少實作時間的安全、可重用認證邏輯。

---

## 四、使用範圍 / Usage Scope

**應用程式**：

- Profile（使用者 session）
- Event-CMS（管理認證）
- Event-Portal（使用者註冊）
- 所有需要認證的應用程式

**常見模式**：

- 登入/登出流程
- 受保護的管理頁面
- 使用者個人檔案顯示
- 基於認證狀態的條件式 UI

---

## 五、整合方式 / API & Integration

**設定**：

```tsx
import { AuthProvider } from '@nx-playground/auth-client';

function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
```

**使用方式**：

```tsx
import { useAuth, ProtectedRoute } from '@nx-playground/auth-client';

function Profile() {
  const { user, logout } = useAuth();
  return <div>歡迎 {user?.name}</div>;
}

function AdminPage() {
  return (
    <ProtectedRoute requiredRole='admin'>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
```

---

## 六、品質標準 / Quality Standards

**安全性**：

- 安全 token 儲存最佳實踐
- CSRF 保護
- XSS 防護
- 定期安全稽核

**測試**：

- 所有工具的單元測試
- 認證流程的整合測試
- 安全滲透測試

---

## 七、授權 / License

MIT（開放使用與修改）

---

## 八、補充文件 / Additional Documentation

- `specs/libs/auth-client/en.md` - 英文規格說明
- `specs/libs/auth-client/zh-TW.md` - 繁中規格（本文件）
- `libs/auth-client/README.md` - 開發者文件
