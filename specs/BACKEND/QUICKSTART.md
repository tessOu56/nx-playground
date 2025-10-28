# Supabase 快速上線指引 / Quick Start Guide

5 分鐘內完成 Supabase 整合測試

---

## ⚡ 快速步驟 (5 mins)

### 1️⃣ 執行 SQL Migrations (2 mins)

1. 開啟 [Supabase Dashboard](https://supabase.com/dashboard) → 你的專案
2. 左側選單 → **SQL Editor**
3. 點擊 **New query**
4. 複製貼上整個檔案: `libs/supabase-client/sql/001_initial_schema.sql`
5. 點擊 **Run** 或按 `Cmd/Ctrl + Enter`

✅ 應該看到: `Success. No rows returned`

**驗證**:
```sql
-- 在 SQL Editor 執行
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

應該看到: `posts`, `post_views`, `post_view_stats`

---

### 2️⃣ 安裝 Supabase CLI (1 min)

```bash
# macOS
brew install supabase/tap/supabase

# 或用 npm (跨平台)
npm install -g supabase

# 驗證安裝
supabase --version
```

---

### 3️⃣ 部署 Edge Function (2 mins)

```bash
cd /Users/tessou/projects/nx-playground

# 登入 Supabase
supabase login

# Link 專案
supabase link --project-ref oofwkiczuzegoeqhpxlo

# 部署 function
supabase functions deploy track-view
```

✅ 應該看到: `Deployed Function track-view successfully`

**驗證**:
```bash
# 測試 function
curl -X POST \
  https://oofwkiczuzegoeqhpxlo.supabase.co/functions/v1/track-view \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vZndraWN6dXplZ29lcWhweGxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NTQ5OTQsImV4cCI6MjA3NzEzMDk5NH0.AltwxnBl1gc7QEUsnvTeFnV3QKFLgfaa6jLPQaa8EqE" \
  -H "Content-Type: application/json" \
  -d '{"postId":"2024-12"}'
```

預期回應:
```json
{
  "success": true,
  "counted": true,
  "stats": {
    "post_id": "2024-12",
    "total_views": 1,
    "unique_ips": 1
  }
}
```

---

### 4️⃣ 測試 Profile App (立即)

Profile app 的環境變數已經設定好（`.env.local` 被 gitignore，所以你需要手動建立）

**建立環境檔案**:
```bash
# 在 apps/profile/ 建立 .env.local
cat > apps/profile/.env.local << 'EOF'
VITE_SUPABASE_URL=https://oofwkiczuzegoeqhpxlo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vZndraWN6dXplZ29lcWhweGxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NTQ5OTQsImV4cCI6MjA3NzEzMDk5NH0.AltwxnBl1gc7QEUsnvTeFnV3QKFLgfaa6jLPQaa8EqE
EOF
```

**啟動 Profile**:
```bash
pnpm dev:profile
```

**測試**:
1. 訪問 http://localhost:3003/en/blogs/2024-12
2. 應該在標題下方看到: `👁️ X views 👥 X visitors`
3. 重新整理頁面 3 次，數字應該 **不變**（1 小時內同 IP 只計數一次）
4. 用手機或無痕模式訪問，`visitors` 應增加

---

## 🧪 RLS 測試（驗證安全性）

### 測試 1: 未授權寫入應失敗

在 Supabase SQL Editor 執行:
```sql
-- 切換到 anon 角色（模擬前端）
SET ROLE anon;

-- 嘗試直接寫入 post_views
INSERT INTO post_views (post_id, ip_hash) 
VALUES ('2024-12', 'malicious-hash');

-- 應該看到錯誤：
-- new row violates row-level security policy for table "post_views"
```

✅ **如果失敗（出現錯誤）= RLS 正常工作**

### 測試 2: Edge Function 寫入應成功

用 curl 測試（見上方步驟 3）

✅ **如果 `counted: true` = Edge Function 有權限寫入**

---

## 🎯 快速檢查清單

- [ ] SQL migrations 執行完成（3 個表格建立）
- [ ] Edge Function 部署成功
- [ ] curl 測試回傳 `success: true`
- [ ] Profile app 顯示閱讀數
- [ ] 重新整理不會增加計數（1 小時內）
- [ ] RLS 阻擋直接寫入

**全部勾選 = 整合完成！🎉**

---

## 🚨 常見問題

### Q1: Edge Function 部署失敗

```bash
Error: Failed to deploy function track-view
```

**解決方案**:
1. 確認已執行 `supabase login`
2. 確認專案 ref 正確: `oofwkiczuzegoeqhpxlo`
3. 檢查 function 語法: `supabase functions serve track-view`（本地測試）

### Q2: Profile app 不顯示閱讀數

**檢查**:
1. `.env.local` 是否存在且正確
2. 重啟 dev server: `pkill -f vite && pnpm dev:profile`
3. 瀏覽器 Console 有無錯誤
4. 確認 Edge Function 已部署

**Debug**:
```bash
# 檢查環境變數
cat apps/profile/.env.local

# 確認 Supabase client 載入
# 在 Profile app 的 console:
import { validateEnvironment } from '@nx-playground/supabase-client';
validateEnvironment();
```

### Q3: RLS 測試沒有錯誤（應該要有）

**問題**: RLS 策略可能沒有正確建立

**解決方案**:
```sql
-- 檢查 RLS 是否啟用
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- 檢查 policies
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public';
```

如果沒有 policies，重新執行 `001_initial_schema.sql`。

---

## 📚 下一步

- **完整文件**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **架構設計**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **專案狀態**: [PROJECT_STATUS.md](../../specs/PROJECT_STATUS.md)

---

## 🆘 需要幫助？

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com/
- 專案 Issue Tracker: (your repo issues)

---

最後更新：2025-10-27

