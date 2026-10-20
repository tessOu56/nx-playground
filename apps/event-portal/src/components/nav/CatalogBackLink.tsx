'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import {
  catalogPath,
  readRememberedCatalogHref,
} from '@/libs/api/catalog-query';

export function CatalogBackLink({
  locale,
  label,
}: {
  locale: string;
  label: string;
}) {
  const fallback = catalogPath(locale);
  const [href, setHref] = useState(fallback);

  useEffect(() => {
    setHref(readRememberedCatalogHref(locale, fallback));
  }, [fallback, locale]);

  return (
    <div className='mb-4'>
      <Link
        href={href}
        aria-label={label}
        className='inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted'
      >
        ← {label}
      </Link>
    </div>
  );
}
