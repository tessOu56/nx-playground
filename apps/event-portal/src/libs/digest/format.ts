import { DIGEST_LOCALES } from './types';
import type {
  DigestCity,
  DigestExhibition,
  DigestLocale,
  DigestMessage,
  WeeklyDigest,
} from './types';

export const DISCORD_CONTENT_LIMIT = 2000;

const CITY_TZ: Record<DigestCity, string> = {
  TAIPEI: 'Asia/Taipei',
  TOKYO: 'Asia/Tokyo',
};

const PORTAL_LOCALE: Record<DigestLocale, string> = {
  zh: 'zh-TW',
  ja: 'ja',
  en: 'en',
};

const COPY: Record<
  DigestLocale,
  {
    title: string;
    taipei: string;
    tokyo: string;
    upcoming: string;
    newlyAdded: string;
    empty: string;
    more: (n: number) => string;
  }
> = {
  zh: {
    title: '本週展覽摘要',
    taipei: '台北',
    tokyo: '東京',
    upcoming: '即將開展',
    newlyAdded: '本週新增',
    empty: '本週沒有',
    more: n => `另有 ${n} 筆未列出`,
  },
  ja: {
    title: '今週の展覧会ダイジェスト',
    taipei: '台北',
    tokyo: '東京',
    upcoming: '開催予定',
    newlyAdded: '今週の新着',
    empty: '今週はありません',
    more: n => `ほか ${n} 件`,
  },
  en: {
    title: 'This week’s exhibition digest',
    taipei: 'Taipei',
    tokyo: 'Tokyo',
    upcoming: 'Opening soon',
    newlyAdded: 'Newly listed',
    empty: 'None this week',
    more: n => `${n} more not listed`,
  },
};

export function portalLocale(locale: DigestLocale): string {
  return PORTAL_LOCALE[locale];
}

export function listingUrl(
  locale: DigestLocale,
  eventId: string,
  origin: string
): string {
  const safeOrigin = origin.replace(/\/$/, '');
  const safeId = encodeURIComponent(eventId.trim());
  return `${safeOrigin}/${portalLocale(locale)}/events/${safeId}`;
}

function clip(value: string, max: number): string {
  const trimmed = value.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

function intlLocale(locale: DigestLocale): string {
  if (locale === 'ja') return 'ja-JP';
  if (locale === 'en') return 'en-GB';
  return 'zh-TW';
}

export function formatDateRange(
  exhibition: DigestExhibition,
  locale: DigestLocale
): string {
  const fmt = new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone: CITY_TZ[exhibition.city],
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const start = fmt.format(exhibition.startDate);
  const end = fmt.format(exhibition.endDate);
  if (start === end) return start;
  return locale === 'ja' ? `${start}〜${end}` : `${start} – ${end}`;
}

function cityLabel(city: DigestCity, locale: DigestLocale): string {
  return city === 'TOKYO' ? COPY[locale].tokyo : COPY[locale].taipei;
}

function formatWeekSpan(digest: WeeklyDigest, locale: DigestLocale): string {
  const fmt = new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
  });
  const start = fmt.format(digest.weekStart);
  const end = fmt.format(new Date(digest.weekEnd.getTime() - 1));
  return locale === 'ja' ? `${start}〜${end}` : `${start} – ${end}`;
}

function formatItem(
  exhibition: DigestExhibition,
  locale: DigestLocale,
  origin: string
): string {
  const title = clip(exhibition.title, 60);
  const dates = formatDateRange(exhibition, locale);
  const location = exhibition.location
    ? ` · ${clip(exhibition.location, 40)}`
    : '';
  const url = listingUrl(locale, exhibition.id, origin);
  return `• ${title}\n  ${dates}${location}\n  ${url}`;
}

function formatSection(
  label: string,
  items: readonly DigestExhibition[],
  locale: DigestLocale,
  origin: string
): string {
  if (items.length === 0) {
    return `${label}\n${COPY[locale].empty}`;
  }
  return [label, ...items.map(item => formatItem(item, locale, origin))].join(
    '\n'
  );
}

export function formatDigestMessage(
  digest: WeeklyDigest,
  locale: DigestLocale,
  origin: string
): string {
  const copy = COPY[locale];
  const lines = [
    `📅 ${copy.title}（${formatWeekSpan(digest, locale)}）`,
    '',
  ];

  for (const section of digest.cities) {
    lines.push(`**${cityLabel(section.city, locale)}**`);
    lines.push(
      formatSection(copy.upcoming, section.upcoming, locale, origin)
    );
    lines.push(
      formatSection(copy.newlyAdded, section.newlyAdded, locale, origin)
    );
    lines.push('');
  }

  const text = lines.join('\n').trim();
  if (text.length <= DISCORD_CONTENT_LIMIT) return text;
  return `${text.slice(0, DISCORD_CONTENT_LIMIT - 1)}…`;
}

export function renderDigestMessages(
  digest: WeeklyDigest,
  origin: string
): DigestMessage[] {
  return DIGEST_LOCALES.map(locale => ({
    locale,
    text: formatDigestMessage(digest, locale, origin),
  }));
}
