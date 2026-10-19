'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { demoCopy } from '@/libs/i18n/demo-copy';
import { replaceLocale } from '@/libs/i18n/localeRoutes';

export function LocaleSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname() || `/${locale}`;
  const copy = demoCopy(locale);
  const nextLocale = locale === 'en' ? 'zh-TW' : 'en';
  const href = replaceLocale(pathname, nextLocale);

  return (
    <Link
      href={href}
      hrefLang={nextLocale}
      lang={nextLocale}
      className='rounded-md px-2 py-1 text-sm font-medium text-gray-800 hover:bg-gray-100 hover:text-gray-900'
      aria-label={`${copy.language}: ${nextLocale === 'en' ? copy.langEn : copy.langZh}`}
    >
      {nextLocale === 'en' ? copy.langEn : copy.langZh}
    </Link>
  );
}
