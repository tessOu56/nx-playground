import {
  EventInfoHeader,
  EventContent,
  EventFAQ,
} from '..';
import { ExhibitionActions } from '../actions/ExhibitionActions';
import { EventSchedule } from '../sessions/EventSchedule';

import { ExhibitionJsonLd } from '@/libs/seo/exhibition-jsonld';
import type { EventDetail as EventDetailModel } from '@/types';

export function EventDetail({
  event,
  locale,
}: {
  event: EventDetailModel;
  locale: string;
}) {
  return (
    <>
      <ExhibitionJsonLd event={event} locale={locale} />
      <div className='lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-8'>
        <div className='space-y-6'>
          <EventInfoHeader event={event} eventId={event.id} locale={locale} />
          <div className='lg:hidden'>
            <ExhibitionActions event={event} locale={locale} />
          </div>
          <EventSchedule event={event} locale={locale} />
          <EventContent content={event.content} locale={locale} />
          <EventFAQ faq={event.faq} locale={locale} />
        </div>
        <aside className='mt-6 hidden lg:sticky lg:top-24 lg:mt-0 lg:block'>
          <ExhibitionActions event={event} locale={locale} />
        </aside>
      </div>
    </>
  );
}
