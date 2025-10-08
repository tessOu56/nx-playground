# 現金付款流程實作

## 概述

這個實作提供了一個完整的付款流程，支援現金付款和 ATM 轉帳兩種方式：

- **現金付款**: 客戶選擇現金付款後，系統生成 QR Code，店員掃描確認
- **ATM 轉帳**: 客戶選擇 ATM 轉帳後，系統提供轉帳資訊，客戶在 24 小時內完成轉帳

## 開發環境配置

- **本地開發端口**: 3000 (`http://localhost:3000`)
- **生產環境域名**: `https://frontend.nx-playground.local`
- **LIFF ID**: `2007835339-AmngJedQ`

### 啟動開發服務器

```bash
# 方法 1: 使用啟動腳本 (推薦)
cd apps/events
./start-dev.sh

# 方法 2: 使用 pnpm
cd apps/events
pnpm dev

# 方法 3: 使用 Nx
pnpm nx serve @nx-playground/events
```

## 流程設計

### 客戶端流程

#### 現金付款流程

1. 客戶在結帳頁面選擇「現金付款」
2. 系統生成包含訂單資訊的 QR Code
3. 客戶到現場出示 QR Code 給店員
4. 店員掃描 QR Code 確認訂單
5. 客戶支付現金
6. 店員確認付款完成

#### ATM 轉帳流程

1. 客戶在結帳頁面選擇「ATM 轉帳」
2. 系統提供轉帳帳號和金額資訊
3. 客戶使用 ATM 或網路銀行進行轉帳
4. 客戶在 24 小時內完成轉帳
5. 系統自動確認付款狀態

### 店員端流程

1. 店員登入 LINE LIFF 應用程式
2. 掃描客戶出示的 QR Code
3. 系統驗證訂單資訊
4. 店員確認訂單詳情
5. 收取現金後點擊確認
6. 系統更新訂單狀態為已完成

## 檔案結構

```
apps/events/src/
├── types/
│   └── order.ts                    # 訂單相關類型定義
├── lib/
│   └── order-api.ts                # 訂單 API 函數
├── components/
│   ├── QRCodeGenerator.tsx         # QR Code 生成組件
│   └── QRCodeScanner.tsx           # QR Code 掃描組件
└── app/
    ├── checkout/
    │   └── page.tsx                # 結帳頁面
    ├── payment/
    │   ├── [orderId]/
    │   │   └── page.tsx            # 現金付款確認頁面
    │   └── atm/
    │       └── [orderId]/
    │           └── page.tsx        # ATM 轉帳付款頁面
    └── staff/
        └── page.tsx                # 店員掃描頁面
```

## 功能特色

### 客戶端功能

- ✅ 結帳頁面：選擇付款方式（現金/ATM）、填寫個人資訊
- ✅ 現金付款頁面：顯示 QR Code 和訂單詳情
- ✅ ATM 轉帳頁面：顯示轉帳資訊和操作指引
- ✅ QR Code 生成：包含訂單 ID、金額等資訊
- ✅ 轉帳資訊複製：一鍵複製帳號和金額
- ✅ 響應式設計：支援手機和桌面瀏覽

### 店員端功能

- ✅ LINE LIFF 整合：自動登入和身份驗證
- ✅ QR Code 掃描：手動輸入或掃描 QR Code
- ✅ 訂單驗證：檢查訂單狀態和付款方式
- ✅ 訂單確認：更新訂單狀態為已完成
- ✅ 操作說明：詳細的使用流程指引

### 技術特色

- ✅ TypeScript：完整的類型定義
- ✅ Next.js 15：現代化的 React 框架
- ✅ Tailwind CSS：響應式 UI 設計
- ✅ LIFF SDK：LINE 官方 SDK 整合
- ✅ 模組化設計：可重用的組件和函數

## 使用方式

### 1. 客戶端測試

#### 現金付款測試

1. 訪問 `http://localhost:3000`
2. 點擊「測試結帳」按鈕
3. 填寫個人資訊，選擇「現金付款」
4. 點擊「確認訂購」
5. 查看生成的 QR Code

#### ATM 轉帳測試

1. 訪問 `http://localhost:3000`
2. 點擊「測試結帳」按鈕
3. 填寫個人資訊，選擇「ATM 轉帳」
4. 點擊「確認訂購」
5. 查看轉帳資訊和操作指引

### 2. 店員端測試

1. 訪問 `http://localhost:3000/staff`
2. 登入 LINE 帳號
3. 使用測試數據或掃描 QR Code
4. 確認訂單詳情
5. 點擊「確認付款完成」

### 3. 真實 LIFF 環境測試

1. 通過 Cloudflare 訪問 `https://frontend.nx-playground.local`
2. 在 LINE 中打開 LIFF 應用程式
3. 測試完整的現金付款流程

### 3. 測試數據

```json
{
  "orderId": "test-order-123",
  "eventId": "test-event-456",
  "amount": 1500,
  "timestamp": 1703123456789,
  "signature": "test-signature"
}
```

## API 端點

### 獲取訂單詳情

```
GET /api/orders/{orderId}
```

### 確認訂單

```
POST /api/orders/{orderId}/confirm
```

## 安全性考量

1. **QR Code 簽名驗證**：防止 QR Code 被篡改
2. **店員身份驗證**：通過 LINE User ID 驗證店員身份
3. **訂單狀態檢查**：確保只有待付款訂單能被確認
4. **時間戳驗證**：防止重放攻擊

## 未來改進

1. **真實 QR Code 掃描**：整合相機掃描功能
2. **推送通知**：付款完成後發送通知給客戶
3. **收據生成**：自動生成電子收據
4. **多語言支援**：支援多種語言介面
5. **離線模式**：支援離線操作和同步

## 開發注意事項

1. 目前使用模擬數據，實際部署時需要連接真實 API
2. QR Code 簽名驗證需要實作真實的加密邏輯
3. 建議加入更多的錯誤處理和用戶提示
4. 可以考慮加入訂單歷史記錄功能
