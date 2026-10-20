const CJK = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/u;
const LATIN = /[0-9a-z]/i;

/** Mirror of SQL `exhibition_search_tokens` — unigrams + CJK bigrams + latin words. */
export function exhibitionSearchTokens(input: string): string[] {
  const normalized = input
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
  if (!normalized) return [];

  const tokens: string[] = [];
  let latin = '';
  const chars = [...normalized];

  for (let index = 0; index < chars.length; index += 1) {
    const ch = chars[index];
    if (LATIN.test(ch)) {
      latin += ch;
      continue;
    }
    if (latin) {
      tokens.push(latin);
      latin = '';
    }
    if (CJK.test(ch)) {
      tokens.push(ch);
      const next = chars[index + 1];
      if (next && CJK.test(next)) tokens.push(ch + next);
    }
  }
  if (latin) tokens.push(latin);
  return tokens;
}

export function exhibitionSearchDocument(parts: Array<string | null | undefined>): string {
  return exhibitionSearchTokens(parts.filter(Boolean).join(' ')).join(' ');
}

export function diceCoefficient(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const grams = (value: string): string[] => {
    const text = value.normalize('NFKC').toLowerCase();
    if (text.length < 2) return [text];
    const out: string[] = [];
    for (let i = 0; i < text.length - 1; i += 1) out.push(text.slice(i, i + 2));
    return out;
  };
  const left = grams(a);
  const right = grams(b);
  const counts = new Map<string, number>();
  for (const gram of left) counts.set(gram, (counts.get(gram) ?? 0) + 1);
  let overlap = 0;
  for (const gram of right) {
    const n = counts.get(gram) ?? 0;
    if (n > 0) {
      overlap += 1;
      counts.set(gram, n - 1);
    }
  }
  return (2 * overlap) / (left.length + right.length);
}

export function escapeIlike(keyword: string): string {
  return keyword.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');
}
