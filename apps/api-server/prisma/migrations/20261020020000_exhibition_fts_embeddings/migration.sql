-- Phase 3 step 1: CJK-friendly FTS (bigram tokens + pg_trgm).
-- pgvector is intentionally not enabled; event_embeddings is the stub for later.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE OR REPLACE FUNCTION exhibition_search_tokens(input text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
PARALLEL SAFE
AS $$
DECLARE
  normalized text;
  tokens text := '';
  i integer;
  len integer;
  ch text;
  nxt text;
  latin text := '';
BEGIN
  IF input IS NULL OR btrim(input) = '' THEN
    RETURN '';
  END IF;

  normalized := lower(regexp_replace(input, '\s+', ' ', 'g'));
  len := char_length(normalized);

  FOR i IN 1..len LOOP
    ch := substr(normalized, i, 1);
    IF ch ~ '[0-9a-z]' THEN
      latin := latin || ch;
    ELSE
      IF latin <> '' THEN
        tokens := tokens || ' ' || latin;
        latin := '';
      END IF;
      IF ch ~ '[一-龥ぁ-んァ-ンー㐀-䶿]' THEN
        tokens := tokens || ' ' || ch;
        IF i < len THEN
          nxt := substr(normalized, i + 1, 1);
          IF nxt ~ '[一-龥ぁ-んァ-ンー㐀-䶿]' THEN
            tokens := tokens || ' ' || ch || nxt;
          END IF;
        END IF;
      END IF;
    END IF;
  END LOOP;

  IF latin <> '' THEN
    tokens := tokens || ' ' || latin;
  END IF;

  RETURN btrim(regexp_replace(tokens, '\s+', ' ', 'g'));
END;
$$;

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS search_document text
  GENERATED ALWAYS AS (
    exhibition_search_tokens(
      coalesce(title, '') || ' ' ||
      coalesce(location, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce("priceText", '') || ' ' ||
      coalesce(array_to_string(tags, ' '), '')
    )
  ) STORED;

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS search_tsv tsvector
  GENERATED ALWAYS AS (
    to_tsvector(
      'simple',
      exhibition_search_tokens(
        coalesce(title, '') || ' ' ||
        coalesce(location, '') || ' ' ||
        coalesce(description, '') || ' ' ||
        coalesce("priceText", '') || ' ' ||
        coalesce(array_to_string(tags, ' '), '')
      )
    )
  ) STORED;

CREATE INDEX IF NOT EXISTS events_search_tsv_idx
  ON events USING gin (search_tsv);

CREATE INDEX IF NOT EXISTS events_search_document_trgm_idx
  ON events USING gin (search_document gin_trgm_ops);

CREATE TABLE IF NOT EXISTS event_embeddings (
  event_id TEXT PRIMARY KEY REFERENCES events(id) ON DELETE CASCADE,
  model TEXT,
  dimensions INTEGER,
  content_hash TEXT,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE event_embeddings IS
  'Reserved for Phase 3 embeddings. Add CREATE EXTENSION vector and an embedding column later. No LLM writes in step 1.';
