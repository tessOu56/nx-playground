'use client';

import { Image } from '@/components';
import { eventListKind } from '@/libs/api/event-stack-map';
import { demoCopy, priceFromLabel } from '@/libs/i18n/demo-copy';
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
  locale: string
): string {
  const dateLocale = locale === 'en' ? 'en-US' : 'zh-TW';
  const taipeiDate = new Intl.DateTimeFormat(dateLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Taipei',
  });
  const taipeiTime = new Intl.DateTimeFormat(dateLocale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Taipei',
  });
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  if (Number.isNaN(start.getTime())) {
    return startTime;
  }
  const sameDay =
    !Number.isNaN(end.getTime()) &&
    taipeiDate.format(start) === taipeiDate.format(end);
  if (Number.isNaN(end.getTime()) || sameDay) {
    const endLabel = Number.isNaN(end.getTime()) ? '' : `–${taipeiTime.format(end)}`;
    return `${taipeiDate.format(start)} ${taipeiTime.format(start)}${endLabel}`;
  }
  return `${taipeiDate.format(start)} ${taipeiTime.format(start)} – ${taipeiDate.format(end)} ${taipeiTime.format(end)}`;
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
      <h2 className='text-lg font-semibold text-gray-900 mb-4'>{copy.speakers}</h2>
      <ul className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
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
    Number.isFinite(venue.lng);
  if (!query && !venue.transport && !canEmbed && !venue.address) return null;

  return (
    <div className='mt-8 space-y-3'>
      <h2 className='text-lg font-semibold text-gray-900'>{copy.venue}</h2>
      {venue.address ? (
        <p className='text-gray-700'>{venue.address}</p>
      ) : null}
      {venue.transport ? (
        <p className='text-sm text-gray-600'>{venue.transport}</p>
      ) : null}
      {canEmbed ? (
        <iframe
          title={copy.mapTitle}
          className='h-56 w-full rounded-lg border border-gray-200'
          src={osmEmbedSrc(venue.lat as number, venue.lng as number)}
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'
        />
      ) : null}
      {query ? (
        <p>
          <a
            href={osmSearchHref(query)}
            className='text-sm font-medium text-blue-700 hover:underline'
            target='_blank'
            rel='noreferrer'
          >
            {copy.openOsm}
          </a>
        </p>
      ) : null}
    </div>
  );
}

export function EventInfoHeader({
  event,
  locale = 'zh-TW',
}: EventInfoHeaderProps) {
  const copy = demoCopy(locale);
  const kind = eventListKind(event);
  const domain = event.domainKind ?? 'talk';

  return (
    <div className='space-y-6'>
      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        <div className='h-64 relative'>
          <Image
            src={event.image}
            alt={event.title}
            width={800}
            height={256}
            className='w-full h-full object-cover'
            fallback='/placeholder-event.jpg'
          />
          <div className='absolute top-4 left-4 bg-indigo-600/90 backdrop-blur-sm px-3 py-1 rounded-full'>
            <span className='text-sm font-medium text-white'>
              {copy.domain[domain]}
            </span>
          </div>
          <div className='absolute top-4 right-4 bg-black/70 px-3 py-1 rounded-full'>
            <span className='text-sm font-medium text-white'>
              {copy.status[kind]}
            </span>
          </div>
        </div>

        <div className='p-6'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>
            {event.title}
          </h1>
          {event.plinthLotUrl ? (
            <p className='mb-4'>
              <a
                href={event.plinthLotUrl}
                target='_blank'
                rel='noreferrer'
                className='text-sm font-medium text-indigo-700 underline'
              >
                {copy.plinthLot}
              </a>
            </p>
          ) : null}
          <p className='text-gray-600 mb-6 text-lg leading-relaxed'>
            {event.description}
          </p>
          <dl className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700'>
            <div>
              <dt className='text-xs uppercase tracking-wide text-gray-500'>
                {copy.when}
              </dt>
              <dd>
                {formatDateRange(
                  event.startsAt,
                  event.endsAt,
                  event.startTime,
                  locale
                )}
              </dd>
            </div>
            <div>
              <dt className='text-xs uppercase tracking-wide text-gray-500'>
                {copy.price}
              </dt>
              <dd>{priceFromLabel(event.price, locale)}</dd>
            </div>
            <div>
              <dt className='text-xs uppercase tracking-wide text-gray-500'>
                {copy.organizer}
              </dt>
              <dd>{event.organizerName}</dd>
            </div>
            <div>
              <dt className='text-xs uppercase tracking-wide text-gray-500'>
                {copy.seatsLeft}
              </dt>
              <dd>{event.remainingSeats.toLocaleString('zh-TW')}</dd>
            </div>
            <div className='sm:col-span-2'>
              <dt className='text-xs uppercase tracking-wide text-gray-500'>
                {copy.location}
              </dt>
              <dd>{event.location}</dd>
            </div>
          </dl>
          <EventSpeakers speakers={event.speakers} locale={locale} />
          <EventVenueBlock venue={event.venue} locale={locale} />
        </div>
      </div>
    </div>
  );
}
