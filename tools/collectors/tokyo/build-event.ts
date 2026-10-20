import { contentHash } from '../shared/content-hash';
import { compactI18n, summarize } from '../shared/summarize';
import { httpUrl } from '../shared/ssrf';
import type {
  ExhibitionI18n,
  LocalizedText,
  NormalizedExhibition,
} from '../shared/types';

export const TOKYO_TIMEZONE = 'Asia/Tokyo' as const;

export type TokyoEventDraft = {
  source: string;
  externalId: string;
  sourceUrl: string;
  title: LocalizedText;
  descriptionHtml?: LocalizedText;
  location: LocalizedText;
  startDate: Date;
  endDate: Date;
  tags?: string[];
  priceText?: string | null;
  venueName?: string;
  now?: Date;
};

function pickTitle(title: LocalizedText): string | undefined {
  return title.ja || title.en || title.zh;
}

function pickLocation(location: LocalizedText): string | undefined {
  return location.ja || location.en || location.zh;
}

export function buildTokyoEvent(
  draft: TokyoEventDraft
): NormalizedExhibition | null {
  const title = pickTitle(draft.title);
  const location = pickLocation(draft.location);
  const sourceUrl = httpUrl(draft.sourceUrl);
  const externalId = draft.externalId.trim();
  if (!title || !location || !sourceUrl || !externalId) return null;
  if (draft.endDate.getTime() < draft.startDate.getTime()) return null;

  const now = draft.now ?? new Date();
  const descriptionJa = summarize(
    draft.descriptionHtml?.ja ?? '',
    sourceUrl,
    'ja'
  );
  const descriptionEn = draft.descriptionHtml?.en
    ? summarize(draft.descriptionHtml.en, sourceUrl, 'en')
    : undefined;
  const descriptionZh = draft.descriptionHtml?.zh
    ? summarize(draft.descriptionHtml.zh, sourceUrl, 'zh')
    : undefined;
  const description = descriptionJa;
  const i18n: ExhibitionI18n = {
    title: compactI18n(draft.title),
    description: compactI18n({
      ja: descriptionJa,
      en: descriptionEn,
      zh: descriptionZh,
    }),
    location: compactI18n(draft.location),
  };
  const tags = [...new Set(['展覧会', '東京', ...(draft.tags ?? [])])];
  const priceText = draft.priceText?.trim() || null;
  const normalizedCore = {
    title,
    location,
    startDate: draft.startDate.toISOString(),
    endDate: draft.endDate.toISOString(),
    priceText,
    sourceUrl,
    description,
    i18n,
  };

  return {
    id: `${draft.source}-${externalId}`.slice(0, 191),
    title,
    description,
    location,
    startDate: draft.startDate,
    endDate: draft.endDate,
    status: 'published',
    region: 'TOKYO',
    timezone: TOKYO_TIMEZONE,
    source: draft.source,
    sourceUrl,
    externalId,
    contentHash: contentHash(normalizedCore),
    tags,
    priceText,
    lastSeenAt: now,
    data: {
      kind: 'exhibition',
      source: draft.source,
      summaryOnly: true,
      i18n,
      ...(draft.venueName ? { venueName: draft.venueName } : {}),
    },
  };
}

export function isStillOnView(end: Date, now: Date): boolean {
  return end.getTime() >= now.getTime() - 24 * 60 * 60 * 1000;
}

export function asText(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (value && typeof value === 'object' && 'rendered' in value) {
    const rendered = (value as { rendered?: unknown }).rendered;
    return typeof rendered === 'string' ? rendered.trim() : '';
  }
  return '';
}
