import { createHash } from 'node:crypto';

import { MAX_EMBEDDING_INPUT_CHARS } from './config';
import type { ExhibitionEmbeddingText } from './types';

function clip(value: string, max = MAX_EMBEDDING_INPUT_CHARS): string {
  if (value.length <= max) return value;
  return value.slice(0, max);
}

export function exhibitionEmbeddingText(doc: ExhibitionEmbeddingText): string {
  const tags = (doc.tags ?? []).filter(Boolean).join(', ');
  const parts = [
    doc.title?.trim() ?? '',
    doc.location?.trim() ?? '',
    tags,
    doc.priceText?.trim() ?? '',
    doc.description?.trim() ?? '',
  ].filter(Boolean);
  return clip(parts.join('\n'));
}

export function exhibitionEmbeddingContentHash(
  doc: ExhibitionEmbeddingText
): string {
  if (doc.contentHash?.trim()) return doc.contentHash.trim();
  return createHash('sha256')
    .update(
      JSON.stringify({
        title: doc.title ?? '',
        description: doc.description ?? '',
        location: doc.location ?? '',
        tags: doc.tags ?? [],
        priceText: doc.priceText ?? '',
      })
    )
    .digest('hex');
}
