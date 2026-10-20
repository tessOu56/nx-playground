'use client';

import { Image } from '@/components';
import { PLACEHOLDER_EVENT_IMAGE } from '@/libs/api/catalog-image';
import { eventListKind, regionTimeZone } from '@/libs/api/event-stack-map';
import { catalogPriceLabel, demoCopy } from '@/libs/i18n/demo-copy';
import type { EventDetail, EventSpeaker, EventVenue } from '@/types';

interface EventInfoHeaderProps {
  event: EventDetail;
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
      <h2 className='mb-4 text-lg font-semibold text-foreground'>
        {copy.speakers}
      </h2>
      <ul className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        {speakers.map(speaker => (
          <li
            key={speaker.name}
            className='flex gap-3 rounded-lg border border-border p-3'
          >
            {speaker.avatarUrl ? (
              <Image
                src={speaker.avatarUrl}
                alt={speaker.name}
                width={56}
                height={56}
                className='h-14 w-14 rounded-full object-cover'
                fallback={PLACEHOLDER_EVENT_IMAGE}
              />
            ) : (
              <span className='flex h-14 w-14 items-center justify-center rounded-full bg-muted text-lg font-medium text-muted-foreground'>
                {speaker.name.slice(0, 1)}
              </span>
            )}
            <div>
              <p className='font-medium text-foreground'>{speaker.name}</p>
              {speaker.title ? (
                <p className='text-sm text-muted-foreground'>{speaker.title}</p>
              ) : null}
              {speaker.bio ? (
                <p className='mt-1 text-sm text-muted-foreground'>{speaker.bio}</p>
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
        className='text-lg font-semibold text-foreground'
      >
        {copy.venue}
      </h2>
      {venue.address ? <p className='text-foreground'>{venue.address}</p> : null}
      {venue.transport ? (
        <p className='text-sm text-muted-foreground'>{venue.transport}</p>
      ) : null}
      {canEmbed ? (
        <iframe
          title={copy.mapTitle}
          className='h-56 w-full rounded-lg border border-border bg-muted'
          src={osmEmbedSrc(venue.lat as number, venue.lng as number)}
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'
        />
      ) : null}
      {query ? (
        <p>
          <a
            href={osmSearchHref(query)}
            className='text-sm font-medium text-foreground underline underline-offset-2 hover:text-foreground'
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

function Fact({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
        {label}
      </dt>
      <dd className='mt-1 text-sm leading-6 text-foreground sm:text-base'>{value}</dd>
    </div>
  );
}

export function EventInfoHeader({
  event,
  locale = 'zh-TW',
}: EventInfoHeaderProps) {
  const copy = demoCopy(locale);
  const kind = eventListKind(event);
  const domain = event.domainKind ?? 'exhibition';
  const timeZone = regionTimeZone(event.region, event.timezone);
  const ended = kind === 'completed' || kind === 'sale_ended';
  const dateLabel = formatDateRange(
    event.startsAt,
    event.endsAt,
    event.startTime,
    locale,
    timeZone
  );

  return (
    <div className='space-y-6'>
      <article className='overflow-hidden rounded-xl border border-border bg-card shadow-sm'>
        <div className='relative aspect-[16/9] bg-muted sm:aspect-auto sm:h-72'>
          <Image
            src={event.image}
            alt={event.title}
            width={1200}
            height={675}
            sizes='(max-width: 1024px) 100vw, 800px'
            priority
            className='h-full w-full object-cover'
            fallback={PLACEHOLDER_EVENT_IMAGE}
          />
        </div>

        <div className='p-5 sm:p-6'>
          <div className='mb-3 flex flex-wrap gap-1.5'>
            {event.region ? (
              <span className='rounded-full bg-foreground px-2.5 py-0.5 text-xs font-medium text-background'>
                {copy.region[event.region]}
              </span>
            ) : null}
            <span className='rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground'>
              {copy.domain[domain]}
            </span>
            <span className='rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground'>
              {copy.status[kind]}
            </span>
            {event.sample ? (
              <span className='rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-900'>
                {copy.sampleBadge}
              </span>
            ) : null}
          </div>
          <h1 className='font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl'>
            {event.title}
          </h1>
          <dl className='mt-4 grid grid-cols-1 gap-4 border-y border-border py-4 sm:grid-cols-2'>
            <Fact label={copy.when} value={dateLabel} />
            <Fact label={copy.price} value={catalogPriceLabel(event, locale)} />
            {event.location ? (
              <Fact label={copy.location} value={event.location} />
            ) : null}
            {event.organizerName ? (
              <Fact label={copy.organizer} value={event.organizerName} />
            ) : null}
          </dl>
          {ended ? (
            <div
              className='mt-4 rounded-lg border border-border bg-muted px-4 py-3'
              role='status'
              data-testid='exhibition-ended-notice'
            >
              <p className='text-sm font-semibold text-foreground'>
                {copy.endedNotice}
              </p>
              <p className='mt-1 text-sm leading-6 text-muted-foreground'>
                {copy.endedNoticeHint}
              </p>
            </div>
          ) : null}
          {event.description ? (
            <p className='mt-5 text-base leading-7 text-foreground'>
              {event.description}
            </p>
          ) : null}
          {event.sourceUrl ? (
            <p className='mt-4'>
              <a
                href={event.sourceUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='text-sm font-medium text-foreground underline underline-offset-2 hover:text-foreground'
              >
                {copy.officialSource}
                <span className='sr-only'>（{copy.externalLink}）</span>
              </a>
            </p>
          ) : null}
          {event.plinthLotUrl ? (
            <p className='mt-3'>
              <a
                href={event.plinthLotUrl}
                target='_blank'
                rel='noreferrer'
                className='text-sm font-medium text-foreground underline underline-offset-2'
              >
                {copy.plinthLot}
              </a>
            </p>
          ) : null}
          <EventSpeakers speakers={event.speakers} locale={locale} />
          <EventVenueBlock venue={event.venue} locale={locale} />
        </div>
      </article>
    </div>
  );
}
