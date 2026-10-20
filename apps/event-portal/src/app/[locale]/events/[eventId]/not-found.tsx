import Link from 'next/link';
import { getLocale } from 'next-intl/server';

import { EventInfoHeaderError } from './components';

import { LineOfficialCta } from '@/components/line/LineOfficialCta';
import { DEFAULT_LOCALE } from '@/libs/constants';
import { catalogHref } from '@/libs/api/catalog-query';
import { demoCopy } from '@/libs/i18n/demo-copy';

export default async function ExhibitionNotFound() {
  let locale: string = DEFAULT_LOCALE;
  try {
    locale = await getLocale();
  } catch {
    locale = DEFAULT_LOCALE;
  }
  const copy = demoCopy(locale);

  return (
    <div className='space-y-6'>
      <EventInfoHeaderError kind='not-found' locale={locale} />
      <div className='flex flex-wrap items-center justify-center gap-3'>
        <Link
          href={catalogHref(locale)}
          className='inline-flex items-center justify-center rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background hover:opacity-90'
        >
          {copy.browseOthers}
        </Link>
        <LineOfficialCta locale={locale} />
      </div>
    </div>
  );
}
