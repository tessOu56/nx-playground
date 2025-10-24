---
id: auth-client
name: Auth Client
version: 0.1.0
description: Authentication utilities and context providers
techStack:
  - React 19
  - TypeScript
features:
  - Auth context
  - Protected routes
  - Session management
  - Token handling
status: production
category: utils
published: true
lastUpdated: '2025-01-24'
---

# Auth Client – 認證客戶端

(Authentication Utilities Library)

## Overview / 概念與定位

This is a **shared authentication library** providing React context, hooks, and utilities for managing user authentication across applications.

Unlike scattered auth logic, this library offers:

- Centralized auth state management
- Protected route components
- Token storage and refresh logic
- Session persistence across page reloads
- TypeScript support for auth data

The library enables **consistent auth patterns** across all React applications in the monorepo.

---

## Core Capabilities / 核心能力

### 1. Auth Context Provider

- Global authentication state
- User profile data management
- Login/logout state handling
- Token storage and retrieval
- Auth status listeners

**Key Value**: Single source of truth for authentication state across the entire app.

---

### 2. Protected Route Components

- Route guards based on authentication status
- Role-based route protection
- Automatic redirects to login
- Permission checking utilities
- Loading states during auth checks

**Key Value**: Declarative route protection preventing unauthorized access.

---

### 3. Token Management

- Secure token storage (httpOnly cookies or memory)
- Automatic token refresh before expiration
- Token validation and parsing
- Multi-tab synchronization
- Logout on token expiry

**Key Value**: Handles complex token lifecycle automatically, ensuring secure sessions.

---

## Technical Highlights / 技術亮點

| Aspect            | Description                                    |
| ----------------- | ---------------------------------------------- |
| **React Context** | Provider pattern for global auth state         |
| **Type Safety**   | Full TypeScript for user data and tokens       |
| **Security**      | Secure token storage with automatic refresh    |
| **Integration**   | Works with any auth backend (Ory Kratos, etc.) |

**Result**: Secure, reusable auth logic reducing implementation time.

---

## Usage Scope / 使用範圍

**Applications**:

- Profile (user session)
- Event-CMS (admin auth)
- Event-Portal (user registration)
- All apps requiring authentication

**Common Patterns**:

- Login/logout flows
- Protected admin pages
- User profile display
- Conditional UI based on auth status

---

## API & Integration / 整合方式

**Setup**:

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

**Usage**:

```tsx
import { useAuth, ProtectedRoute } from '@nx-playground/auth-client';

function Profile() {
  const { user, logout } = useAuth();
  return <div>Welcome {user?.name}</div>;
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

## Quality Standards / 品質標準

**Security**:

- Secure token storage best practices
- CSRF protection
- XSS prevention
- Regular security audits

**Testing**:

- Unit tests for all utilities
- Integration tests with auth flows
- Security penetration testing

---

## License / 授權

MIT (Open for use and modification)

---

## Additional Documentation / 補充文件

- `specs/libs/auth-client/en.md` - English specification (this file)
- `specs/libs/auth-client/zh-TW.md` - Traditional Chinese specification
- `libs/auth-client/README.md` - Developer documentation
