import Link from 'next/link';
import { notFound } from 'next/navigation';

import { EventInfoHeaderError } from './components';
import { EventDetail } from './components/layout/EventDetail';

import { LineOfficialCta } from '@/components/line/LineOfficialCta';
import { catalogHref } from '@/libs/api/catalog-query';
import { resolvePortalExhibition } from '@/libs/exhibition-search/load-portal';
import { demoCopy } from '@/libs/i18n/demo-copy';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; eventId: string }>;
}) {
  const { locale, eventId } = await params;
  const copy = demoCopy(locale);
  const resolved = await resolvePortalExhibition(eventId);

  if (resolved.status === 'error') {
    return (
      <div className='space-y-6'>
        <EventInfoHeaderError kind='api' locale={locale} />
        <div className='flex flex-wrap items-center justify-center gap-3'>
          <Link
            href={catalogHref(locale)}
            className='inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800'
          >
            {copy.browseOthers}
          </Link>
          <LineOfficialCta locale={locale} />
        </div>
      </div>
    );
  }

  if (resolved.status === 'missing') {
    notFound();
  }

  return <EventDetail event={resolved.event} locale={locale} />;
}
