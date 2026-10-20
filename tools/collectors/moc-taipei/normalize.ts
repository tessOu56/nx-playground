import { contentHash } from '../shared/content-hash';
import { htmlToPlainText } from '../shared/html-to-plain-text';
import { publicWebUrl } from '../shared/ssrf';
import { SUMMARY_MAX_CHARS } from '../shared/summarize';
import type { NormalizedExhibition } from '../shared/types';

export const MOC_SOURCE = 'moc-opendata';
export const MOC_TIMEZONE = 'Asia/Taipei';
export { SUMMARY_MAX_CHARS };

export type MocShowInfo = {
  time?: unknown;
  location?: unknown;
  locationName?: unknown;
  onSales?: unknown;
  price?: unknown;
  latitude?: unknown;
  longitude?: unknown;
  endTime?: unknown;
};

export type MocRecord = {
  UID?: unknown;
  title?: unknown;
  category?: unknown;
  showInfo?: unknown;
  showUnit?: unknown;
  descriptionFilterHtml?: unknown;
  imageUrl?: unknown;
  webSales?: unknown;
  sourceWebPromote?: unknown;
  sourceWebName?: unknown;
  startDate?: unknown;
  endDate?: unknown;
};

export type NormalizedTaipeiEvent = NormalizedExhibition & {
  region: 'TAIPEI';
  timezone: typeof MOC_TIMEZONE;
  source: typeof MOC_SOURCE;
};

const TAIPEI_CITY = /臺北市|台北市|Taipei\s*City/i;
const NEW_TAIPEI_ONLY = /新北市/;

function asText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function isTaipeiCity(...parts: unknown[]): boolean {
  const text = parts.map(asText).filter(Boolean).join(' ');
  if (!text) return false;
  if (NEW_TAIPEI_ONLY.test(text) && !TAIPEI_CITY.test(text)) return false;
  return TAIPEI_CITY.test(text);
}

function showList(value: unknown): MocShowInfo[] {
  return Array.isArray(value) ? value.filter(item => item && typeof item === 'object') : [];
}

export function summarize(html: string, sourceUrl: string): string {
  const plain = htmlToPlainText(html);
  if (!plain) {
    return `文化部開放資料展覽摘要。詳情：${sourceUrl}`;
  }
  const clipped =
    plain.length <= SUMMARY_MAX_CHARS
      ? plain
      : `${plain.slice(0, SUMMARY_MAX_CHARS - 1).trimEnd()}…`;
  return `${clipped} 詳情：${sourceUrl}`;
}

export function httpsImageUrl(raw: unknown): string | undefined {
  let value = asText(raw);
  if (!value) return undefined;
  value = value.replace(/^https:\/\/cloud\.culture\.twhttps:\/\//i, 'https://');
  return publicWebUrl(value, new Set(['https:']));
}

function httpUrl(raw: unknown): string | undefined {
  return publicWebUrl(asText(raw), new Set(['http:', 'https:']));
}

export function pickSourceUrl(record: MocRecord): string {
  return (
    httpUrl(record.sourceWebPromote) ||
    httpUrl(record.webSales) ||
    'https://cloud.culture.tw/'
  );
}

/** Culture open data timestamps are civil time in Asia/Taipei. */
export function parseTaipeiDateTime(raw: unknown, endOfDay = false): Date | null {
  const text = asText(raw).replace(/-/g, '/');
  const match = text.match(
    /^(\d{4})\/(\d{1,2})\/(\d{1,2})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/
  );
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hasTime = match[4] != null;
  const hour = hasTime ? Number(match[4]) : endOfDay ? 23 : 0;
  const minute = hasTime ? Number(match[5]) : endOfDay ? 59 : 0;
  const second = hasTime ? Number(match[6] ?? '0') : endOfDay ? 59 : 0;
  const ms = !hasTime && endOfDay ? 999 : 0;
  const utc = Date.UTC(year, month - 1, day, hour - 8, minute, second, ms);
  const date = new Date(utc);
  return Number.isNaN(date.getTime()) ? null : date;
}

function pickDates(record: MocRecord, show: MocShowInfo): { start: Date; end: Date } | null {
  const start =
    parseTaipeiDateTime(show.time) || parseTaipeiDateTime(record.startDate);
  const end =
    parseTaipeiDateTime(show.endTime, true) ||
    parseTaipeiDateTime(record.endDate, true);
  if (!start || !end || end.getTime() < start.getTime()) return null;
  return { start, end };
}

export function normalizeMocRecord(
  record: unknown,
  now: Date = new Date()
): NormalizedTaipeiEvent | null {
  if (!record || typeof record !== 'object') return null;
  const row = record as MocRecord;
  const externalId = asText(row.UID);
  const title = asText(row.title);
  if (!externalId || !title) return null;

  const shows = showList(row.showInfo);
  const taipeiShows = shows.filter(show =>
    isTaipeiCity(show.location, show.locationName)
  );
  const show = taipeiShows[0];
  if (!show) return null;
  const dates = pickDates(row, show);
  if (!dates) return null;

  const location =
    asText(show.locationName) ||
    asText(show.location) ||
    asText(row.showUnit);
  if (!location) return null;

  const sourceUrl = pickSourceUrl(row);
  const priceText = asText(show.price) || null;
  const image = httpsImageUrl(row.imageUrl);
  const description = summarize(asText(row.descriptionFilterHtml), sourceUrl);
  const tags = ['展覽', '台北'];
  const venueName = asText(show.locationName);
  if (venueName) tags.push(venueName);

  const i18n = {
    title: { zh: title },
    description: { zh: description },
    location: { zh: location },
  };
  const normalizedCore = {
    title,
    location,
    startDate: dates.start.toISOString(),
    endDate: dates.end.toISOString(),
    priceText,
    sourceUrl,
    description,
    image: image ?? null,
    i18n,
  };

  return {
    id: `moc-${externalId}`,
    title,
    description,
    location,
    startDate: dates.start,
    endDate: dates.end,
    status: 'published',
    region: 'TAIPEI',
    timezone: MOC_TIMEZONE,
    source: MOC_SOURCE,
    sourceUrl,
    externalId,
    contentHash: contentHash(normalizedCore),
    tags: [...new Set(tags)],
    priceText,
    lastSeenAt: now,
    data: {
      kind: 'exhibition',
      ...(image ? { image } : {}),
      source: MOC_SOURCE,
      summaryOnly: true,
      i18n,
      ...(venueName ? { venueName } : {}),
    },
  };
}

export function normalizeMocRecords(
  records: unknown,
  now: Date = new Date()
): NormalizedTaipeiEvent[] {
  if (!Array.isArray(records)) return [];
  const byExternalId = new Map<string, NormalizedTaipeiEvent>();
  for (const record of records) {
    try {
      const normalized = normalizeMocRecord(record, now);
      if (!normalized) continue;
      byExternalId.set(normalized.externalId, normalized);
    } catch {
      /* skip malformed rows */
    }
  }
  return [...byExternalId.values()];
}
