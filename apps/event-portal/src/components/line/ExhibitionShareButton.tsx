'use client';

import { useState } from 'react';

import { demoCopy } from '@/libs/i18n/demo-copy';
import {
  exhibitionShareText,
  exhibitionShareUrl,
  lineTextShareHref,
} from '@/libs/line/exhibition-share';

export function ExhibitionShareButton({
  locale,
  eventId,
  title,
}: {
  locale: string;
  eventId: string;
  title: string;
}) {
  const copy = demoCopy(locale);
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const url = exhibitionShareUrl(locale, eventId);
  const text = exhibitionShareText(title, url);

  async function share() {
    setStatus('idle');
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        await navigator.share({ title, text, url });
        return;
      }
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setStatus('copied');
        return;
      }
      window.open(lineTextShareHref(text), '_blank', 'noopener,noreferrer');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setStatus('error');
    }
  }

  const label =
    status === 'copied'
      ? copy.linkCopied
      : status === 'error'
        ? copy.shareFailed
        : copy.shareListing;

  return (
    <div>
      <button
        type='button'
        onClick={() => void share()}
        className='inline-flex w-full items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium text-gray-800 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
        aria-live='polite'
      >
        {label}
      </button>
      {status === 'error' ? (
        <p className='mt-2 text-xs leading-5 text-red-800' role='status'>
          {copy.shareFailed}
        </p>
      ) : status === 'copied' ? (
        <p className='mt-2 text-xs leading-5 text-gray-600' role='status'>
          {copy.linkCopied}
        </p>
      ) : null}
    </div>
  );
}
