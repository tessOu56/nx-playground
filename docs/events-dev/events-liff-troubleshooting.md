# LIFF 故障排除指南

## 問題：即使透過 LINE 打開連結，仍顯示「不在 LIFF 環境」

### 解決方案

#### 1. 檢查 LINE Developers Console 設置

**步驟 1: 登入 LINE Developers Console**

- 前往 https://developers.line.biz/
- 登入您的 LINE 帳號

**步驟 2: 選擇正確的 Provider**

- 確保選擇的是包含您的 LIFF 應用的 Provider

**步驟 3: 檢查 LIFF 應用設置**

- 點擊您的 LIFF 應用 (ID: `2007835339-AmngJedQ`)
- 檢查以下設置：

**Endpoint URL 設置**

```
✅ 正確設置: https://frontend.oosa.life
❌ 錯誤設置:
  - http://frontend.oosa.life
  - https://www.frontend.oosa.life
  - https://frontend.oosa.life/
  - https://frontend.oosa.life:3000
```

**Scope 設置**

```
✅ 必須包含:
  - profile
  - openid
  - email
```

**Bot Link Feature 設置**

```
✅ 確保啟用:
  - Bot Link Feature: ON
  - 允許外部瀏覽器: ON (如果需要)
```

#### 2. 檢查 LIFF ID 是否正確

**確認 LIFF ID**

- 在 LINE Developers Console 中複製完整的 LIFF ID
- 確保沒有多餘的空格或字符
- 當前使用的 ID: `2007835339-AmngJedQ`

#### 3. 測試步驟

**步驟 1: 在 LINE 中測試**

1. 在 LINE 聊天中發送連結: `https://frontend.oosa.life/test-liff`
2. 點擊連結，應該在 LINE 內建瀏覽器中打開
3. 查看調試信息

**步驟 2: 檢查控制台輸出**

- 如果顯示「在 LIFF 中：否」，表示設置有問題
- 如果顯示「在 LIFF 中：是」，表示設置正確

#### 4. 常見問題

**問題 1: 域名不匹配**

- 確保 Endpoint URL 與實際訪問的 URL 完全一致
- 檢查是否有 `www` 前綴的差異

**問題 2: HTTPS 證書問題**

- 確保 Cloudflare 的 SSL 證書正確配置
- 檢查是否有混合內容警告

**問題 3: Bot Link Feature 未啟用**

- 在 LINE Developers Console 中啟用 Bot Link Feature
- 這是讓 LIFF 在 LINE 中正常工作的必要設置

**問題 4: Scope 設置不完整**

- 確保包含所有必要的 scope
- 特別是 `openid` scope 對於獲取用戶 ID 很重要

#### 5. 驗證步驟

**完成設置後，請按以下順序測試：**

1. **更新 LINE Developers Console 設置**
2. **等待 5-10 分鐘讓設置生效**
3. **在 LINE 中重新訪問**: `https://frontend.oosa.life/test-liff`
4. **檢查是否顯示「在 LIFF 中：是」**

#### 6. 如果問題持續

如果按照上述步驟設置後仍然有問題，請：

1. **截圖 LINE Developers Console 的設置頁面**
2. **提供完整的調試日誌**
3. **確認是否在 LINE 內建瀏覽器中打開**

---

## 技術細節

### LIFF 環境檢測原理

`liff.isInClient()` 返回 `true` 的條件：

- 在 LINE 內建瀏覽器中打開
- Endpoint URL 設置正確
- Bot Link Feature 已啟用
- 域名匹配且 HTTPS 證書有效

### 調試信息說明

- **初始化成功**: LIFF SDK 已正確載入
- **在 LIFF 中**: 是否在 LINE 內建瀏覽器環境中
- **已登入**: 用戶是否已完成 LINE 登入
- **作業系統**: 檢測到的作業系統 (ios/android)
- **語言**: 用戶的語言設置
