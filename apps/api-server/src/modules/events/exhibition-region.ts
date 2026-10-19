export const EXHIBITION_REGIONS = ['TAIPEI', 'TOKYO'] as const;

export type ExhibitionRegion = (typeof EXHIBITION_REGIONS)[number];

export function isExhibitionRegion(value: string): value is ExhibitionRegion {
  return (EXHIBITION_REGIONS as readonly string[]).includes(value);
}

/** Empty/missing → no filter. Invalid → null (caller should 400). */
export function parseExhibitionRegion(
  raw?: string | null
): ExhibitionRegion | undefined | null {
  if (raw == null) return undefined;
  const normalized = raw.trim().toUpperCase();
  if (!normalized) return undefined;
  if (isExhibitionRegion(normalized)) return normalized;
  return null;
}
