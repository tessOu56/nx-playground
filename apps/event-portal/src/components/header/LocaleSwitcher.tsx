'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SUPPORTED_LOCALES } from '@/libs/constants';
import { demoCopy } from '@/libs/i18n/demo-copy';
import { replaceLocale } from '@/libs/i18n/localeRoutes';

function localeLabel(
  locale: string,
  copy: ReturnType<typeof demoCopy>
): string {
  if (locale === 'en') return copy.langEn;
  if (locale === 'ja') return copy.langJa;
  return copy.langZh;
}

function nextSupportedLocale(locale: string): string {
  const index = SUPPORTED_LOCALES.indexOf(
    locale as (typeof SUPPORTED_LOCALES)[number]
  );
  const current = index >= 0 ? index : 0;
  return SUPPORTED_LOCALES[(current + 1) % SUPPORTED_LOCALES.length];
}

export function LocaleSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname() || `/${locale}`;
  const copy = demoCopy(locale);
  const nextLocale = nextSupportedLocale(locale);
  const href = replaceLocale(pathname, nextLocale);

  return (
    <Link
      href={href}
      hrefLang={nextLocale}
      lang={nextLocale}
      className='rounded-md px-1.5 py-1 text-xs font-medium text-gray-800 hover:bg-gray-100 hover:text-gray-900 sm:px-2 sm:text-sm'
      aria-label={`${copy.language}: ${localeLabel(nextLocale, copy)}`}
    >
      {localeLabel(nextLocale, copy)}
    </Link>
  );
}
