# LINE 登入設置指南

## 概述

本專案現在支持兩種 LINE 登入方式：

1. **LIFF 環境**：在 LINE 應用內使用 LIFF SDK
2. **普通瀏覽器**：在普通瀏覽器中使用 LINE OAuth 2.0

## 實現方式說明

### 1. LIFF 環境（推薦）

- **使用官方 SDK**: `@line/liff`
- **適用場景**: LINE 應用內
- **優點**:
  - 官方支持，穩定可靠
  - 無需後端服務器
  - 自動處理用戶認證
- **實現**: 直接調用 `liff.login()` 和 `liff.getProfile()`

### 2. LINE Login 2.0（需要後端）

- **適用場景**: 普通瀏覽器
- **要求**: 需要後端服務器處理 OAuth token 交換
- **原因**:
  - OAuth 2.0 要求 client secret 保密
  - 前端無法安全地交換 authorization code
  - 需要後端服務器作為中介

### 3. 當前實現狀態

- **P01 頁面**: 僅支持 LIFF 環境的真實登入
- **其他頁面**: 使用 Mock 數據進行開發測試
- **普通瀏覽器**: 需要後端服務器支持才能獲取真實用戶信息

## 環境變數配置

創建 `.env.local` 文件並設置以下變數：

```bash
# LINE 登入配置
NEXT_PUBLIC_LIFF_ID=2007835339-AmngJedQ
NEXT_PUBLIC_LINE_REDIRECT_URI=https://frontend.nx-playground.local
NEXT_PUBLIC_LINE_CLIENT_ID=2007835339

# LINE OAuth 後端配置（重要！）
LINE_CLIENT_SECRET=your_actual_client_secret_here

# 開發環境配置
NODE_ENV=development
```

### 重要說明

1. **開發環境** (`NODE_ENV=development`)：

   - P01 頁面：支持真正的 LINE OAuth 流程（需要設置 LINE_CLIENT_SECRET）
   - 其他頁面：使用 Mock 數據進行測試
   - 會真正調用 LINE API（如果環境變數正確設置）

2. **生產環境** (`NODE_ENV=production`)：
   - 必須設置 `LINE_CLIENT_SECRET`
   - 實現真正的 OAuth 2.0 流程
   - 處理 token 交換和用戶信息獲取

## LINE 開發者控制台設置

### 1. LIFF 應用設置

- LIFF ID: `2007835339-AmngJedQ`
- Endpoint URL: `https://frontend.nx-playground.local`
- Scope: `profile`, `openid`, `email`

### 2. LINE Login 應用設置

- Channel ID: `2007835339`
- Callback URL: `https://frontend.nx-playground.local`
- Scope: `profile`, `openid`, `email`

## 功能特點

### 頁面邏輯

1. **P01 頁面** (`/` 或 `/home`)：

   - 使用真正的 LINE OAuth 流程
   - 獲取真實的用戶信息和 Token
   - 調用 LINE API 進行認證

2. **其他頁面**：
   - 使用 Mock 數據進行測試
   - 不會真正調用 LINE API
   - 適合開發和調試其他功能

### LIFF 環境

- 在 LINE 應用內直接登入
- 無需重定向
- 自動獲取用戶信息

### 普通瀏覽器環境

- 重定向到 LINE 登入頁面
- 支持 OAuth 2.0 流程
- 回調後自動處理用戶信息

## 使用方法

1. **自動檢測環境**：系統會自動檢測當前環境並選擇合適的登入方式
2. **統一登入接口**：無論在什麼環境，都使用相同的登入按鈕
3. **用戶信息顯示**：登入成功後會顯示完整的用戶信息和 Token

## 開發注意事項

- 在開發環境中，普通瀏覽器登入會返回模擬數據
- 生產環境需要配置真實的後端 API 來處理 OAuth 回調
- 確保所有環境變數都正確設置

## 故障排除

### 常見問題

1. **LIFF 初始化失敗**：檢查 LIFF ID 和域名設置
2. **OAuth 回調失敗**：檢查 Callback URL 和 Client ID
3. **用戶信息不顯示**：檢查 Scope 權限設置

### 調試方法

- 查看瀏覽器控制台的日誌信息
- 檢查 Network 標籤中的請求
- 驗證環境變數是否正確設置
