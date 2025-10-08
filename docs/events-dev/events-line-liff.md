# LINE LIFF 整合指南

## 概述

本專案整合 LINE LIFF (LINE Front-end Framework) 提供完整的 LINE 應用內體驗，包括用戶認證、訊息分享和社交功能。

## LIFF 環境設置

### 必要設置

1. **LIFF 應用設置**

   - LIFF ID: `2007835339-AmngJedQ`
   - Endpoint URL: `https://frontend.nx-playground.local`
   - Scope: `profile`, `openid`, `email`

2. **Bot Link Feature**

   - 必須啟用 Bot Link Feature
   - 建議啟用「允許外部瀏覽器」

3. **域名驗證**
   - 確保 `frontend.nx-playground.local` 已通過域名驗證
   - HTTPS 證書必須有效

### 設置檢查清單

- [ ] LIFF ID 正確複製
- [ ] Endpoint URL 設置正確 (無結尾斜線)
- [ ] Bot Link Feature 已啟用
- [ ] Scope 包含必要權限
- [ ] 域名已驗證
- [ ] HTTPS 證書有效

## 頁面結構

### 主要頁面

- `/` - 首頁 (包含 LIFF 狀態顯示)
- `/vendors/[vendorId]` - 廠商活動列表頁
- `/events/[eventId]` - 活動詳情頁
- `/info` - 完整調試中心

## 使用方法

### 在組件中使用 LIFF

```tsx
import { useLiff } from '../components/LiffProvider';

function MyComponent() {
  const {
    isInitialized,
    isInClient,
    isLoggedIn,
    userInfo,
    lineId,
    login,
    logout,
  } = useLiff();

  if (!isInitialized) {
    return <div>載入中...</div>;
  }

  if (!isInClient) {
    return <div>請在 LINE 應用中打開此頁面</div>;
  }

  if (!isLoggedIn) {
    return <button onClick={login}>登入 LINE</button>;
  }

  return (
    <div>
      <p>歡迎, {userInfo?.profile?.displayName}!</p>
      <p>LINE ID: {lineId}</p>
      <button onClick={logout}>登出</button>
    </div>
  );
}
```

### 調試和測試

1. **訪問調試頁面**: `https://frontend.nx-playground.local/debug`
2. **掃描 QR Code**: 在 LINE 應用中掃描頁面上的 QR Code
3. **查看調試信息**: 檢查 LIFF 狀態、環境信息、用戶資料
4. **測試功能**: 使用登入/登出按鈕測試認證流程

## 訊息分享功能

### 分享功能組件

- `src/lib/line-messaging.ts` - 訊息發送功能
- `src/app/events/[eventId]/page.tsx` - 活動詳情頁面
- `src/lib/share-utils.ts` - 分享功能工具函數
- `src/lib/line-config.ts` - LINE 配置管理

### 分享類型

1. **文字分享**: 分享活動基本資訊
2. **卡片分享**: 分享活動卡片到聊天
3. **輪播分享**: 分享活動輪播到官方帳號
4. **HTML 測試**: 發送 HTML 格式測試訊息

## 開發環境

### 本地開發

```bash
cd apps/events
pnpm dev
```

### 生產部署

- 部署到 Cloudflare Pages
- 自動 HTTPS 配置
- 客戶端重定向到生產域名

## 重定向設置

### 開發環境重定向

```typescript
useEffect(() => {
  // 檢查是否在 localhost:3000
  if (
    typeof window !== 'undefined' &&
    window.location.hostname === 'localhost' &&
    window.location.port === '3000'
  ) {
    const currentPath =
      window.location.pathname + window.location.search + window.location.hash;
    const newUrl = `https://frontend.nx-playground.local${currentPath}`;

    // 重定向到生產環境
    window.location.href = newUrl;
  }
}, []);
```

### 重定向規則

- `http://localhost:3000/debug` → `https://frontend.nx-playground.local/debug`
- `http://localhost:3000/vendors/1` → `https://frontend.nx-playground.local/vendors/1`
- `http://localhost:3000/events/1` → `https://frontend.nx-playground.local/events/1`

## 故障排除

### 常見問題

1. **LIFF 未初始化**: 檢查 LIFF ID 和域名設置
2. **權限不足**: 確認 Scope 設置包含必要權限
3. **HTTPS 問題**: 確保生產環境使用有效 SSL 證書
4. **Bot Link Feature**: 確認已在 LINE Developers Console 啟用

### 調試工具

- 使用 `/debug` 頁面檢查 LIFF 狀態
- 查看瀏覽器控制台錯誤訊息
- 檢查網路請求狀態
