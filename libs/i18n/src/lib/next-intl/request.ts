import { getRequestConfig } from 'next-intl/server';

import { messages } from './messages';
import { locales, defaultLocale } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  return {
    locale: locale as string,
    messages: messages[locale as keyof typeof messages],
  };
});
