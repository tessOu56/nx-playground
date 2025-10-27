-- =====================================================
-- Supabase Schema: Blog Post Views & Analytics
-- =====================================================
-- 
-- 用途：追蹤 Blog 閱讀數、防灌水、展示趨勢
-- 
-- Tables:
--   - posts: Blog 文章基本資料（與現有 markdown 對應）
--   - post_views: 原始閱讀記錄（Edge Function 寫入）
--   - post_view_stats: 彙總統計（查詢優化）
-- 
-- Security:
--   - RLS 啟用，預設拒絕所有寫入
--   - post_views 只允許 service role 寫入（Edge Function）
--   - 所有人可讀統計資料
-- 
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Table: posts
-- =====================================================
-- 對應到 specs/blogs/*.md 的 metadata
-- 用於關聯 views，也可作為未來 CMS 的基礎

CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Blog slug (e.g., "2024-12", "2023-12")
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast slug lookup
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for posts
-- 所有人可讀已發布的文章
CREATE POLICY "Anyone can read published posts"
  ON posts FOR SELECT
  TO anon, authenticated
  USING (published_at IS NOT NULL AND published_at <= NOW());

-- 只有 service role 可寫入（未來可改為 authenticated users）
CREATE POLICY "Only service role can insert posts"
  ON posts FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Only service role can update posts"
  ON posts FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- Table: post_views
-- =====================================================
-- 原始閱讀記錄，由 Edge Function 寫入
-- 包含去重邏輯：IP hash + 時間窗口

CREATE TABLE IF NOT EXISTS post_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id TEXT NOT NULL, -- 直接使用 slug 作為 foreign key
  user_id UUID, -- 可選：如果使用者登入
  ip_hash TEXT NOT NULL, -- IP 的 SHA-256 hash (隱私保護)
  user_agent TEXT, -- 可選：用於去重與分析
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX idx_post_views_post_id ON post_views(post_id);
CREATE INDEX idx_post_views_created_at ON post_views(created_at DESC);
CREATE INDEX idx_post_views_ip_hash ON post_views(ip_hash);

-- Unique constraint: 同一 IP 在 1 小時內只能計數一次
-- (由 Edge Function 處理，這裡不做 DB constraint)

-- Enable RLS
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies for post_views
-- 只允許 service role 寫入（Edge Function）
CREATE POLICY "Only service role can insert views"
  ON post_views FOR INSERT
  TO service_role
  WITH CHECK (true);

-- 所有人可讀（但通常不直接查詢，而是查 stats）
CREATE POLICY "Anyone can read views"
  ON post_views FOR SELECT
  TO anon, authenticated
  USING (true);

-- =====================================================
-- Table: post_view_stats
-- =====================================================
-- 彙總統計表，用於快速查詢
-- 由 Trigger 或 Cron 定期更新

CREATE TABLE IF NOT EXISTS post_view_stats (
  post_id TEXT PRIMARY KEY, -- 直接使用 slug
  total_views INTEGER DEFAULT 0,
  unique_ips INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE post_view_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for post_view_stats
-- 所有人可讀統計
CREATE POLICY "Anyone can read view stats"
  ON post_view_stats FOR SELECT
  TO anon, authenticated
  USING (true);

-- 只有 service role 可更新
CREATE POLICY "Only service role can update stats"
  ON post_view_stats FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Only service role can modify stats"
  ON post_view_stats FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- Function: Update Stats
-- =====================================================
-- 更新 post_view_stats 的 helper function
-- 由 Edge Function 或 Trigger 呼叫

CREATE OR REPLACE FUNCTION update_post_view_stats(p_post_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO post_view_stats (post_id, total_views, unique_ips, last_updated)
  SELECT
    post_id,
    COUNT(*) as total_views,
    COUNT(DISTINCT ip_hash) as unique_ips,
    NOW() as last_updated
  FROM post_views
  WHERE post_id = p_post_id
  ON CONFLICT (post_id)
  DO UPDATE SET
    total_views = EXCLUDED.total_views,
    unique_ips = EXCLUDED.unique_ips,
    last_updated = EXCLUDED.last_updated;
END;
$$;

-- =====================================================
-- Seed Data (Optional)
-- =====================================================
-- 預填已有的 blog posts

INSERT INTO posts (slug, title, excerpt, published_at) VALUES
  ('2025-12', '2025 Annual Review', 'A comprehensive look at 2025', '2025-12-31 00:00:00+00'),
  ('2024-12', '2024 Architecture Patterns', 'Exploring modern architecture patterns', '2024-12-31 00:00:00+00'),
  ('2023-12', '2023 Full-Stack Excellence', 'Achieving full-stack mastery', '2023-12-31 00:00:00+00'),
  ('2022-12', '2022 Production Readiness', 'Building production-ready applications', '2022-12-31 00:00:00+00'),
  ('2021-12', '2021 Full-Stack Evolution', 'Evolving as a full-stack developer', '2021-12-31 00:00:00+00'),
  ('2020-12', '2020 React Journey', 'My journey with React in 2020', '2020-12-31 00:00:00+00'),
  ('2019-12', '2019 Tech Review', 'Starting the tech journey', '2019-12-31 00:00:00+00')
ON CONFLICT (slug) DO NOTHING;

-- Initialize stats for existing posts
INSERT INTO post_view_stats (post_id, total_views, unique_ips)
SELECT slug, 0, 0 FROM posts
ON CONFLICT (post_id) DO NOTHING;

