import type { SearchableItem, SearchResult, Intent } from './types';

/**
 * Extract keywords from query
 */
function extractKeywords(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 2); // Filter short words
}

/**
 * Calculate match score for an item
 */
function calculateScore(
  queryKeywords: string[],
  item: SearchableItem
): { score: number; matchedKeywords: string[] } {
  let score = 0;
  const matchedKeywords: string[] = [];

  for (const queryWord of queryKeywords) {
    // Exact match in name (highest weight)
    if (item.name.toLowerCase().includes(queryWord)) {
      score += 10;
      matchedKeywords.push(queryWord);
    }

    // Match in keywords (medium weight)
    const keywordMatch = item.keywords.find(k => k.includes(queryWord));
    if (keywordMatch) {
      score += 5;
      if (!matchedKeywords.includes(queryWord)) {
        matchedKeywords.push(queryWord);
      }
    }

    // Match in description (low weight)
    if (item.description.toLowerCase().includes(queryWord)) {
      score += 2;
      if (!matchedKeywords.includes(queryWord)) {
        matchedKeywords.push(queryWord);
      }
    }

    // Match in content (lowest weight)
    if (item.content.toLowerCase().includes(queryWord)) {
      score += 1;
    }
  }

  return { score, matchedKeywords };
}

/**
 * Search items by query
 */
export function searchItems(
  query: string,
  items: SearchableItem[],
  limit = 10
): SearchResult[] {
  const queryKeywords = extractKeywords(query);
  
  if (queryKeywords.length === 0) {
    return [];
  }

  const results: SearchResult[] = [];

  for (const item of items) {
    const { score, matchedKeywords } = calculateScore(queryKeywords, item);

    if (score > 0) {
      results.push({
        item,
        score,
        matchedKeywords,
      });
    }
  }

  // Sort by score (descending) and return top results
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Detect query intent
 */
export function detectIntent(query: string): Intent {
  const lowerQuery = query.toLowerCase();
  const keywords = extractKeywords(query);

  // Project-related queries
  if (
    lowerQuery.includes('project') ||
    lowerQuery.includes('app') ||
    lowerQuery.includes('build') ||
    lowerQuery.includes('built')
  ) {
    return { type: 'project', keywords };
  }

  // Blog-related queries
  if (
    lowerQuery.includes('blog') ||
    lowerQuery.includes('article') ||
    lowerQuery.includes('post') ||
    lowerQuery.includes('write') ||
    lowerQuery.includes('wrote')
  ) {
    return { type: 'blog', keywords };
  }

  // Tech stack queries
  if (
    lowerQuery.includes('technology') ||
    lowerQuery.includes('tech stack') ||
    lowerQuery.includes('use') ||
    lowerQuery.includes('tool')
  ) {
    return { type: 'tech', keywords };
  }

  // Experience queries
  if (
    lowerQuery.includes('experience') ||
    lowerQuery.includes('year') ||
    lowerQuery.includes('background') ||
    lowerQuery.includes('skill')
  ) {
    return { type: 'experience', keywords };
  }

  return { type: 'general', keywords };
}

