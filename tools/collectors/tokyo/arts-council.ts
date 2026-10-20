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

export const ARTS_COUNCIL_SOURCE = 'arts-council-tokyo';
export const ARTS_COUNCIL_HOST = 'www.artscouncil-tokyo.jp';
export const ARTS_COUNCIL_FEED =
  'https://www.artscouncil-tokyo.jp/news-cat/festivals/feed/';
export const ARTS_COUNCIL_UA =
  'nx-playground-tokyo-collector/1.0 (+https://github.com/tessOu56/nx-playground)';

const ALLOWED = new Set([ARTS_COUNCIL_HOST]);
const VENUE: LocalizedText = {
  ja: 'アーツカウンシル東京',
  en: 'Arts Council Tokyo',
  zh: 'Arts Council Tokyo',
};

function externalIdFrom(guid: string, link: string): string {
  const fromGuid = guid.match(/[?&]p=(\d+)/);
  if (fromGuid) return fromGuid[1];
  try {
    const path = new URL(link).pathname.replace(/\/+$/, '');
    const slug = path.split('/').filter(Boolean).pop();
    if (slug) return slug;
  } catch {
    /* ignore */
  }
  return guid || link;
}

export async function fetchArtsCouncilFeed(
  fetchImpl: typeof fetch = fetch
): Promise<string> {
  const response = await fetchAllowlisted(ARTS_COUNCIL_FEED, ALLOWED, {
    accept: 'application/rss+xml, application/xml, text/xml',
    userAgent: ARTS_COUNCIL_UA,
    label: 'Arts Council Tokyo RSS',
    fetchImpl,
  });
  return response.text();
}

export function normalizeArtsCouncilRss(
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
        source: ARTS_COUNCIL_SOURCE,
        externalId: externalIdFrom(item.guid, item.link),
        sourceUrl: item.link,
        title: { ja: item.title },
        descriptionHtml: { ja: item.description || item.content },
        location: { ja: venue, en: VENUE.en, zh: VENUE.zh },
        startDate: dates.start,
        endDate: dates.end,
        tags: ['アーツカウンシル東京'],
        venueName: venue,
        now,
      });
      if (event) events.push(event);
    } catch {
      /* skip malformed rows */
    }
  }
  return { source: ARTS_COUNCIL_SOURCE, fetched: items.length, events };
}
