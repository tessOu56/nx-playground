import { htmlToPlainText } from '../shared/html-to-plain-text';
import { assertAllowlistedHttpsUrl } from '../shared/ssrf';
import type { CollectorBatch, LocalizedText } from '../shared/types';
import { parseSlugDateRange } from '../shared/tokyo-dates';

import { asText, buildTokyoEvent, isStillOnView } from './build-event';

export const TEIEN_SOURCE = 'teien-art-museum';
export const TEIEN_HOST = 'www.teien-art-museum.ne.jp';
export const TEIEN_UA =
  'nx-playground-tokyo-collector/1.0 (+https://github.com/tessOu56/nx-playground)';

const ALLOWED = new Set([TEIEN_HOST]);
const FIELDS = 'id,slug,link,title,excerpt,status,lang,translations';
const VENUE: LocalizedText = {
  ja: '東京都庭園美術館',
  en: 'Tokyo Metropolitan Teien Art Museum',
  zh: '東京都庭園美術館',
};

type TeienPost = {
  id?: unknown;
  slug?: unknown;
  link?: unknown;
  title?: unknown;
  excerpt?: unknown;
  status?: unknown;
  lang?: unknown;
};

export type TeienPayload = {
  ja?: unknown;
  en?: unknown;
  zh?: unknown;
};

function exhibitionUrl(lang: 'ja' | 'en' | 'zh-tw', page: number): string {
  const params = new URLSearchParams({
    per_page: '100',
    page: String(page),
    lang,
    _fields: FIELDS,
  });
  return `https://${TEIEN_HOST}/wp-json/wp/v2/exhibition?${params.toString()}`;
}

async function fetchLang(
  lang: 'ja' | 'en' | 'zh-tw',
  fetchImpl: typeof fetch
): Promise<unknown[]> {
  const rows: unknown[] = [];
  for (let page = 1; page <= 5; page += 1) {
    const safeUrl = assertAllowlistedHttpsUrl(
      exhibitionUrl(lang, page),
      ALLOWED,
      'Teien exhibition API'
    );
    const response = await fetchImpl(safeUrl, {
      headers: {
        Accept: 'application/json',
        'User-Agent': TEIEN_UA,
      },
      signal: AbortSignal.timeout(30_000),
      redirect: 'error',
    });
    if (response.status === 400 || response.status === 404) break;
    if (!response.ok) {
      throw new Error(`Teien exhibition API HTTP ${response.status}`);
    }
    const body: unknown = await response.json();
    if (!Array.isArray(body) || body.length === 0) break;
    rows.push(...body);
    const totalPages = Number(response.headers.get('X-WP-TotalPages') ?? '1');
    if (page >= totalPages) break;
  }
  return rows;
}

function bySlug(rows: unknown[]): Map<string, TeienPost> {
  const map = new Map<string, TeienPost>();
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue;
    const post = row as TeienPost;
    const slug = asText(post.slug);
    if (!slug) continue;
    const status = asText(post.status);
    if (status && status !== 'publish') continue;
    map.set(slug, post);
  }
  return map;
}

function titleOf(post: TeienPost | undefined): string | undefined {
  if (!post) return undefined;
  const text = htmlToPlainText(asText(post.title));
  return text || undefined;
}

export async function fetchTeienExhibitions(
  fetchImpl: typeof fetch = fetch
): Promise<TeienPayload> {
  const [ja, en, zh] = await Promise.all([
    fetchLang('ja', fetchImpl),
    fetchLang('en', fetchImpl),
    fetchLang('zh-tw', fetchImpl),
  ]);
  return { ja, en, zh };
}

export function normalizeTeienPayload(
  payload: unknown,
  now: Date = new Date()
): CollectorBatch {
  const raw =
    payload && typeof payload === 'object' ? (payload as TeienPayload) : {};
  const ja = bySlug(Array.isArray(raw.ja) ? raw.ja : []);
  const en = bySlug(Array.isArray(raw.en) ? raw.en : []);
  const zh = bySlug(Array.isArray(raw.zh) ? raw.zh : []);
  const events = [];
  for (const [slug, post] of ja) {
    try {
      const dates = parseSlugDateRange(slug);
      if (!dates || !isStillOnView(dates.end, now)) continue;
      const titleJa = titleOf(post);
      if (!titleJa) continue;
      const event = buildTokyoEvent({
        source: TEIEN_SOURCE,
        externalId: slug,
        sourceUrl: asText(post.link) || `https://${TEIEN_HOST}/exhibition/${slug}/`,
        title: {
          ja: titleJa,
          en: titleOf(en.get(slug)),
          zh: titleOf(zh.get(slug)),
        },
        descriptionHtml: {
          ja: asText(post.excerpt),
          en: asText(en.get(slug)?.excerpt),
          zh: asText(zh.get(slug)?.excerpt),
        },
        location: VENUE,
        startDate: dates.start,
        endDate: dates.end,
        tags: [VENUE.ja ?? '東京都庭園美術館'],
        venueName: VENUE.ja,
        now,
      });
      if (event) events.push(event);
    } catch {
      /* skip malformed rows */
    }
  }
  return { source: TEIEN_SOURCE, fetched: ja.size, events };
}
