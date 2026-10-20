import Link from 'next/link';
import { connection } from 'next/server';

import { EventInfoHeaderError } from './components';
import { EventDetail } from './components/layout/EventDetail';

import { LineOfficialCta } from '@/components/line/LineOfficialCta';
import { fetchPortalEvent } from '@/libs/api/event-stack-fetch';
import { isMissingPortalEvent } from '@/libs/api/portal-event-error';
import { catalogHref } from '@/libs/api/catalog-query';
import { demoCopy } from '@/libs/i18n/demo-copy';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; eventId: string }>;
}) {
  await connection();
  const { locale, eventId } = await params;
  const copy = demoCopy(locale);

  try {
    const event = await fetchPortalEvent(eventId);
    return <EventDetail event={event} locale={locale} />;
  } catch (error) {
    const kind = isMissingPortalEvent(error) ? 'not-found' : 'api';
    return (
      <div className='space-y-6'>
        <EventInfoHeaderError kind={kind} locale={locale} />
        <div className='flex flex-wrap items-center justify-center gap-3'>
          <Link
            href={catalogHref(locale)}
            className='inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800'
          >
            {copy.browseOthers}
          </Link>
          {kind === 'api' ? <LineOfficialCta locale={locale} /> : null}
        </div>
      </div>
    );
  }
}
