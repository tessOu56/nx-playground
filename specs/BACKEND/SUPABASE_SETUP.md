# Supabase Setup & Deployment Guide

完整的 Supabase 設定與部署指引

---

## 📋 目錄

1. [環境設定](#環境設定)
2. [SQL Migrations](#sql-migrations)
3. [Edge Function 部署](#edge-function-部署)
4. [前端整合](#前端整合)
5. [驗證與測試](#驗證與測試)
6. [疑難排解](#疑難排解)

---

## 環境設定

### 1. Supabase Project

已建立專案：
- **URL**: `https://oofwkiczuzegoeqhpxlo.supabase.co`
- **Region**: (查看 Supabase Dashboard)
- **Pricing**: Free Tier

### 2. 環境變數

#### Profile App (`.env.local`)

```bash
# apps/profile/.env.local
VITE_SUPABASE_URL=https://oofwkiczuzegoeqhpxlo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Service Role Key (伺服器端專用)

**絕不能暴露在前端！**

```bash
# Edge Functions 自動從環境變數讀取
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

取得方式：
1. Supabase Dashboard → Settings → API
2. 複製 `service_role` key (secret)
3. 設定在 Edge Function 的環境變數

---

## SQL Migrations

### 執行 Schema

1. 開啟 Supabase Dashboard → SQL Editor
2. 複製 `libs/supabase-client/sql/001_initial_schema.sql` 的內容
3. 貼上並執行

### 驗證 Schema

```sql
-- 檢查表格是否建立
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- 應該看到：
-- posts
-- post_views
-- post_view_stats
```

### 驗證 RLS Policies

```sql
-- 檢查 RLS 是否啟用
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- 檢查 policies
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

### 驗證 Seed Data

```sql
-- 確認 posts 有資料
SELECT slug, title, published_at FROM posts ORDER BY published_at DESC;

-- 應該看到 7 篇 blog posts (2019-12 ~ 2025-12)
```

---

## Edge Function 部署

### 1. 安裝 Supabase CLI

```bash
npm install -g supabase
```

### 2. 登入 Supabase

```bash
supabase login
```

會開啟瀏覽器進行 OAuth 授權。

### 3. Link Project

```bash
cd /Users/tessou/projects/nx-playground
supabase link --project-ref oofwkiczuzegoeqhpxlo
```

### 4. 部署 Edge Function

```bash
# 部署 track-view function
supabase functions deploy track-view
```

### 5. 驗證部署

```bash
# 列出所有 functions
supabase functions list

# 測試 function
curl -X POST \
  https://oofwkiczuzegoeqhpxlo.supabase.co/functions/v1/track-view \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"postId":"2024-12"}'
```

預期回應：
```json
{
  "success": true,
  "counted": true,
  "message": "View tracked successfully",
  "stats": {
    "post_id": "2024-12",
    "total_views": 1,
    "unique_ips": 1,
    "last_updated": "2025-10-27T..."
  }
}
```

---

## 前端整合

### 1. 安裝依賴

```bash
pnpm add @supabase/supabase-js --filter @nx-playground/profile
```

### 2. 設定環境變數

建立 `apps/profile/.env.local`：
```bash
VITE_SUPABASE_URL=https://oofwkiczuzegoeqhpxlo.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. 使用 Hook

```typescript
import { usePostViews } from '@nx-playground/supabase-client';

function BlogPost({ slug }: { slug: string }) {
  const { stats, trackView } = usePostViews(slug);

  useEffect(() => {
    trackView(); // Track view on mount
  }, [trackView]);

  return (
    <div>
      <p>{stats?.totalViews || 0} views</p>
      <p>{stats?.uniqueIps || 0} visitors</p>
    </div>
  );
}
```

---

## 驗證與測試

### 1. RLS 測試（未授權寫入應失敗）

```sql
-- 在 Supabase SQL Editor 中執行（使用 anon 角色）
SET ROLE anon;

-- 嘗試直接寫入 post_views（應該失敗）
INSERT INTO post_views (post_id, ip_hash) 
VALUES ('2024-12', 'test-hash');

-- 預期錯誤：new row violates row-level security policy
```

### 2. Edge Function 測試（應成功）

```bash
# 使用 curl 測試
curl -X POST \
  https://oofwkiczuzegoeqhpxlo.supabase.co/functions/v1/track-view \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"postId":"2024-12"}'
```

### 3. 防灌水測試

```bash
# 連續呼叫 3 次，應該只有第一次 counted: true
curl ... (第 1 次: counted: true)
curl ... (第 2 次: counted: false, message: "already counted")
curl ... (第 3 次: counted: false)
```

### 4. 前端測試

```bash
# 啟動 Profile app
pnpm dev:profile

# 訪問任一 blog post
# http://localhost:3003/en/blogs/2024-12

# 觀察：
# 1. 頁面應顯示閱讀數與訪客數
# 2. Console 應無錯誤
# 3. 重新整理頁面，數字不應增加（1 小時內）
```

---

## 疑難排解

### 問題 1: RLS Policy 錯誤

**症狀**: `new row violates row-level security policy`

**解決方案**:
1. 確認 Edge Function 使用 `service_role` key
2. 檢查 policy 是否正確設定：
```sql
SELECT * FROM pg_policies WHERE tablename = 'post_views';
```

### 問題 2: Edge Function 404

**症狀**: `Function not found`

**解決方案**:
```bash
# 重新部署
supabase functions deploy track-view

# 檢查部署狀態
supabase functions list
```

### 問題 3: CORS 錯誤

**症狀**: `Access-Control-Allow-Origin` 錯誤

**解決方案**:
- Edge Function 已包含 CORS headers
- 檢查 function 的 `OPTIONS` handler
- 確認 `Access-Control-Allow-Origin: *` 設定正確

### 問題 4: 環境變數未載入

**症狀**: `Missing VITE_SUPABASE_URL`

**解決方案**:
```bash
# 確認 .env.local 存在
ls apps/profile/.env.local

# 重啟 dev server
pnpm dev:profile
```

### 問題 5: Stats 不更新

**症狀**: 新 view 被追蹤，但 stats 數字不變

**解決方案**:
```sql
-- 手動執行 stats 更新
SELECT update_post_view_stats('2024-12');

-- 檢查 stats 表
SELECT * FROM post_view_stats WHERE post_id = '2024-12';
```

---

## 監控與維護

### Dashboard 監控

Supabase Dashboard → Database → Tables:
- `post_views`: 原始記錄（會持續增長）
- `post_view_stats`: 彙總統計（定期更新）

### 定期清理（可選）

```sql
-- 刪除 30 天前的原始 views（保留 stats）
DELETE FROM post_views 
WHERE created_at < NOW() - INTERVAL '30 days';
```

### 成本監控

Supabase Dashboard → Usage:
- Database size
- Bandwidth
- Function invocations

免費方案限制：
- Database: 500MB
- Bandwidth: 2GB
- Functions: 500K invocations/month

---

## 下一步

- [ ] 加入 Auth（登入使用者追蹤）
- [ ] 建立 Realtime subscriptions（即時閱讀數）
- [ ] 加入 Comments 與 Likes 功能
- [ ] 建立趨勢圖（使用 libs/charts）

---

## 參考資料

- [Supabase Docs](https://supabase.com/docs)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [Nx Monorepo Project Status](../../specs/PROJECT_STATUS.md)

---

最後更新：2025-10-27

