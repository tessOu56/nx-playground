export type HighlightSegment = { text: string; match: boolean };

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Split `text` into match / non-match segments for restrained title highlighting. */
export function highlightSegments(
  text: string,
  query: string
): HighlightSegment[] {
  const needle = query.trim();
  if (!text) return [];
  if (!needle) return [{ text, match: false }];

  const pattern = new RegExp(escapeRegExp(needle), 'ig');
  const segments: HighlightSegment[] = [];
  let lastIndex = 0;
  let found = pattern.exec(text);

  while (found) {
    if (found.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, found.index), match: false });
    }
    const matched = found[0];
    if (!matched) break;
    segments.push({ text: matched, match: true });
    lastIndex = found.index + matched.length;
    found = pattern.exec(text);
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), match: false });
  }
  return segments.length > 0 ? segments : [{ text, match: false }];
}
