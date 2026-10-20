import { htmlToPlainText } from '../shared/html-to-plain-text';
import { parseRssItems } from '../shared/rss';
import { fetchAllowlisted } from '../shared/ssrf';
import {
  EXHIBITION_HINT,
  extractVenue,
  parseJapaneseDateRange,
} from '../shared/tokyo-dates';
import type { CollectorBatch, LocalizedText } from '../shared/types';

import { buildTokyoEvent, isStillOnView } from './build-event';

export const CCBT_SOURCE = 'ccbt';
export const CCBT_HOST = 'ccbt.rekibun.or.jp';
/** Trailing slash 301s; collectors never follow redirects. */
export const CCBT_FEED = 'https://ccbt.rekibun.or.jp/events/feed';
export const CCBT_UA =
  'nx-playground-tokyo-collector/1.0 (+https://github.com/tessOu56/nx-playground)';

const ALLOWED = new Set([CCBT_HOST]);
const VENUE: LocalizedText = {
  ja: 'シビック・クリエイティブ・ベース東京［CCBT］',
  en: 'Civic Creative Base Tokyo [CCBT]',
  zh: 'Civic Creative Base Tokyo [CCBT]',
};

function slugFrom(link: string, guid: string): string {
  try {
    const path = new URL(link).pathname.replace(/\/+$/, '');
    const slug = path.split('/').filter(Boolean).pop();
    if (slug) return slug;
  } catch {
    /* ignore */
  }
  return guid || link;
}

export async function fetchCcbtFeed(
  fetchImpl: typeof fetch = fetch
): Promise<string> {
  const response = await fetchAllowlisted(CCBT_FEED, ALLOWED, {
    accept: 'application/rss+xml, application/xml, text/xml',
    userAgent: CCBT_UA,
    label: 'CCBT events RSS',
    fetchImpl,
  });
  return response.text();
}

export function normalizeCcbtRss(
  xml: unknown,
  now: Date = new Date()
): CollectorBatch {
  const items = typeof xml === 'string' ? parseRssItems(xml) : [];
  const events = [];
  for (const item of items) {
    try {
      const haystack = `${item.title}\n${item.description}\n${item.content}`;
      if (!EXHIBITION_HINT.test(haystack)) continue;
      const plain = htmlToPlainText(`${item.description}\n${item.content}`);
      const year = item.pubDate
        ? new Date(item.pubDate).getUTCFullYear()
        : now.getUTCFullYear();
      const dates = parseJapaneseDateRange(
        plain,
        Number.isFinite(year) ? year : now.getUTCFullYear()
      );
      if (!dates || !isStillOnView(dates.end, now)) continue;
      const venue = extractVenue(plain) || VENUE.ja;
      const event = buildTokyoEvent({
        source: CCBT_SOURCE,
        externalId: slugFrom(item.link, item.guid),
        sourceUrl: item.link,
        title: { ja: item.title },
        descriptionHtml: { ja: item.description || item.content },
        location: { ja: venue, en: VENUE.en, zh: VENUE.zh },
        startDate: dates.start,
        endDate: dates.end,
        tags: ['CCBT'],
        venueName: venue,
        now,
      });
      if (event) events.push(event);
    } catch {
      /* skip malformed rows */
    }
  }
  return { source: CCBT_SOURCE, fetched: items.length, events };
}
