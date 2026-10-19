import type { SupportedLocale } from '../../constants/i18n';

import {
  defaultCatalogWindow,
  resolveTimeWindow,
  type ExhibitionRegion,
  type TimeWindowKind,
  type UtcRange,
} from './time-window';

export type ParsedCatalogQuery = {
  help: boolean;
  region?: ExhibitionRegion;
  timeWindow?: TimeWindowKind;
  keyword: string;
  locale: SupportedLocale;
  windows: Partial<Record<ExhibitionRegion, UtcRange>>;
};

type Token = {
  pattern: RegExp;
  kind: 'help' | 'region' | 'time';
  region?: ExhibitionRegion;
  timeWindow?: TimeWindowKind;
  localeHint?: SupportedLocale;
};

const TOKENS: Token[] = [
  { pattern: /使い方|ヘルプ/giu, kind: 'help', localeHint: 'ja' },
  { pattern: /說明|幫助|怎么用|怎麼用/giu, kind: 'help', localeHint: 'zh-TW' },
  { pattern: /\bhelp\b|\busage\b/giu, kind: 'help', localeHint: 'en' },
  { pattern: /台北市|臺北市|台北|臺北|taipei\s*city|\btaipei\b/giu, kind: 'region', region: 'TAIPEI' },
  { pattern: /東京都|東京|\btokyo\b/giu, kind: 'region', region: 'TOKYO' },
  { pattern: /這週末|本週末|这周末|本周末/giu, kind: 'time', timeWindow: 'weekend', localeHint: 'zh-TW' },
  { pattern: /this\s+weekend|\bweekend\b/giu, kind: 'time', timeWindow: 'weekend', localeHint: 'en' },
  { pattern: /今週末/giu, kind: 'time', timeWindow: 'weekend', localeHint: 'ja' },
  { pattern: /週末/giu, kind: 'time', timeWindow: 'weekend' },
  { pattern: /this\s+week/giu, kind: 'time', timeWindow: 'this_week', localeHint: 'en' },
  { pattern: /本週|本周/giu, kind: 'time', timeWindow: 'this_week', localeHint: 'zh-TW' },
  { pattern: /今週/giu, kind: 'time', timeWindow: 'this_week', localeHint: 'ja' },
  { pattern: /this\s+month/giu, kind: 'time', timeWindow: 'this_month', localeHint: 'en' },
  { pattern: /本月/giu, kind: 'time', timeWindow: 'this_month', localeHint: 'zh-TW' },
  { pattern: /今月/giu, kind: 'time', timeWindow: 'this_month', localeHint: 'ja' },
  { pattern: /\btoday\b/giu, kind: 'time', timeWindow: 'today', localeHint: 'en' },
  { pattern: /今天/giu, kind: 'time', timeWindow: 'today', localeHint: 'zh-TW' },
  { pattern: /今日/giu, kind: 'time', timeWindow: 'today', localeHint: 'ja' },
];

function detectLocale(
  text: string,
  hints: SupportedLocale[],
  help: boolean
): SupportedLocale {
  if (/[ぁ-んァ-ン]/.test(text)) return 'ja';
  const ja = hints.filter(h => h === 'ja').length;
  const en = hints.filter(h => h === 'en').length;
  const zh = hints.filter(h => h === 'zh-TW').length;
  if (ja && !zh) return 'ja';
  if (en && !zh && !ja) return 'en';
  if (zh) return 'zh-TW';
  if (help && en) return 'en';
  if (/[A-Za-z]/.test(text) && !/[\u4e00-\u9fff]/.test(text)) return 'en';
  return 'zh-TW';
}

export function parseCatalogQuery(
  raw: string,
  now: Date = new Date()
): ParsedCatalogQuery {
  const text = raw.normalize('NFKC').trim();
  let remaining = text;
  let help = false;
  let region: ExhibitionRegion | undefined;
  let timeWindow: TimeWindowKind | undefined;
  const hints: SupportedLocale[] = [];

  for (const token of TOKENS) {
    token.pattern.lastIndex = 0;
    if (!token.pattern.test(remaining)) continue;
    token.pattern.lastIndex = 0;
    remaining = remaining.replace(token.pattern, ' ');
    if (token.localeHint) hints.push(token.localeHint);
    if (token.kind === 'help') help = true;
    if (token.kind === 'region' && token.region && !region) region = token.region;
    if (token.kind === 'time' && token.timeWindow && !timeWindow) {
      timeWindow = token.timeWindow;
    }
  }

  const keyword = remaining.replace(/\s+/g, ' ').trim().slice(0, 80);
  const locale = detectLocale(text, hints, help);

  const windows: ParsedCatalogQuery['windows'] = {};
  const regions: ExhibitionRegion[] = region ? [region] : ['TAIPEI', 'TOKYO'];
  for (const item of regions) {
    windows[item] = timeWindow
      ? resolveTimeWindow(timeWindow, item, now)
      : defaultCatalogWindow(now);
  }

  return { help, region, timeWindow, keyword, locale, windows };
}
