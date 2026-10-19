import type { SupportedLocale } from '../../constants/i18n';
import { publicSiteUrl } from '../../seo/public-site-url';

import type { CatalogEvent } from './catalog-search';
import { REGION_TIMEZONE, type ExhibitionRegion } from './time-window';

export type LineQuickReply = {
  items: Array<{
    type: 'action';
    action: { type: 'message'; label: string; text: string };
  }>;
};

export type LineTextMessage = {
  type: 'text';
  text: string;
  quickReply?: LineQuickReply;
};

export type LineFlexMessage = {
  type: 'flex';
  altText: string;
  contents: Record<string, unknown>;
  quickReply?: LineQuickReply;
};

export type LineMessage = LineTextMessage | LineFlexMessage;

const QUICK_REPLIES: Record<SupportedLocale, Array<{ label: string; text: string }>> = {
  'zh-TW': [
    { label: '台北 本週', text: '台北 本週' },
    { label: '台北 這週末', text: '台北 這週末' },
    { label: '東京 週末', text: '東京 週末' },
    { label: '東京 本週', text: '東京 本週' },
    { label: '說明', text: '說明' },
  ],
  ja: [
    { label: '台北 今週', text: '台北 今週' },
    { label: '東京 週末', text: '東京 週末' },
    { label: '東京 今週', text: '東京 今週' },
    { label: '使い方', text: '使い方' },
  ],
  en: [
    { label: 'Taipei this week', text: 'Taipei this week' },
    { label: 'Taipei weekend', text: 'Taipei weekend' },
    { label: 'Tokyo weekend', text: 'Tokyo weekend' },
    { label: 'help', text: 'help' },
  ],
};

export function quickReply(locale: SupportedLocale): LineQuickReply {
  return {
    items: QUICK_REPLIES[locale].map(item => ({
      type: 'action',
      action: { type: 'message', label: item.label, text: item.text },
    })),
  };
}

export function helpMessage(locale: SupportedLocale): LineTextMessage {
  const text =
    locale === 'ja'
      ? [
          '台北・東京の展覧会を探せます。',
          '',
          '例：',
          '・台北 今週',
          '・東京 週末',
          '・台北 写真',
          '',
          '「使い方」でもう一度表示します。',
        ].join('\n')
      : locale === 'en'
        ? [
            'I can find exhibitions in Taipei and Tokyo.',
            '',
            'Try:',
            '• Taipei this week',
            '• Tokyo weekend',
            '• Taipei photography',
            '',
            'Send “help” to see this again.',
          ].join('\n')
        : [
            '嗨，我可以幫你找台北、東京的展覽。',
            '',
            '試試傳：',
            '・台北 本週',
            '・東京 週末',
            '・台北 攝影',
            '',
            '傳「說明」再看一次用法。',
          ].join('\n');
  return { type: 'text', text, quickReply: quickReply(locale) };
}

export function noResultsMessage(locale: SupportedLocale): LineTextMessage {
  const text =
    locale === 'ja'
      ? '条件に合う展覧会が見つかりませんでした。キーワードを変えるか、下の候補を試してみてください。'
      : locale === 'en'
        ? 'No exhibitions matched that search. Try another keyword, or tap a suggestion below.'
        : '這次沒找到符合的展覽。換個關鍵字，或點下面的建議看看？';
  return { type: 'text', text, quickReply: quickReply(locale) };
}

export function catalogUnavailableMessage(locale: SupportedLocale): LineTextMessage {
  const text =
    locale === 'ja'
      ? 'カタログに今すぐ接続できません。しばらくしてからもう一度試してください。'
      : locale === 'en'
        ? 'The catalog is temporarily unavailable. Please try again in a moment.'
        : '目錄暫時無法查詢，請稍後再試一次。';
  return { type: 'text', text, quickReply: quickReply(locale) };
}

function clip(value: string, max: number): string {
  const trimmed = value.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

function dateRange(event: CatalogEvent, locale: SupportedLocale): string {
  const timeZone =
    event.timezone ||
    (event.region ? REGION_TIMEZONE[event.region] : REGION_TIMEZONE.TAIPEI);
  const localeTag = locale === 'ja' ? 'ja-JP' : locale === 'en' ? 'en-GB' : 'zh-TW';
  const fmt = new Intl.DateTimeFormat(localeTag, {
    timeZone,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const start = fmt.format(event.startDate);
  const end = fmt.format(event.endDate);
  if (start === end) return start;
  return locale === 'ja' ? `${start}〜${end}` : `${start} – ${end}`;
}

function detailUrl(
  eventId: string,
  locale: SupportedLocale,
  origin = publicSiteUrl()
): string {
  return `${origin.replace(/\/$/, '')}/${locale}/events/${eventId}`;
}

function bubble(
  event: CatalogEvent,
  locale: SupportedLocale,
  origin: string
): Record<string, unknown> {
  const detailLabel =
    locale === 'ja' ? '詳細' : locale === 'en' ? 'Details' : '查看詳情';
  const bodyContents: Record<string, unknown>[] = [
    {
      type: 'text',
      text: clip(event.title, 40),
      weight: 'bold',
      size: 'md',
      wrap: true,
    },
    {
      type: 'text',
      text: clip(event.location || '—', 60),
      size: 'sm',
      color: '#666666',
      wrap: true,
      margin: 'sm',
    },
    {
      type: 'text',
      text: dateRange(event, locale),
      size: 'sm',
      color: '#666666',
      wrap: true,
      margin: 'sm',
    },
    {
      type: 'text',
      text: clip(event.priceText || '—', 40),
      size: 'sm',
      color: '#111111',
      wrap: true,
      margin: 'sm',
    },
  ];

  const hero =
    event.imageUrl && event.imageUrl.startsWith('https://')
      ? {
          type: 'image',
          url: event.imageUrl,
          size: 'full',
          aspectMode: 'cover',
          aspectRatio: '20:13',
        }
      : undefined;

  return {
    type: 'bubble',
    ...(hero ? { hero } : {}),
    body: {
      type: 'box',
      layout: 'vertical',
      contents: bodyContents,
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'button',
          style: 'primary',
          action: {
            type: 'uri',
            label: detailLabel,
            uri: detailUrl(event.id, locale, origin),
          },
        },
      ],
    },
  };
}

export function exhibitionCarousel(
  events: CatalogEvent[],
  locale: SupportedLocale,
  origin = publicSiteUrl()
): LineFlexMessage {
  const bubbles = events.slice(0, 10).map(event => bubble(event, locale, origin));
  const alt =
    events.length === 1
      ? events[0].title
      : locale === 'ja'
        ? `${events[0].title} ほか`
        : locale === 'en'
          ? `${events[0].title} and more`
          : `${events[0].title} 等展覽`;
  return {
    type: 'flex',
    altText: clip(alt, 400),
    contents: {
      type: 'carousel',
      contents: bubbles,
    },
    quickReply: quickReply(locale),
  };
}

export function portalOriginFromEnv(): string {
  return (
    process.env.PORTAL_PUBLIC_URL?.replace(/\/$/, '') ||
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    publicSiteUrl()
  );
}

export type { ExhibitionRegion };
