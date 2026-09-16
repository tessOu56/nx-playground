import { getRequestConfig } from 'next-intl/server';

import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from './src/libs/constants';
import { messages as catalog } from '../../libs/i18n/src/lib/next-intl/messages';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !SUPPORTED_LOCALES.includes(locale as (typeof SUPPORTED_LOCALES)[number])) {
    locale = DEFAULT_LOCALE;
  }

  const messages =
    catalog[locale as keyof typeof catalog] || catalog[DEFAULT_LOCALE];

  return {
    locale: locale as string,
    messages,
  };
});
