import Link from 'next/link';

import { EventStackCards } from '@/app/[locale]/events/components/EventStackCards';
import { catalogHref } from '@/libs/api/catalog-query';
import { demoCopy } from '@/libs/i18n/demo-copy';
import type { Event } from '@/types';

export function FeaturedCities({
  events,
  locale,
}: {
  events: Event[];
  locale: string;
}) {
  const copy = demoCopy(locale);
  const taipei = events.filter(event => event.region === 'TAIPEI').slice(0, 2);
  const tokyo = events.filter(event => event.region === 'TOKYO').slice(0, 2);
  const cities = [
    {
      id: 'TAIPEI' as const,
      title: copy.featuredTaipei,
      items: taipei,
    },
    {
      id: 'TOKYO' as const,
      title: copy.featuredTokyo,
      items: tokyo,
    },
  ];

  return (
    <section className='border-t border-gray-200 bg-white py-14 sm:py-16'>
      <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
        <div className='grid gap-12 lg:grid-cols-2'>
          {cities.map(city => (
            <div key={city.id}>
              <div className='mb-5 flex items-end justify-between gap-3'>
                <h2 className='font-display text-2xl font-semibold tracking-tight text-gray-900'>
                  {city.title}
                </h2>
                <Link
                  href={catalogHref(locale, { city: city.id })}
                  className='shrink-0 text-sm font-medium text-gray-800 underline-offset-2 hover:underline'
                >
                  {copy.seeCity(city.id)}
                </Link>
              </div>
              <EventStackCards
                events={city.items}
                locale={locale}
                layout='stack'
                empty='city'
                emptyQuery={{
                  q: '',
                  city: city.id,
                  dates: 'all',
                  category: '',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
