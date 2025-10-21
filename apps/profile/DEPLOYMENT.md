# Cloudflare Pages Deployment Guide

本指南說明如何將 Profile App 部署到 Cloudflare Pages。

## 🚀 快速部署 (推薦)

### 方法 1: Git Integration (最推薦)

這是最簡單且最自動化的方式，每次推送到 Git 都會自動重新部署。

#### 步驟：

1. **推送代碼到 GitHub/GitLab**

   ```bash
   git add .
   git commit -m "Update profile app"
   git push origin main
   ```

2. **登入 Cloudflare Dashboard**

   - 前往 [Cloudflare Pages](https://dash.cloudflare.com/pages)
   - 點擊 "Create a project"

3. **連接 Git Repository**

   - 選擇你的 Git provider (GitHub/GitLab)
   - 授權 Cloudflare 訪問
   - 選擇 `nx-playground` repository

4. **配置構建設置**

   ```
   Project name: nx-playground-profile (或你想要的名稱)
   Production branch: main

   Build settings:
   - Framework preset: None (或選擇 Vite)
   - Build command: pnpm exec nx build @nx-playground/profile --configuration=production
   - Build output directory: dist/apps/profile
   - Root directory: / (保持在 monorepo 根目錄)

   Environment variables:
   - NODE_VERSION = 20
   ```

5. **開始部署**

   - 點擊 "Save and Deploy"
   - Cloudflare 會自動構建並部署你的應用

6. **獲取部署 URL**
   - 部署完成後，你會得到一個 URL，例如：
     - `https://nx-playground-profile.pages.dev`
   - 你可以設置自定義域名

### 方法 2: Direct Upload with Wrangler CLI

適合本地構建後手動部署，或用於 CI/CD 管道。

#### 步驟：

1. **安裝 Wrangler (如果還沒安裝)**

   ```bash
   npm install -g wrangler
   # 或
   pnpm add -g wrangler
   ```

2. **登入 Cloudflare**

   ```bash
   wrangler login
   ```

   這會打開瀏覽器讓你授權 Wrangler

3. **構建應用**

   ```bash
   # 在 monorepo 根目錄執行
   pnpm exec nx build @nx-playground/profile --configuration=production

   # 或使用部署腳本
   ./apps/profile/scripts/deploy-cloudflare.sh
   ```

4. **部署到 Cloudflare Pages**

   ```bash
   wrangler pages deploy dist/apps/profile --project-name=nx-playground-profile
   ```

   第一次部署時，Wrangler 會詢問：

   - 是否創建新專案？選擇 Yes
   - 專案名稱：輸入你想要的名稱（例如 `nx-playground-profile`）

5. **後續部署**

   ```bash
   # 構建
   pnpm exec nx build @nx-playground/profile --configuration=production

   # 部署
   wrangler pages deploy dist/apps/profile --project-name=nx-playground-profile
   ```

## 📦 Monorepo 特殊注意事項

### Nx 依賴管理

Profile app 依賴多個共享庫，Nx 會自動處理構建順序：

```
@nx-playground/profile 依賴於:
├── @nx-playground/ui-components
├── @nx-playground/design-system
├── @nx-playground/i18n
├── @nx-playground/hooks
├── @nx-playground/api-client
└── @nx-playground/auth-client
```

當你執行 `nx build @nx-playground/profile` 時，Nx 會：

1. 檢查所有依賴庫
2. 按正確順序構建它們
3. 最後構建 profile app

### 環境變數

由於我們的構建配置中有 `define: { 'process.env': process.env }`，需要注意：

**⚠️ 警告**: 這會將所有環境變數打包進 bundle，存在安全風險

**建議**:

- 僅使用 `VITE_` 開頭的環境變數
- 或修改 vite.config.ts 只定義需要的變數
- 不要在環境變數中放置機密資訊

## 🔧 Cloudflare Pages 專案設置

### 在 Cloudflare Dashboard 中設置

1. **Build & Deployment 設置**

   ```
   Production branch: main
   Preview branches: All non-production branches
   Build command: pnpm exec nx build @nx-playground/profile --configuration=production
   Build output directory: dist/apps/profile
   Root directory: /
   ```

2. **環境變數**

   - Go to Settings > Environment variables
   - 添加:
     - `NODE_VERSION`: `20` (或更高)
     - `PNPM_VERSION`: `9.0.0` (或你使用的版本)

3. **Build Configuration**
   - Node.js version: 20.x
   - Package manager: pnpm
   - Install command: `pnpm install --frozen-lockfile`

### Custom Domain (可選)

1. 前往專案的 "Custom domains"
2. 添加你的自定義域名
3. 更新 DNS 記錄（Cloudflare 會提供指示）

## 🔄 SPA 路由配置

Profile app 使用 React Router 進行客戶端路由。`public/_redirects` 檔案確保所有路由都正確處理：

```
/* /index.html 200
```

這告訴 Cloudflare Pages：

- 將所有請求重定向到 `index.html`
- React Router 會處理實際的路由

## 🧪 測試部署

### 本地預覽生產構建

```bash
# 構建
pnpm exec nx build @nx-playground/profile --configuration=production

# 預覽
cd dist/apps/profile
python3 -m http.server 3003
# 或
npx serve -p 3003

# 訪問 http://localhost:3003
```

測試所有路由：

- `/` - Home page
- `/apps` - Apps showcase
- `/apps/auth`, `/apps/event-cms`, etc. - App details
- `/libs` - Libraries showcase

測試多語系切換：

- 點擊導航欄的語言切換器
- 確認所有內容正確翻譯

## 📊 構建優化

當前構建配置包含多項優化：

### Code Splitting

- **vendor-react**: React, React DOM, React Router
- **vendor-radix**: Radix UI components
- **vendor-utils**: date-fns, lodash 等工具庫
- **vendor-other**: 其他第三方庫
- **ui-components**: @nx-playground/ui-components
- **design-system**: @nx-playground/design-system

### Bundle Sizes (參考)

```
Total: ~700 KB (gzip 後約 210 KB)
- vendor-react: ~305 KB (~96 KB gzipped)
- vendor-other: ~217 KB (~69 KB gzipped)
- ui-components/design-system: ~110 KB (~18 KB gzipped)
- app code: ~93 KB (~25 KB gzipped)
```

這些大小是合理的，因為包含了完整的 UI 組件庫和設計系統。

## 🔍 故障排除

### 構建失敗

如果 Cloudflare Pages 構建失敗：

1. **檢查 Node 版本**

   - 確保環境變數 `NODE_VERSION=20`

2. **檢查依賴安裝**

   - Cloudflare 應該使用 `pnpm install --frozen-lockfile`
   - 確認 `pnpm-lock.yaml` 已提交到 Git

3. **查看構建日誌**
   - 在 Cloudflare Pages dashboard 查看詳細日誌
   - 搜尋錯誤訊息

### 路由 404 錯誤

如果直接訪問 `/apps` 或 `/libs` 返回 404：

1. **檢查 \_redirects 檔案**

   - 確認 `public/_redirects` 包含 `/* /index.html 200`
   - 確認檔案在構建輸出中（`dist/apps/profile/_redirects`）

2. **檢查 Vite 配置**
   - 確認 `vite.config.ts` 沒有設置 `base` 路徑

### 多語系不工作

1. **檢查 i18n 初始化**

   - 確認 `main.tsx` 正確初始化所有 i18n 實例
   - 檢查瀏覽器控制台的錯誤訊息

2. **檢查翻譯檔案**
   - 確認所有 `.json` 翻譯檔案包含在構建中
   - 檢查 namespace 命名是否正確

## 📝 持續部署

### 自動部署 (Git Integration)

推送到 main 分支會自動觸發部署：

```bash
git add .
git commit -m "Update profile content"
git push origin main
```

Cloudflare 會：

1. 檢測到新的推送
2. 自動開始構建
3. 運行測試（如果配置）
4. 部署到生產環境

### Preview Deployments

每個 Pull Request 會自動獲得預覽 URL：

- 格式：`https://[commit-hash].nx-playground-profile.pages.dev`
- 適合在合併前測試變更

## 🎯 上線檢查清單

在首次部署前，確認以下事項：

- [ ] 更新 `src/data/profile.config.ts` 中的個人資訊
- [ ] 更新聯絡資訊（email, GitHub, LinkedIn）
- [ ] 檢查所有翻譯內容是否正確
- [ ] 確認所有 apps 的資訊是否最新
- [ ] 測試本地構建 (`pnpm exec nx build @nx-playground/profile --configuration=production`)
- [ ] 測試所有路由
- [ ] 測試多語系切換
- [ ] 檢查 console 沒有錯誤
- [ ] 測試在不同裝置和瀏覽器

## 🔗 有用的連結

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Wrangler Pages Docs](https://developers.cloudflare.com/workers/wrangler/commands/#pages)
- [Nx Build System](https://nx.dev/concepts/more-concepts/buildable-and-publishable-libraries)
- [Vite Build Optimization](https://vitejs.dev/guide/build.html)

## 💡 進階設置

### Analytics (可選)

在 Cloudflare Pages 中啟用 Web Analytics：

1. 前往 Project Settings
2. 啟用 Web Analytics
3. 無需修改代碼，Cloudflare 自動注入追蹤腳本

### Custom Headers (可選)

創建 `public/_headers` 檔案來設置自定義 HTTP headers：

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### Branch Previews

所有分支都會自動部署為預覽環境，URL 格式：

- Main branch: `https://nx-playground-profile.pages.dev`
- Feature branch: `https://[branch-name].nx-playground-profile.pages.dev`

---

**部署完成後記得更新 README.md 中的 Live Demo 連結！** 🎉
