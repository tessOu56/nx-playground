-- Phase 3 step 2: pgvector semantic embeddings for hybrid exhibition search.
-- Dimension is provider-defined (stored on model/dimensions). Catalog size does
-- not need an ANN index; pin dimensions and add HNSW when a provider is chosen.

CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE event_embeddings
  ADD COLUMN IF NOT EXISTS embedding vector;

COMMENT ON TABLE event_embeddings IS
  'Exhibition embeddings for hybrid FTS + cosine search. Leave embedding NULL when no provider is configured.';

COMMENT ON COLUMN event_embeddings.embedding IS
  'pgvector document embedding. Compare with cosine distance (<=>). Dimension follows the embedding provider.';
