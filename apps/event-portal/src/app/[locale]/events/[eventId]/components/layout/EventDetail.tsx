'use client';

import { useLocale } from 'next-intl';

import {
  EventInfoHeader,
  EventContent,
  EventFAQ,
  EventInfoHeaderSkeleton,
  EventInfoHeaderError,
} from '..';
import { ExhibitionActions } from '../actions/ExhibitionActions';
import { EventSchedule } from '../sessions/EventSchedule';

import { Button, Card } from '@/components';
import { useEvent } from '@/libs/api/hooks/useEvents';
import { demoCopy, useLocalizedRouter } from '@/libs/i18n';

interface EventDetailProps {
  eventId: string;
}

export function EventDetail({ eventId }: EventDetailProps) {
  const router = useLocalizedRouter();
  const locale = useLocale();
  const copy = demoCopy(locale);
  const { data: event, isLoading, error } = useEvent(eventId);

  const handleEventNotFound = () => {
    router.push('/events');
  };

  return (
    <div className='space-y-6'>
      {isLoading ? (
        <EventInfoHeaderSkeleton />
      ) : error ? (
        <EventInfoHeaderError kind='api' locale={locale} />
      ) : !event ? (
        <EventInfoHeaderError kind='not-found' locale={locale} />
      ) : (
        <div className='lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-8'>
          <div className='space-y-6'>
            <EventInfoHeader event={event} eventId={eventId} locale={locale} />
            <div className='lg:hidden'>
              <ExhibitionActions event={event} locale={locale} />
            </div>
            <EventSchedule event={event} locale={locale} />
            <EventContent content={event.content} locale={locale} />
            <EventFAQ faq={event.faq} locale={locale} />
          </div>
          <aside className='hidden lg:sticky lg:top-24 lg:block'>
            <ExhibitionActions event={event} locale={locale} />
          </aside>
        </div>
      )}

      {error || (!event && !isLoading) ? (
        <Card className='p-6 text-center'>
          <Button onClick={handleEventNotFound} variant='primary' size='lg'>
            {copy.browseOthers}
          </Button>
        </Card>
      ) : null}
    </div>
  );
}
