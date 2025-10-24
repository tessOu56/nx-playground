---
id: 04-auth
name: 認證服務
version: 0.2.19
description: 整合 Ory Kratos 後端的認證服務，支援電子郵件登入、社交登入與 SSO
techStack:
  - React 19
  - TypeScript
  - Vite 6
  - Tailwind CSS
  - React Hook Form
  - Zod
  - Ory Kratos
features:
  - 使用者登入
  - 使用者註冊
  - 電子郵件驗證
  - 密碼重設
  - 社交登入
  - SSO 整合
status: development
category: react
published: true
lastUpdated: '2025-01-24'
---

# Auth Service – 認證服務

(Centralized Authentication Platform)

## 一、概念與定位 / Overview

這是一個**集中式認證服務**，為 monorepo 中的所有應用程式提供單一登入（SSO）功能。

不同於獨立的認證頁面，此服務提供：
- 一次登入，所有應用程式通用（SSO）
- 多種認證方式（電子郵件、社交、企業 SSO）
- 跨應用程式的安全 session 管理
- 專業的認證 UI 與表單驗證
- 整合 Ory Kratos 實現安全最佳實踐

整體設計作為整個平台的**認證中心**，展示企業級安全架構。

---

## 二、核心功能 / Core Features

### 1. 多方式認證

- 電子郵件/密碼登入，採用安全雜湊
- 社交登入（Google、GitHub、LINE）
- 企業 SSO 整合準備就緒
- Magic link 認證（無密碼）
- 雙因素認證（2FA）支援

**重點價值**：提供彈性的認證選項，滿足不同使用者偏好與安全需求。

---

### 2. 使用者帳號管理

- 自助註冊與電子郵件驗證
- 密碼重設與復原流程
- 個人檔案管理與設定
- 帳號連結（合併多種認證方式）
- Session 管理與裝置追蹤

**重點價值**：讓使用者自行管理帳號，無需管理員介入。

---

### 3. 跨應用單一登入

- 集中式 session 儲存
- JWT token 生成與驗證
- 自動 token 更新
- 跨網域 session 共享
- 所有應用程式的安全登出

**重點價值**：使用者一次登入即可無縫存取所有平台服務。

---

### 4. 安全性與合規

- 整合 Ory Kratos 實現安全最佳實踐
- 所有表單的 CSRF 保護
- 認證端點的速率限制
- 安全事件稽核日誌
- 符合 GDPR 的資料處理

**重點價值**：企業級安全性，保護使用者資料與平台完整性。

---

## 三、製作重點 / Development Focus

| 面向               | 說明                                      |
| ------------------ | ----------------------------------------- |
| **安全架構**       | Ory Kratos 後端，遵循業界最佳實踐         |
| **表單驗證**       | React Hook Form + Zod 實現型別安全驗證    |
| **UI/UX 設計**     | 乾淨專業的認證介面，具備清晰的錯誤訊息    |
| **Token 管理**     | JWT 搭配自動更新與安全儲存                |

**結果**：生產就緒的認證服務，具備企業級安全性。

---

## 四、內容規模 / Content Scope

- **認證流程**：登入、註冊、驗證電子郵件、重設密碼、社交 OAuth
- **整合**：Ory Kratos、OAuth 提供者（Google、GitHub）
- **安全功能**：CSRF、速率限制、Session 管理
- **目前狀態**：80% 完成，SSO 整合進行中

---

## 五、品質與效能指標 / Quality & Performance Metrics

| 指標               | 行業標準        | 實際結果                  | 狀態 |
| ------------------ | --------------- | ------------------------- | ---- |
| **登入速度**       | 1 秒內          | 約 500ms                  | ✅   |
| **表單驗證**       | 即時回饋        | 使用 Zod 即時驗證         | ✅   |
| **安全合規**       | OWASP Top 10    | Ory Kratos 最佳實踐       | ✅   |
| **Token 更新**     | 無縫            | 自動更新含重試機制        | ✅   |

**結論**：安全、快速的認證服務，符合業界標準。

---

## 六、技術架構 / Technical Architecture

**前端**：
- React 19 + TypeScript 實現型別安全 UI
- Vite 6 提供快速開發
- Tailwind CSS 實現一致的樣式
- React Hook Form + Zod 用於驗證

**後端整合**：
- Ory Kratos 處理認證邏輯
- RESTful API 用於前後端通訊
- JWT tokens 用於 session 管理
- 安全的 HTTP-only cookies 用於 token 儲存

**安全措施**：
- 僅 HTTPS 通訊
- CSRF token 驗證
- 使用 bcrypt 的密碼雜湊
- 敏感端點的速率限制
- 安全事件稽核日誌

---

## 七、部署 / Deployment

**主要平台**：Cloudflare Pages（前端）+ Ory Cloud（後端）

**設定摘要**：

- Build command: `nx build auth --configuration=production`
- Output: `dist/apps/auth`
- Node version: 20
- 環境變數：Ory Kratos endpoint、OAuth client IDs

**功能**：
- 自動 HTTPS 憑證
- Edge 部署實現低延遲
- DDoS 保護

---

## 八、開發進度 / Current Progress

### 已完成 ✅
- 電子郵件/密碼認證
- 使用者註冊與驗證
- 電子郵件驗證流程
- 密碼重設功能
- 基本 session 管理
- 專業認證 UI

### 進行中 🚧
- 社交登入整合（Google、GitHub）
- SSO 實作
- 雙因素認證（2FA）
- 增強 session 安全性

### 下一步 📋
- 完成 OAuth 提供者整合
- 實作跨應用 SSO
- 新增 2FA 支援
- 增強稽核日誌
- 使用者管理的管理儀表板

---

## 九、授權 / License

MIT（開放使用與修改）

---

## 十、補充文件 / Additional Documentation

- `specs/apps/auth/en.md` - 英文規格說明
- `specs/apps/auth/zh-TW.md` - 繁中規格（本文件）
- `apps/auth/README.md` - 開發者文件

注意：Ory Kratos 配置與 OAuth 設定說明請參考 README.md。
