# 頁碼系統與頁面流程

## 頁面流程概述

本應用使用統一的頁碼系統來標識各個頁面，形成完整的用戶體驗流程。

### 主要頁面流程

```
P01 (/) → P02 (/vendors/[vendorId]) → P03 (/events/[eventId]) → P04 (/events/[eventId]/checkout) → P05 (/orders/[orderId]) → P06 (/registrations/[registrationId]) → P08 (/orders/[orderId]/check-in) → P09 (/orders)
```

### 頁碼配置

| 頁碼 | 頁面名稱              | 路徑                              | 描述                           | 公開性 |
| ---- | --------------------- | --------------------------------- | ------------------------------ | ------ |
| P01  | Line Liff 登入        | `/`                               | LINE LIFF 環境登入頁面         | 公開   |
| P02  | 主辦方詳情            | `/vendors/[vendorId]`             | 查看主辦方的詳細介紹和活動列表 | 公開   |
| P03  | 活動詳情              | `/events/[eventId]`               | 活動詳細資訊頁面               | 公開   |
| P04  | 選票券/場次＋付款方式 | `/events/[eventId]/checkout`      | 選擇票券、場次和付款方式       | 公開   |
| P05  | 訂單頁                | `/orders/[orderId]`               | 訂單詳細資訊（僅付款人可見）   | 私有   |
| P06  | 報名表填寫            | `/registrations/[registrationId]` | 填寫報名資訊（選填）           | 公開   |
| P07  | NX Playground 流程資訊      | `/info`                           | NX Playground 平台使用說明           | 公開   |
| P08  | 報到 QR Code          | `/orders/[orderId]/check-in`      | 報到 QR Code 頁面              | 公開   |
| P09  | 用戶訂單              | `/orders`                         | 查看用戶的所有訂單             | 私有   |

### 頁面流程說明

1. **P01 - 登入頁面**: 用戶通過 LINE LIFF 登入系統
2. **P02 - 主辦方詳情**: 查看主辦方的詳細介紹和活動列表
3. **P03 - 活動詳情**: 查看特定活動的詳細資訊
4. **P04 - 結帳頁面**: 選擇票券數量、付款方式並完成報名
5. **P05 - 訂單確認**: 查看訂單詳情和付款狀態
6. **P06 - 報名表填寫**: 填寫活動報名相關資訊
7. **P07 - 平台資訊**: 了解 NX Playground 平台使用方式
8. **P08 - 報到頁面**: 顯示報到 QR Code 和相關資訊
9. **P09 - 用戶訂單**: 查看用戶的所有訂單和狀態

## 技術實現

### 組件架構

- 使用 Next.js 15 App Router
- TypeScript 支援
- Tailwind CSS 樣式
- 響應式設計

### 狀態管理

- 使用 Zustand 管理訂單和認證狀態
- 使用 React Query 管理服務器狀態
- Next.js 路由導航

### 組件組織

- **共用組件**: 放在 `components/` 目錄
- **路由專用組件**: 放在對應路由目錄下
