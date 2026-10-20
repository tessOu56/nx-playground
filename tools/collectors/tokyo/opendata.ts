import { parseCsv, decodeMaybeShiftJis } from '../shared/csv';
import { fetchAllowlisted } from '../shared/ssrf';
import { EXHIBITION_HINT, parseTokyoDateTime } from '../shared/tokyo-dates';
import type { CollectorBatch } from '../shared/types';

import { asText, buildTokyoEvent, isStillOnView } from './build-event';

export const TOKYO_OPENDATA_SOURCE = 'tokyo-opendata-event';
export const TOKYO_OPENDATA_HOST = 'www.opendata.metro.tokyo.lg.jp';
export const TOKYO_OPENDATA_CSV =
  'https://www.opendata.metro.tokyo.lg.jp/suisyoudataset/130001_event.csv';
export const TOKYO_OPENDATA_UA =
  'nx-playground-tokyo-collector/1.0 (+https://github.com/tessOu56/nx-playground)';

const ALLOWED = new Set([TOKYO_OPENDATA_HOST]);

export async function fetchTokyoOpendataCsv(
  fetchImpl: typeof fetch = fetch
): Promise<string> {
  const response = await fetchAllowlisted(TOKYO_OPENDATA_CSV, ALLOWED, {
    accept: 'text/csv, text/plain',
    userAgent: TOKYO_OPENDATA_UA,
    label: 'Tokyo open data events CSV',
    fetchImpl,
  });
  return decodeMaybeShiftJis(await response.arrayBuffer());
}

export function normalizeTokyoOpendataCsv(
  csv: unknown,
  now: Date = new Date()
): CollectorBatch {
  const rows = typeof csv === 'string' ? parseCsv(csv) : [];
  const events = [];
  for (const row of rows) {
    try {
      const titleJa = asText(row['イベント名']);
      const haystack = `${titleJa}\n${asText(row['説明'])}`;
      if (!titleJa || !EXHIBITION_HINT.test(haystack)) continue;
      const start = parseTokyoDateTime(row['開始日']);
      const end = parseTokyoDateTime(row['終了日'] || row['開始日'], true);
      if (!start || !end || !isStillOnView(end, now)) continue;
      const location =
        asText(row['場所名称']) ||
        asText(row['住所']) ||
        asText(row['都道府県名']);
      const event = buildTokyoEvent({
        source: TOKYO_OPENDATA_SOURCE,
        externalId: asText(row.NO) || asText(row['NO']),
        sourceUrl: asText(row.URL) || 'https://www.opendata.metro.tokyo.lg.jp/',
        title: {
          ja: titleJa,
          en: asText(row['イベント名_英語']) || undefined,
        },
        descriptionHtml: { ja: asText(row['説明']) },
        location: { ja: location },
        startDate: start,
        endDate: end,
        tags: ['東京都オープンデータ'],
        priceText: asText(row['料金（基本）']) || asText(row['料金（詳細）']),
        venueName: asText(row['場所名称']) || undefined,
        now,
      });
      if (event) events.push(event);
    } catch {
      /* skip malformed rows */
    }
  }
  return { source: TOKYO_OPENDATA_SOURCE, fetched: rows.length, events };
}
