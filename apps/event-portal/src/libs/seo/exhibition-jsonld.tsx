import type { EventDetail } from '@/types';
import { catalogImageSrc, PLACEHOLDER_EVENT_IMAGE } from '@/libs/api/catalog-image';
import { exhibitionShareUrl } from '@/libs/line/exhibition-share';

export function ExhibitionJsonLd({
  event,
  locale,
}: {
  event: EventDetail;
  locale: string;
}) {
  const image = catalogImageSrc(event.image);
  const country =
    event.region === 'TOKYO' ? 'JP' : event.region === 'TAIPEI' ? 'TW' : undefined;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ExhibitionEvent',
    name: event.title,
    description: event.description || undefined,
    startDate: event.startsAt,
    endDate: event.endsAt,
    url: exhibitionShareUrl(locale, event.id),
    image: image !== PLACEHOLDER_EVENT_IMAGE ? image : undefined,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: event.location
      ? {
          '@type': 'Place',
          name: event.location,
          address: country
            ? { '@type': 'PostalAddress', addressCountry: country }
            : undefined,
        }
      : undefined,
    organizer: event.organizerName
      ? { '@type': 'Organization', name: event.organizerName }
      : undefined,
    offers: event.sourceUrl
      ? {
          '@type': 'Offer',
          url: event.sourceUrl,
          availability: 'https://schema.org/InStock',
        }
      : undefined,
  };

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
      }}
    />
  );
}
