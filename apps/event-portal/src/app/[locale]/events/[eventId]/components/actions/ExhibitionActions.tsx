import { LineOfficialCta } from '@/components/line/LineOfficialCta';
import { demoCopy } from '@/libs/i18n/demo-copy';
import type { EventDetail } from '@/types';

export function ExhibitionActions({
  event,
  locale,
}: {
  event: EventDetail;
  locale: string;
}) {
  const copy = demoCopy(locale);

  return (
    <aside
      className='rounded-xl border border-gray-200 bg-white p-5 shadow-sm'
      aria-label={copy.step3Title}
    >
      <h2 className='text-base font-semibold tracking-tight text-gray-900'>
        {copy.step3Title}
      </h2>
      <p className='mt-1 text-sm leading-6 text-gray-600'>
        {event.sourceUrl ? copy.officialSourceHint : copy.lineChatHint}
      </p>
      <div className='mt-4 space-y-3'>
        {event.sourceUrl ? (
          <a
            href={event.sourceUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex w-full items-center justify-center rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800'
            aria-label={`${copy.officialSource}（${copy.externalLink}）`}
          >
            {copy.officialSource}
          </a>
        ) : null}
        <LineOfficialCta locale={locale} variant='panel' />
      </div>
      {event.sample ? (
        <p className='mt-4 text-xs leading-5 text-amber-900'>{copy.sampleHint}</p>
      ) : null}
    </aside>
  );
}
