import Link from 'next/link';

import { LineOfficialCta } from '@/components/line/LineOfficialCta';
import { catalogHref } from '@/libs/api/catalog-query';
import { demoCopy } from '@/libs/i18n/demo-copy';
import { lineOfficialAccountId } from '@/libs/line/official-account';

export function SiteFooter({ locale }: { locale: string }) {
  const copy = demoCopy(locale);

  return (
    <footer className='border-t border-border bg-card'>
      <div className='mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-6'>
        <div className='max-w-md'>
          <p className='text-sm font-semibold tracking-tight text-foreground'>
            {copy.siteName}
          </p>
          <p className='mt-2 text-sm leading-6 text-muted-foreground'>{copy.footerNote}</p>
          <p className='mt-1 text-xs text-muted-foreground'>{lineOfficialAccountId()}</p>
        </div>
        <nav
          className='flex flex-wrap items-center gap-3'
          aria-label={copy.mainNav}
        >
          <Link
            href={catalogHref(locale)}
            className='text-sm font-medium text-foreground underline-offset-2 hover:underline'
          >
            {copy.navEvents}
          </Link>
          <Link
            href={catalogHref(locale, { city: 'TAIPEI' })}
            className='text-sm font-medium text-foreground underline-offset-2 hover:underline'
          >
            {copy.region.TAIPEI}
          </Link>
          <Link
            href={catalogHref(locale, { city: 'TOKYO' })}
            className='text-sm font-medium text-foreground underline-offset-2 hover:underline'
          >
            {copy.region.TOKYO}
          </Link>
          <LineOfficialCta locale={locale} variant='nav' />
        </nav>
      </div>
    </footer>
  );
}
