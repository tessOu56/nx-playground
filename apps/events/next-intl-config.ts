import { getRequestConfig } from 'next-intl/server';

import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from './src/libs/constants';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !SUPPORTED_LOCALES.includes(locale as any)) {
    locale = DEFAULT_LOCALE;
  }

  try {
    // 動態載入 messages 以避免 SSR 問題
    const { messages } = await import('@nx-playground/i18n');
    return {
      locale: locale as string,
      messages:
        messages[locale as keyof typeof messages] || messages[DEFAULT_LOCALE],
    };
  } catch {
    // 如果載入失敗，返回空的 messages
    return {
      locale: locale as string,
      messages: {},
    };
  }
});
