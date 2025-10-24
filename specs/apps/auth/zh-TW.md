---
id: auth
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
  - User Login
  - User Registration
  - Email Verification
  - Password Recovery
  - Social Login
  - SSO Integration
lastUpdated: '2025-01-24'
category: react
status: development
published: true

shortDesc: |
  整合 SSO 的認證服務。
  為所有 monorepo 應用提供統一認證。

purpose: |
  統一認證解決方案，展示 SSO 架構、OAuth 整合與跨應用 session 管理。

highlights:
  - Single Sign-On（SSO）準備就緒
  - OAuth 2.0 整合
  - JWT token 管理
  - Session 持久化
  - 多應用認證中心
  - React 認證 UI

useCases:
  - 所有應用的統一認證
  - SSO 展示
  - OAuth 整合範例
  - Session 管理示範

targetAudience: |
  展示認證架構與安全實作技能。

reviewer: tessou
reviewedAt: '2025-10-24'
nextReview: '2025-11-24'
updateFrequency: per-feature
draftStatus: false
approvalStatus: approved

lastSync: '2025-10-24'
---

# Auth - 統一認證服務

為整個 monorepo 提供 SSO 認證中心，支援 OAuth 整合。

## 當前狀態
- 完成度：60%
- SSO：架構已設計
- 生產環境：尚未部署

## 功能
- 登入/註冊 UI
- 密碼復原
- OAuth providers
- JWT token 處理

## 路線圖
- 完成 SSO 實作
- 整合 api-server
- 新增更多 OAuth providers
- Session 管理介面

