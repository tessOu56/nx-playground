import { Card } from '@/components';
import { regionTimeZone } from '@/libs/api/event-stack-map';
import { demoCopy } from '@/libs/i18n/demo-copy';
import type { EventDetail } from '@/types';

function formatSessionDate(date: string, locale: string, timeZone: string): string {
  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return date;
  const dateLocale =
    locale === 'en' ? 'en-US' : locale === 'ja' ? 'ja-JP' : 'zh-TW';
  return new Intl.DateTimeFormat(dateLocale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone,
  }).format(parsed);
}

export function EventSchedule({
  event,
  locale,
}: {
  event: EventDetail;
  locale: string;
}) {
  const copy = demoCopy(locale);
  if (event.domainKind === 'exhibition' || !event.sessions?.length) {
    return null;
  }

  const timeZone = regionTimeZone(event.region, event.timezone);

  return (
    <Card className='p-5'>
      <h2 className='mb-4 text-base font-semibold text-gray-900'>
        {copy.sessions}
      </h2>
      <ol className='space-y-3'>
        {event.sessions.map(session => (
          <li
            key={session.id}
            className='rounded-lg border border-gray-200 px-4 py-3'
          >
            <p className='font-medium text-gray-900'>{session.name}</p>
            <p className='mt-1 text-sm text-gray-600'>
              {formatSessionDate(session.date, locale, timeZone)}
              {session.time ? ` · ${session.time}` : ''}
            </p>
          </li>
        ))}
      </ol>
    </Card>
  );
}
