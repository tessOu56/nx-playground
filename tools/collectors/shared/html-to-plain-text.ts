const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

/**
 * Decode one HTML entity. Each match is replaced independently so
 * `&amp;lt;` becomes `&lt;` (one pass), never `<`.
 */
function decodeEntity(entity: string, body: string): string {
  if (body[0] === '#') {
    const hex = body[1] === 'x' || body[1] === 'X';
    const code = Number.parseInt(body.slice(hex ? 2 : 1), hex ? 16 : 10);
    if (!Number.isFinite(code) || code <= 0 || code > 0x10ffff) return entity;
    try {
      return String.fromCodePoint(code);
    } catch {
      return entity;
    }
  }
  return NAMED_ENTITIES[body.toLowerCase()] ?? entity;
}

/**
 * Exhibition summaries are stored as plain text. Decode entities once, then
 * drop tags. Do not use a script/style filter regex (incomplete closing-tag
 * matchers are a sanitizer bug, not a text extractor).
 */
export function htmlToPlainText(html: string): string {
  const decoded = html.replace(
    /&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/gi,
    (entity, body: string) => decodeEntity(entity, body)
  );
  return decoded.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}
