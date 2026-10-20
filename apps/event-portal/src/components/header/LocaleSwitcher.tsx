'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

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

function localeHref(
  pathname: string,
  nextLocale: string,
  search: string
): string {
  const path = replaceLocale(pathname, nextLocale);
  return search ? `${path}?${search}` : path;
}

function LocaleSwitcherNav({
  locale,
  search,
}: {
  locale: string;
  search: string;
}) {
  const pathname = usePathname() || `/${locale}`;
  const copy = demoCopy(locale);

  return (
    <nav aria-label={copy.language} className='flex items-center gap-0.5'>
      {SUPPORTED_LOCALES.map(item => {
        const active = item === locale;
        return (
          <Link
            key={item}
            href={localeHref(pathname, item, search)}
            hrefLang={item}
            lang={item}
            aria-current={active ? 'page' : undefined}
            className={[
              'rounded-md px-1.5 py-1 text-xs font-medium sm:px-2 sm:text-sm',
              active
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-800 hover:bg-gray-100 hover:text-gray-900',
            ].join(' ')}
          >
            {localeLabel(item, copy)}
          </Link>
        );
      })}
    </nav>
  );
}

function LocaleSwitcherWithSearch({ locale }: { locale: string }) {
  const searchParams = useSearchParams();
  return (
    <LocaleSwitcherNav locale={locale} search={searchParams.toString()} />
  );
}

export function LocaleSwitcher({ locale }: { locale: string }) {
  return (
    <Suspense fallback={<LocaleSwitcherNav locale={locale} search='' />}>
      <LocaleSwitcherWithSearch locale={locale} />
    </Suspense>
  );
}
