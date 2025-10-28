# Cloudflare Pages Deployment Guide

## Apps Deployment Configuration

### 1. ✅ Profile (已部署)
- **Project Name**: `nx-playground-profile`
- **Build Command**: `pnpm nx build profile --configuration=production`
- **Build Output**: `dist/apps/profile`
- **Domain**: `profile.yourdomain.com`
- **Environment Variables**:
  ```
  VITE_ANALYTICS_PROVIDER=ga4
  VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
  VITE_SUPABASE_URL=https://your-project.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key
  ```

---

### 2. ⏳ Auth Service
- **Project Name**: `nx-playground-auth`
- **Build Command**: `pnpm nx build auth --configuration=production`
- **Build Output**: `dist/apps/auth`
- **Domain**: `auth.yourdomain.com`
- **Framework**: React 19 + Vite
- **Environment Variables**:
  ```
  VITE_API_URL=https://api.yourdomain.com
  VITE_TURNSTILE_SITE_KEY=your-turnstile-key
  ```

---

### 3. ⏳ Event CMS
- **Project Name**: `nx-playground-event-cms`
- **Build Command**: `pnpm nx build event-cms --configuration=production`
- **Build Output**: `dist/apps/event-cms`
- **Domain**: `cms.yourdomain.com`
- **Framework**: React 19 + Vite + TanStack Query
- **Environment Variables**:
  ```
  VITE_API_URL=https://api.yourdomain.com
  VITE_AUTH_URL=https://auth.yourdomain.com
  ```

---

### 4. ⏳ Event Portal (Next.js)
- **Project Name**: `nx-playground-event-portal`
- **Build Command**: `pnpm nx build event-portal --configuration=production`
- **Build Output**: `dist/apps/event-portal`
- **Domain**: `events.yourdomain.com`
- **Framework**: Next.js 15
- **Environment Variables**:
  ```
  NEXT_PUBLIC_API_URL=https://api.yourdomain.com
  NEXT_PUBLIC_LIFF_ID=your-liff-id
  LIFF_CHANNEL_SECRET=your-channel-secret
  ```
- **Note**: 需確認 Next.js output 是 `standalone` 或 `export` for static

---

### 5. ⏳ Enterprise Admin
- **Project Name**: `nx-playground-enterprise-admin`
- **Build Command**: `pnpm nx build enterprise-admin --configuration=production`
- **Build Output**: `dist/apps/enterprise-admin/browser`
- **Domain**: `admin.yourdomain.com`
- **Framework**: Angular 20
- **Environment Variables**:
  ```
  NG_API_URL=https://api.yourdomain.com
  ```
- **Note**: Angular output directory 通常是 `browser` subfolder

---

### 6. ⏳ Vue Motion
- **Project Name**: `nx-playground-vue-motion`
- **Build Command**: `pnpm nx build vue-motion --configuration=production`
- **Build Output**: `dist/apps/vue-motion`
- **Domain**: `motion.yourdomain.com`
- **Framework**: Vue 3 + Vite
- **Environment Variables**: (暫無)

---

## 快速部署步驟

### For Each App:

1. **Create New Project**
   - Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/pages)
   - Click "Create a project"
   - Select "Connect to Git"

2. **Connect Repository**
   - Choose `tessOu56/nx-playground`
   - Click "Begin setup"

3. **Configure Build**
   - Project name: `nx-playground-<app-name>`
   - Production branch: `main`
   - Framework preset: `None`
   - Build command: (see above for each app)
   - Build output directory: (see above for each app)
   - Root directory: `/` (leave empty for monorepo root)

4. **Environment Variables**
   - Click "Add variable"
   - Add all required variables from list above
   - Note: Cloudflare uses different prefixes (VITE_, NEXT_PUBLIC_, NG_)

5. **Deploy**
   - Click "Save and Deploy"
   - Wait for first build to complete
   - Configure custom domain if needed

---

## Build Verification (先測試)

在部署前，先確認每個 app 都能成功 build：

```bash
# Profile ✅ (已確認)
pnpm nx build profile --configuration=production

# Auth
pnpm nx build auth --configuration=production

# Event CMS
pnpm nx build event-cms --configuration=production

# Event Portal
pnpm nx build event-portal --configuration=production

# Enterprise Admin
pnpm nx build enterprise-admin --configuration=production

# Vue Motion
pnpm nx build vue-motion --configuration=production
```

---

## 部署順序建議

1. ✅ **Profile** (已完成)
2. 🎯 **Auth** (基礎服務，其他 apps 依賴)
3. 🎯 **Event CMS** (管理後台)
4. 🎯 **Event Portal** (前台)
5. 🎯 **Enterprise Admin** (獨立系統)
6. 🎯 **Vue Motion** (展示用，可最後)

---

## 常見問題

### Q: Next.js app 如何部署到 Cloudflare Pages?
A: 確認 `next.config.mjs` 有設定 `output: 'export'` for static export，或使用 Cloudflare Pages 的 Next.js 支援

### Q: Angular build 失敗？
A: 檢查 `angular.json` 的 output path，通常是 `dist/apps/<app-name>/browser`

### Q: 環境變數何時生效？
A: 部署時就會注入，需要重新部署才會更新

### Q: 如何設定自訂域名？
A: Cloudflare Pages > Project > Custom domains > Add domain

---

## 監控與管理

- **Dashboard**: https://dash.cloudflare.com/pages
- **Build Logs**: 每次 push 都會觸發 build，可在 dashboard 看 logs
- **Rollback**: 可以回滾到任何歷史部署版本
- **Preview**: 每個 PR 都會自動建立 preview deployment

---

## 成本預估

| 項目 | 成本 |
|------|------|
| 6 個 Pages Projects | **$0/月** 🎉 |
| Unlimited Requests | **$0/月** 🎉 |
| Unlimited Bandwidth | **$0/月** 🎉 |
| 500 Builds/月 | **$0/月** 🎉 |
| SSL Certificates | **$0/月** 🎉 |

**Total: $0/月** (除非需要超過 500 builds/月)

