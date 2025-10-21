---
title: 'Enterprise Admin - 企業級管理平台'
slug: 'enterprise-admin'
category: 'apps'
tags: ['Angular 20', 'Signal Store', 'RBAC', 'Dual-control', 'SSE']
date: '2025-10-20'
excerpt: 'Angular 20 架構推演專案'
author: 'NX Playground'
lang: 'zh-TW'
published: true
---

# Enterprise Admin - 企業級管理平台

> Angular 20 架構推演專案

**最後更新**: 2025-10-20

---

## 🎯 專案定位

**此為架構推演專案**，用於探索和驗證企業級 Angular 應用架構，**不是生產專案**。

### 核心目的

1. **驗證架構模式** - 測試企業級 Angular 應用的最佳實踐
2. **技術探索** - 實驗新的 Angular 特性（Signals, Signal Store）
3. **關注點分離** - 展示 App 與 Lib 的職責劃分

### 關注點分離架構

```
┌─────────────────────────┐
│  App: enterprise-admin  │
│  (UI Layer Only)        │
│  - Angular Components   │
│  - Routing              │
│  - Presentation Logic   │
│  - State Management     │
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
│  - Business Logic       │
└─────────────────────────┘
```

**原則**：

- ❌ App 不應包含資料處理邏輯
- ❌ App 不應包含 API 調用
- ❌ App 不應包含驗證邏輯
- ✅ App 只負責 UI 呈現和路由

---

## 🛠️ 技術棧

### 核心技術

- **Angular 20** - 最新 Angular 框架
- **TypeScript 5.9** - 類型安全
- **Signal Store** - 響應式狀態管理
- **Angular Material** - UI 組件庫

### 企業級功能

- **RBAC** - 角色權限管理
- **Dual-control** - 雙重審批機制
- **動態表單** - Schema-driven 表單
- **SSE 監控** - 即時事件串流
- **稽核軌跡** - 完整操作記錄

---

## 📂 專案結構

```
src/app/
├── core/                      # 核心模組（單例）
│   ├── services/              # UI services only
│   ├── guards/                # 路由守衛
│   └── interceptors/          # HTTP 攔截器
├── shared/                    # 共享模組
│   ├── components/            # 共享組件
│   ├── directives/
│   └── pipes/
└── features/                  # 功能模組
    ├── users/                 # 用戶管理
    │   ├── components/
    │   ├── users-routing.module.ts
    │   └── users.module.ts
    ├── approvals/             # 審批流程
    ├── dashboard/             # 儀表板
    └── settings/              # 系統設定
```

**注意**: 所有資料模型、API 調用、驗證邏輯應在 `libs/enterprise-data` 中。

---

## ✨ 核心功能展示

### 1. RBAC 權限控制

```typescript
// 路由守衛（UI layer）
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService) {} // 來自 lib

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRole = route.data['role'];
    return this.authService.hasRole(requiredRole); // lib 的邏輯
  }
}
```

### 2. Dual-control 審批

- 高風險操作需要兩人審批
- 審批流程追蹤
- 權限檢查

### 3. 動態表單系統

- Schema-driven 表單生成
- 交叉驗證
- 自動保存草稿

### 4. 即時事件監控

- SSE (Server-Sent Events)
- Ring Buffer 架構
- 大量事件處理

### 5. 完整稽核軌跡

- 記錄所有操作
- 多維度查詢
- 匯出報表

---

## 🎨 UI/UX

- 現代化介面設計
- Angular Material 組件
- 動畫效果
- WCAG 2.1 無障礙支援

---

## 🚀 開發

```bash
# 啟動開發服務器
pnpm dev:enterprise
# 或
nx serve enterprise-admin

# 訪問
http://localhost:4200
```

---

## 📦 構建

```bash
# Production build
nx build enterprise-admin --configuration=production
```

---

## 🧪 測試

```bash
# Unit tests
nx test enterprise-admin

# E2E tests (Playwright)
nx e2e enterprise-admin-e2e
```

---

## 📚 架構文檔

詳細架構說明請參考：

- [ARCHITECTURE.md](../../apps/enterprise-admin/ARCHITECTURE.md)
- [IMPLEMENTATION.md](../../apps/enterprise-admin/IMPLEMENTATION.md)

---

## 🔗 相關資源

- [Angular Style Guide](https://angular.io/guide/styleguide)
- [Angular Material](https://material.angular.io/)
- [NgRx](https://ngrx.io/)
- [Enterprise Data Lib](../libs/ENTERPRISE_DATA.md)

---

**狀態**: ✅ 架構完成，功能展示完整，libs/enterprise-data 已創建
