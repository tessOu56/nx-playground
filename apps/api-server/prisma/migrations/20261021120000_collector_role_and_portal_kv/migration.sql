-- Shared TTL store for Vercel isolates (rate limits + LINE webhook replay).
CREATE TABLE IF NOT EXISTS "portal_kv" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    CONSTRAINT "portal_kv_pkey" PRIMARY KEY ("key")
);

CREATE INDEX IF NOT EXISTS "portal_kv_expires_at_idx" ON "portal_kv" ("expires_at");

-- Least-privilege collector login role. Password is set by the operator
-- (never committed). See docs/runbooks/line-bot.md.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'event_collector') THEN
    CREATE ROLE event_collector NOINHERIT LOGIN;
  END IF;
END
$$;

GRANT USAGE ON SCHEMA public TO event_collector;
GRANT SELECT, INSERT, UPDATE ON TABLE public.events TO event_collector;
GRANT SELECT, INSERT, UPDATE ON TABLE public.event_embeddings TO event_collector;

REVOKE ALL ON TABLE public.users FROM event_collector;
REVOKE ALL ON TABLE public.sessions FROM event_collector;
REVOKE ALL ON TABLE public.forms FROM event_collector;
REVOKE ALL ON TABLE public.portal_kv FROM event_collector;
