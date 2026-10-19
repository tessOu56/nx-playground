-- CJK-friendly catalog search for the LINE webhook (standard FTS does not tokenize CJK).
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS events_title_trgm_idx
  ON events USING gin (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS events_location_trgm_idx
  ON events USING gin (location gin_trgm_ops);

CREATE INDEX IF NOT EXISTS events_tags_trgm_idx
  ON events USING gin ((array_to_string(tags, ' ')) gin_trgm_ops);
