import { diceCoefficient, exhibitionSearchTokens } from './tokenize';
import type {
  ExhibitionDocument,
  ExhibitionHit,
  ExhibitionSearchInput,
} from './types';

const TITLE_EXACT = 100;
const TITLE_PREFIX = 50;
const TITLE_CONTAINS = 32;
const LOCATION = 18;
const TAG = 16;
const CATEGORY = 12;
const DESCRIPTION = 6;
const TOKEN_BIGRAM = 8;
const TOKEN_UNIGRAM = 3;
const DICE_WEIGHT = 24;
const MIN_MATCH = 0.5;
/** Dice dust on long titles is not a match — require a real overlap or a strong typo score. */
const DICE_MATCH = 0.35;

function haystack(doc: ExhibitionDocument): string {
  return [
    doc.title,
    doc.location,
    doc.description,
    doc.category,
    doc.priceText,
    doc.tags.join(' '),
    doc.organizerName,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function scoreDocument(
  doc: ExhibitionDocument,
  keyword: string
): number {
  const q = keyword.normalize('NFKC').toLowerCase().trim();
  if (!q) return 0;

  const title = doc.title.toLowerCase();
  let score = 0;
  if (title === q) score += TITLE_EXACT;
  else if (title.startsWith(q)) score += TITLE_PREFIX;
  else if (title.includes(q)) score += TITLE_CONTAINS;

  if (doc.location?.toLowerCase().includes(q)) score += LOCATION;
  if (doc.category?.toLowerCase().includes(q)) score += CATEGORY;
  if (doc.description?.toLowerCase().includes(q)) score += DESCRIPTION;
  if (doc.tags.some(tag => tagMatchesQuery(tag, q))) {
    score += TAG;
  }

  const queryTokens = exhibitionSearchTokens(q);
  const docTokens = new Set(exhibitionSearchTokens(haystack(doc)));
  for (const token of queryTokens) {
    if (docTokens.has(token)) {
      score += token.length >= 2 ? TOKEN_BIGRAM : TOKEN_UNIGRAM;
    }
  }

  score += DICE_WEIGHT * diceCoefficient(q, title);
  return score;
}

function tagMatchesQuery(tag: string, q: string): boolean {
  const normalized = tag.toLowerCase();
  if (!normalized) return false;
  if (normalized === q || normalized.includes(q)) return true;
  return q.includes(normalized) && normalized.length >= 4;
}

function fieldIncludes(value: string | null | undefined, q: string): boolean {
  return !!value && value.toLowerCase().includes(q);
}

/** True when the keyword should keep the document — not dice-only noise. */
export function hasKeywordMatch(
  doc: ExhibitionDocument,
  keyword: string
): boolean {
  const q = keyword.normalize('NFKC').toLowerCase().trim();
  if (!q) return true;
  if (doc.title.toLowerCase().includes(q)) return true;
  if (fieldIncludes(doc.location, q)) return true;
  if (fieldIncludes(doc.category, q)) return true;
  if (fieldIncludes(doc.description, q)) return true;
  if (fieldIncludes(doc.organizerName, q)) return true;
  if (fieldIncludes(doc.venueHint, q)) return true;
  if (fieldIncludes(doc.priceText, q)) return true;
  if (doc.tags.some(tag => tagMatchesQuery(tag, q))) return true;

  const queryTokens = exhibitionSearchTokens(q).filter(
    token => token.length >= 2
  );
  if (queryTokens.length > 0) {
    const docTokens = new Set(exhibitionSearchTokens(haystack(doc)));
    if (queryTokens.some(token => docTokens.has(token))) return true;
  }

  return diceCoefficient(q, doc.title.toLowerCase()) >= DICE_MATCH;
}

function matchesCategory(doc: ExhibitionDocument, category: string): boolean {
  if (!category) return true;
  return doc.category === category || doc.tags.includes(category);
}

function matchesRegion(
  doc: ExhibitionDocument,
  region: ExhibitionSearchInput['region']
): boolean {
  if (!region) return true;
  return doc.region === region;
}

function matchesDate(
  doc: ExhibitionDocument,
  input: ExhibitionSearchInput
): boolean {
  const now = input.now ?? new Date();
  const mode = input.dateMode ?? (input.windows ? 'window' : 'all');
  if (mode === 'all') return true;
  if (mode === 'now') return doc.startDate <= now && doc.endDate >= now;
  if (mode === 'upcoming') return doc.startDate > now;
  if (mode === 'past') return doc.endDate < now;
  if (mode === 'month' || mode === 'window') {
    const window = doc.region ? input.windows?.[doc.region] : undefined;
    if (!window) {
      const anyWindow = Object.values(input.windows ?? {})[0];
      if (!anyWindow) return true;
      return doc.endDate >= anyWindow.start && doc.startDate <= anyWindow.end;
    }
    return doc.endDate >= window.start && doc.startDate <= window.end;
  }
  return true;
}

export function rankDocuments(
  documents: ExhibitionDocument[],
  input: ExhibitionSearchInput
): ExhibitionHit[] {
  const keyword = input.keyword.trim();
  const limit = Math.min(Math.max(input.limit ?? 20, 1), 50);
  const scored: ExhibitionHit[] = [];

  for (const doc of documents) {
    if (doc.status !== 'published') continue;
    if (!matchesRegion(doc, input.region)) continue;
    if (!matchesCategory(doc, input.category ?? '')) continue;
    if (!matchesDate(doc, input)) continue;

    if (keyword && !hasKeywordMatch(doc, keyword)) continue;
    const rank = keyword ? scoreDocument(doc, keyword) : 0;
    if (keyword && rank < MIN_MATCH) continue;
    scored.push({ ...doc, rank });
  }

  scored.sort((a, b) => {
    if (b.rank !== a.rank) return b.rank - a.rank;
    return a.startDate.getTime() - b.startDate.getTime();
  });
  return scored.slice(0, limit);
}
