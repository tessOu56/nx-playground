---
title: '@nx-playground/enterprise-data'
slug: 'enterprise-data'
category: 'libs'
tags: ['Angular', 'Data Layer', 'Architecture', 'TypeScript']
date: '2025-10-20'
excerpt: 'Angular 架構推演專案的資料處理函式庫'
author: 'NX Playground'
lang: 'zh-TW'
published: true
---

# @nx-playground/enterprise-data

> Angular 架構推演專案的資料處理函式庫

**最後更新**: 2025-10-20

---

## 🎯 專案定位

此函式庫為 **enterprise-admin** (Angular 架構推演專案) 提供所有資料處理邏輯。

### 設計理念

**完全的關注點分離**：

- **Lib (enterprise-data)**: 資料模型、服務、轉換、驗證邏輯
- **App (enterprise-admin)**: 僅負責 UI 呈現和路由

```
┌─────────────────────────┐
│  App: enterprise-admin  │
│  (UI Layer Only)        │
│  - Angular Components   │
│  - Routing              │
│  - Presentation Logic   │
└───────────┬─────────────┘
            │ imports
            ▼
┌─────────────────────────┐
│ Lib: enterprise-data    │
│ (Data Layer)            │
│  - Models               │
│  - Services             │
│  - Transformers         │
│  - Validators           │
└─────────────────────────┘
```

---

## 📂 資料夾結構

```
libs/enterprise-data/
├── src/
│   ├── lib/
│   │   ├── models/              # 資料模型定義
│   │   │   ├── user.model.ts
│   │   │   ├── approval.model.ts
│   │   │   └── index.ts
│   │   ├── services/            # 資料服務
│   │   │   ├── user-data.service.ts
│   │   │   ├── approval-data.service.ts
│   │   │   └── index.ts
│   │   ├── transformers/        # 資料轉換邏輯
│   │   │   ├── user.transformer.ts
│   │   │   └── index.ts
│   │   ├── validators/          # 驗證邏輯
│   │   │   ├── user.validator.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   └── index.ts
├── tsconfig.lib.json
├── project.json
├── README.md
└── package.json
```

---

## 💡 使用方式

### 在 Angular App 中使用

```typescript
import { UserDataService, UserValidator } from '@nx-playground/enterprise-data';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  constructor(private userDataService: UserDataService) {}

  async ngOnInit() {
    const users = await this.userDataService.getUsers();
    // ...
  }

  validateEmail(email: string): boolean {
    return UserValidator.validateEmail(email);
  }
}
```

---

## 📚 模組說明

### Models

定義資料結構：

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Approval {
  id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  approvedBy?: string;
}
```

### Services

處理資料操作：

```typescript
export class UserDataService {
  async getUsers(): Promise<User[]> {
    // API 調用或資料處理
  }

  async getUserById(id: string): Promise<User | null> {
    // 實現
  }
}
```

### Transformers

資料格式轉換：

```typescript
export class UserTransformer {
  static toDisplayFormat(user: any) {
    // 將 API 資料轉為 UI 顯示格式
  }

  static toApiFormat(user: any) {
    // 將 UI 資料轉為 API 格式
  }
}
```

### Validators

驗證邏輯：

```typescript
export class UserValidator {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateUsername(username: string): boolean {
    return username.length >= 3 && username.length <= 50;
  }
}
```

---

## 🎯 設計原則

### 1. 框架無關

此 lib 使用純 TypeScript，不依賴 Angular：

- ✅ 可被 Angular 使用
- ✅ 可被其他框架使用（如果需要）
- ✅ 單元測試簡單

### 2. 單一職責

每個模組只負責一件事：

- Models: 定義結構
- Services: 處理數據
- Transformers: 轉換格式
- Validators: 驗證邏輯

### 3. 易於測試

所有邏輯獨立於 UI：

- ✅ 單元測試容易
- ✅ 不需要 DOM
- ✅ 可 mock 依賴

---

## 🧪 開發

```bash
# Build
nx build enterprise-data

# Test
nx test enterprise-data

# Lint
nx lint enterprise-data

# Type check
nx typecheck enterprise-data
```

---

## 🔗 相關文檔

- [Enterprise Admin App](../apps/ENTERPRISE_ADMIN.md)
- [架構推演說明](../apps/ENTERPRISE_ADMIN.md#專案定位)

---

**狀態**: ✅ 結構完成，待實際數據填充
