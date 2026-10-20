import { htmlToPlainText } from './html-to-plain-text';
import type { LocalizedText } from './types';

export const SUMMARY_MAX_CHARS = 180;

const DETAIL: LocalizedText = {
  ja: '詳細：',
  en: 'Details: ',
  zh: '詳情：',
};

const FALLBACK: LocalizedText = {
  ja: '公式ページの展覧会摘要。',
  en: 'Official listing summary.',
  zh: '官方頁面展覽摘要。',
};

export function summarize(
  html: string,
  sourceUrl: string,
  lang: keyof LocalizedText = 'zh'
): string {
  const prefix = DETAIL[lang] ?? DETAIL.zh;
  const fallback = FALLBACK[lang] ?? FALLBACK.zh;
  const plain = htmlToPlainText(html);
  if (!plain) {
    return `${fallback}${prefix}${sourceUrl}`;
  }
  const clipped =
    plain.length <= SUMMARY_MAX_CHARS
      ? plain
      : `${plain.slice(0, SUMMARY_MAX_CHARS - 1).trimEnd()}…`;
  return `${clipped} ${prefix}${sourceUrl}`;
}

export function compactI18n(value: LocalizedText): LocalizedText {
  const next: LocalizedText = {};
  if (value.ja) next.ja = value.ja;
  if (value.en) next.en = value.en;
  if (value.zh) next.zh = value.zh;
  return next;
}
