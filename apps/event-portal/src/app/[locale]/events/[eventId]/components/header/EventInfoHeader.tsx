'use client';

import { Image } from '@/components';
import { eventListKind, regionTimeZone } from '@/libs/api/event-stack-map';
import { catalogPriceLabel, demoCopy } from '@/libs/i18n/demo-copy';
import type { EventDetail, EventSpeaker, EventVenue } from '@/types';

interface EventInfoHeaderProps {
  event: EventDetail;
  eventId: string;
  locale?: string;
}

function formatDateRange(
  startsAt: string,
  endsAt: string,
  startTime: string,
  locale: string,
  timeZone: string
): string {
  const dateLocale =
    locale === 'en' ? 'en-US' : locale === 'ja' ? 'ja-JP' : 'zh-TW';
  const localDate = new Intl.DateTimeFormat(dateLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone,
  });
  const localTime = new Intl.DateTimeFormat(dateLocale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone,
  });
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  if (Number.isNaN(start.getTime())) {
    return startTime;
  }
  const sameDay =
    !Number.isNaN(end.getTime()) &&
    localDate.format(start) === localDate.format(end);
  if (Number.isNaN(end.getTime()) || sameDay) {
    const endLabel = Number.isNaN(end.getTime())
      ? ''
      : `–${localTime.format(end)}`;
    return `${localDate.format(start)} ${localTime.format(start)}${endLabel}`;
  }
  return `${localDate.format(start)} – ${localDate.format(end)}`;
}

function osmEmbedSrc(lat: number, lng: number): string {
  const delta = 0.008;
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${encodeURIComponent(`${lat},${lng}`)}`;
}

function osmSearchHref(query: string): string {
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(query)}`;
}

function EventSpeakers({
  speakers,
  locale,
}: {
  speakers: EventSpeaker[];
  locale: string;
}) {
  const copy = demoCopy(locale);
  if (speakers.length === 0) return null;
  return (
    <div className='mt-8'>
      <h2 className='mb-4 text-lg font-semibold text-gray-900'>
        {copy.speakers}
      </h2>
      <ul className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        {speakers.map(speaker => (
          <li
            key={speaker.name}
            className='flex gap-3 rounded-lg border border-gray-100 p-3'
          >
            {speaker.avatarUrl ? (
              <Image
                src={speaker.avatarUrl}
                alt={speaker.name}
                width={56}
                height={56}
                className='h-14 w-14 rounded-full object-cover'
                fallback='/placeholder-event.jpg'
              />
            ) : (
              <span className='flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-lg font-medium text-gray-600'>
                {speaker.name.slice(0, 1)}
              </span>
            )}
            <div>
              <p className='font-medium text-gray-900'>{speaker.name}</p>
              {speaker.title ? (
                <p className='text-sm text-gray-500'>{speaker.title}</p>
              ) : null}
              {speaker.bio ? (
                <p className='mt-1 text-sm text-gray-600'>{speaker.bio}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EventVenueBlock({
  venue,
  locale,
}: {
  venue: EventVenue;
  locale: string;
}) {
  const copy = demoCopy(locale);
  const query = venue.mapQuery;
  const canEmbed =
    typeof venue.lat === 'number' &&
    typeof venue.lng === 'number' &&
    Number.isFinite(venue.lat) &&
    Number.isFinite(venue.lng) &&
    !(venue.lat === 0 && venue.lng === 0);
  if (!query && !venue.transport && !canEmbed && !venue.address) return null;

  return (
    <section className='mt-8 space-y-3' aria-labelledby='event-venue-heading'>
      <h2
        id='event-venue-heading'
        className='text-lg font-semibold text-gray-900'
      >
        {copy.venue}
      </h2>
      {venue.address ? <p className='text-gray-700'>{venue.address}</p> : null}
      {venue.transport ? (
        <p className='text-sm text-gray-600'>{venue.transport}</p>
      ) : null}
      {canEmbed ? (
        <iframe
          title={copy.mapTitle}
          className='h-56 w-full rounded-lg border border-gray-200 bg-gray-100'
          src={osmEmbedSrc(venue.lat as number, venue.lng as number)}
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'
        />
      ) : null}
      {query ? (
        <p>
          <a
            href={osmSearchHref(query)}
            className='text-sm font-medium text-gray-800 underline underline-offset-2 hover:text-gray-950'
            target='_blank'
            rel='noopener noreferrer'
          >
            {copy.openOsm}
            <span className='sr-only'>（{copy.externalLink}）</span>
          </a>
        </p>
      ) : null}
    </section>
  );
}

export function EventInfoHeader({
  event,
  locale = 'zh-TW',
}: EventInfoHeaderProps) {
  const copy = demoCopy(locale);
  const kind = eventListKind(event);
  const domain = event.domainKind ?? 'talk';
  const timeZone = regionTimeZone(event.region, event.timezone);

  return (
    <div className='space-y-6'>
      <article className='overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm'>
        <div className='relative aspect-[16/9] bg-gray-100 sm:aspect-auto sm:h-72'>
          <Image
            src={event.image}
            alt={event.title}
            width={800}
            height={288}
            className='h-full w-full object-cover'
            fallback='/placeholder-event.jpg'
          />
        </div>

        <div className='p-6'>
          <div className='mb-4 flex flex-wrap gap-1.5'>
            {event.region ? (
              <span className='rounded-full bg-gray-900 px-2.5 py-0.5 text-xs font-medium text-white'>
                {copy.region[event.region]}
              </span>
            ) : null}
            <span className='rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800'>
              {copy.domain[domain]}
            </span>
            <span className='rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700'>
              {copy.status[kind]}
            </span>
            {event.sample ? (
              <span className='rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-900'>
                {copy.sampleBadge}
              </span>
            ) : null}
          </div>
          <h1 className='mb-4 text-3xl font-semibold tracking-tight text-gray-900'>
            {event.title}
          </h1>
          {event.plinthLotUrl ? (
            <p className='mb-4'>
              <a
                href={event.plinthLotUrl}
                target='_blank'
                rel='noreferrer'
                className='text-sm font-medium text-gray-800 underline underline-offset-2'
              >
                {copy.plinthLot}
              </a>
            </p>
          ) : null}
          <p className='mb-6 text-lg leading-relaxed text-gray-700'>
            {event.description}
          </p>
          <dl className='grid grid-cols-1 gap-4 text-gray-700 sm:grid-cols-2'>
            <div>
              <dt className='text-xs font-medium uppercase tracking-wide text-gray-500'>
                {copy.when}
              </dt>
              <dd className='mt-1'>
                {formatDateRange(
                  event.startsAt,
                  event.endsAt,
                  event.startTime,
                  locale,
                  timeZone
                )}
              </dd>
            </div>
            <div>
              <dt className='text-xs font-medium uppercase tracking-wide text-gray-500'>
                {copy.price}
              </dt>
              <dd className='mt-1'>{catalogPriceLabel(event, locale)}</dd>
            </div>
            {event.organizerName ? (
              <div>
                <dt className='text-xs font-medium uppercase tracking-wide text-gray-500'>
                  {copy.organizer}
                </dt>
                <dd className='mt-1'>{event.organizerName}</dd>
              </div>
            ) : null}
            {event.location ? (
              <div>
                <dt className='text-xs font-medium uppercase tracking-wide text-gray-500'>
                  {copy.location}
                </dt>
                <dd className='mt-1'>{event.location}</dd>
              </div>
            ) : null}
          </dl>
          <EventSpeakers speakers={event.speakers} locale={locale} />
          <EventVenueBlock venue={event.venue} locale={locale} />
        </div>
      </article>
    </div>
  );
}
