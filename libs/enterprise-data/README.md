---
id: enterprise-data
name: Enterprise Data
version: 0.0.1
description: Data handling layer for Angular enterprise applications
techStack:
  - Angular 20
  - RxJS
  - TypeScript
features:
  - Data models
  - Service layer
  - Validators
  - Transformers
lastUpdated: '2025-10-21'
---
# @nx-playground/enterprise-data

> 企業應用資料處理函式庫

## 專案定位

此函式庫為 **enterprise-admin** (Angular 架構推演專案) 提供所有資料處理邏輯。

## 設計原則

**關注點分離**：

- **此 Lib**: 資料模型、服務、轉換、驗證邏輯
- **Angular App**: 僅負責 UI 呈現和路由

## 資料夾結構

```
src/lib/
├── models/         # 資料模型定義
├── services/       # 資料服務（API 調用等）
├── transformers/   # 資料轉換邏輯
└── validators/     # 驗證邏輯
```

## 使用方式

### 在 Angular App 中使用

```typescript
import { UserDataService, UserValidator } from '@nx-playground/enterprise-data';

@Injectable()
export class UserComponent {
  constructor(private userDataService: UserDataService) {}

  async loadUsers() {
    const users = await this.userDataService.getUsers();
    // ...
  }
}
```

## 開發

```bash
# Build
nx build enterprise-data

# Test
nx test enterprise-data

# Lint
nx lint enterprise-data
```
