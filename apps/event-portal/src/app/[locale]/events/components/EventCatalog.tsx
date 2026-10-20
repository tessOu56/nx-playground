'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { CatalogSearchStatus } from './CatalogSearchStatus';
import { EventCatalogSkeleton } from './EventCatalogSkeleton';
import { EventStackCards } from './EventStackCards';

import { Input } from '@/components';
import { type DateFilter, uniqueCategories } from '@/libs/api/catalog-filters';
import {
  catalogEmptyKind,
  catalogQueryString,
  commitSearchText,
  MAX_QUERY_TEXT,
  parseCatalogQuery,
  rememberCatalogHref,
  sameCatalogQuery,
  type CatalogQuery,
} from '@/libs/api/catalog-query';
import {
  SEARCH_DEBOUNCE_MS,
  SEARCH_PENDING_MS,
  SEARCH_SLOW_MS,
  catalogSearchErrorFromStatus,
  isAbortError,
  parseRetryAfterSec,
  type CatalogSearchErrorKind,
} from '@/libs/api/catalog-search-ui';
import { demoCopy } from '@/libs/i18n/demo-copy';
import type { Event } from '@/types';

function chipClass(active: boolean): string {
  return [
    'min-h-11 rounded-full px-3 py-1.5 text-sm font-medium transition-colors motion-reduce:transition-none sm:min-h-9',
    active
      ? 'bg-foreground text-background'
      : 'bg-card text-foreground ring-1 ring-inset ring-border hover:bg-muted',
  ].join(' ');
}

export function EventCatalog({
  events,
  catalog,
  locale,
}: {
  events: Event[];
  catalog?: Event[];
  locale: string;
}) {
  const copy = demoCopy(locale);
  const router = useRouter();
  const pathname = usePathname() || `/${locale}/events`;
  const searchParams = useSearchParams();
  const filters = useMemo(
    () => parseCatalogQuery(searchParams),
    [searchParams]
  );
  const source = catalog ?? events;
  const categories = useMemo(() => uniqueCategories(source), [source]);
  const [results, setResults] = useState(events);
  const [draftQ, setDraftQ] = useState(filters.q);
  const [pending, setPending] = useState(false);
  const [slow, setSlow] = useState(false);
  const [error, setError] = useState<CatalogSearchErrorKind | null>(null);
  const [retryAfterSec, setRetryAfterSec] = useState<number | null>(null);
  const [retryNonce, setRetryNonce] = useState(0);
  const filtersRef = useRef(filters);
  const skipUrlSync = useRef(false);
  const composing = useRef(false);
  const lastOkQs = useRef<string | null>(null);

  filtersRef.current = filters;
  if (lastOkQs.current === null) {
    lastOkQs.current = catalogQueryString(filters);
  }

  useEffect(() => {
    setResults(events);
    lastOkQs.current = catalogQueryString(filtersRef.current);
    setPending(false);
    setSlow(false);
    setError(null);
  }, [events]);

  useEffect(() => {
    if (skipUrlSync.current) {
      skipUrlSync.current = false;
      setDraftQ(prev =>
        commitSearchText(prev) === filters.q ? prev : filters.q
      );
      return;
    }
    setDraftQ(filters.q);
  }, [filters.q]);

  const applyQuery = useCallback(
    (query: CatalogQuery, history: 'replace' | 'push') => {
      const next: CatalogQuery = {
        ...query,
        q: commitSearchText(query.q),
        category: commitSearchText(query.category),
      };
      if (sameCatalogQuery(next, filtersRef.current)) return;
      skipUrlSync.current = true;
      const qs = catalogQueryString(next);
      const href = qs ? `${pathname}?${qs}` : pathname;
      rememberCatalogHref(locale, href);
      if (history === 'push') {
        router.push(href, { scroll: false });
      } else {
        router.replace(href, { scroll: false });
      }
    },
    [locale, pathname, router]
  );

  useEffect(() => {
    const committed = commitSearchText(draftQ);
    if (committed === filtersRef.current.q) return;
    const timer = window.setTimeout(() => {
      if (composing.current) return;
      applyQuery({ ...filtersRef.current, q: committed }, 'replace');
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [applyQuery, draftQ]);

  useEffect(() => {
    const qs = catalogQueryString(filters);
    const href = qs ? `${pathname}?${qs}` : pathname;
    rememberCatalogHref(locale, href);
  }, [filters, locale, pathname]);

  useEffect(() => {
    const qs = catalogQueryString(filters);
    const controller = new AbortController();
    let pendingTimer: number | undefined;
    let slowTimer: number | undefined;
    let cancelled = false;

    const backgroundRefresh = lastOkQs.current === qs;
    if (!backgroundRefresh) {
      pendingTimer = window.setTimeout(() => {
        if (!cancelled) setPending(true);
        slowTimer = window.setTimeout(() => {
          if (!cancelled) setSlow(true);
        }, SEARCH_SLOW_MS);
      }, SEARCH_PENDING_MS);
    }

    void (async () => {
      try {
        const response = await fetch(
          `/api/exhibitions/search?${qs}${qs ? '&' : ''}limit=48`,
          { signal: controller.signal, cache: 'no-store' }
        );
        if (cancelled) return;
        const kind = catalogSearchErrorFromStatus(response.status);
        if (kind) {
          setError(kind);
          setRetryAfterSec(
            parseRetryAfterSec(response.headers.get('retry-after'))
          );
          if (lastOkQs.current !== qs) setResults([]);
          return;
        }
        const body = (await response.json()) as { items?: Event[] };
        if (!Array.isArray(body.items)) {
          setError('generic');
          setRetryAfterSec(null);
          if (lastOkQs.current !== qs) setResults([]);
          return;
        }
        lastOkQs.current = qs;
        setError(null);
        setRetryAfterSec(null);
        setResults(body.items);
      } catch (caught) {
        if (cancelled || isAbortError(caught)) return;
        setError('network');
        setRetryAfterSec(null);
        if (lastOkQs.current !== qs) setResults([]);
      } finally {
        if (!cancelled) {
          setPending(false);
          setSlow(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(pendingTimer);
      if (slowTimer) window.clearTimeout(slowTimer);
      controller.abort();
    };
  }, [filters, retryNonce]);

  const setFilters = (
    next: Partial<CatalogQuery>,
    history: 'replace' | 'push' = 'push'
  ) => {
    applyQuery(
      {
        ...filters,
        q: commitSearchText(draftQ),
        ...next,
      },
      history
    );
  };

  const emptyKind = catalogEmptyKind({
    total: source.length,
    filtered: results.length,
    query: filters,
  });

  const hasActiveFilters =
    filters.q.length > 0 ||
    filters.city !== 'all' ||
    filters.dates !== 'all' ||
    filters.category.length > 0;

  const clearFilters = () => {
    setDraftQ('');
    setFilters({ q: '', city: 'all', dates: 'all', category: '' }, 'push');
  };

  const onSearchChange = (value: string) => {
    setDraftQ(value.slice(0, MAX_QUERY_TEXT));
  };

  const flushSearch = () => {
    applyQuery({ ...filters, q: draftQ }, 'replace');
  };

  const clearSearch = () => {
    setDraftQ('');
    applyQuery({ ...filters, q: '' }, 'replace');
  };

  const showSkeleton = pending && results.length === 0 && !error;
  const showEmpty = !pending && !error && results.length === 0;

  return (
    <div className='space-y-6'>
      <form
        className='space-y-4'
        role='search'
        aria-label={copy.searchEvents}
        onSubmit={event => {
          event.preventDefault();
          flushSearch();
        }}
      >
        <div>
          <label
            htmlFor='event-search'
            className='mb-1.5 block text-sm font-medium text-gray-800'
          >
            {copy.searchEvents}
          </label>
          <div className='relative'>
            <Input
              id='event-search'
              name='q'
              type='search'
              value={draftQ}
              onChange={event => onSearchChange(event.target.value)}
              onCompositionStart={() => {
                composing.current = true;
              }}
              onCompositionEnd={event => {
                composing.current = false;
                onSearchChange(event.currentTarget.value);
                applyQuery(
                  { ...filters, q: event.currentTarget.value },
                  'replace'
                );
              }}
              onKeyDown={event => {
                if (event.key === 'Escape' && draftQ) {
                  event.preventDefault();
                  clearSearch();
                }
              }}
              placeholder={copy.searchEventsPlaceholder}
              className='h-11 w-full pr-12 text-base sm:h-10 sm:text-sm'
              autoComplete='off'
              enterKeyHint='search'
              maxLength={MAX_QUERY_TEXT}
              spellCheck={false}
              aria-describedby='event-search-hint event-search-kbd'
              aria-controls='catalog-results'
            />
            {draftQ ? (
              <button
                type='button'
                onClick={clearSearch}
                className='absolute right-1.5 top-1/2 min-h-9 min-w-9 -translate-y-1/2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                aria-label={copy.clearSearch}
              >
                ×
              </button>
            ) : null}
          </div>
          <div className='mt-1.5 flex items-start justify-between gap-3'>
            <p
              id='event-search-hint'
              className='text-xs leading-5 text-gray-500'
            >
              {copy.searchHint}
            </p>
            <p id='event-search-kbd' className='sr-only'>
              {copy.searchKeyboardHint}
            </p>
            {draftQ.length >= 64 ? (
              <p className='shrink-0 text-xs tabular-nums text-gray-500'>
                {copy.queryLimit(draftQ.length, MAX_QUERY_TEXT)}
              </p>
            ) : null}
          </div>
        </div>

        <fieldset className='space-y-2'>
          <legend className='text-sm font-medium text-gray-800'>
            {copy.filterCity}
          </legend>
          <div className='flex flex-wrap gap-2'>
            {(
              [
                ['all', copy.allCities],
                ['TAIPEI', copy.region.TAIPEI],
                ['TOKYO', copy.region.TOKYO],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type='button'
                className={chipClass(filters.city === value)}
                aria-pressed={filters.city === value}
                onClick={() => setFilters({ city: value }, 'push')}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className='grid gap-4 sm:grid-cols-2'>
          <div>
            <label
              htmlFor='event-dates'
              className='mb-1.5 block text-sm font-medium text-gray-800'
            >
              {copy.filterStatus}
            </label>
            <select
              id='event-dates'
              value={filters.dates}
              onChange={event =>
                setFilters({ dates: event.target.value as DateFilter }, 'push')
              }
              className='flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-base text-gray-800 sm:h-10 sm:text-sm'
            >
              <option value='all'>{copy.allEvents}</option>
              <option value='now'>{copy.nowShowing}</option>
              <option value='upcoming'>{copy.upcoming}</option>
              <option value='month'>{copy.thisMonth}</option>
              <option value='past'>{copy.pastEvents}</option>
            </select>
          </div>
          {categories.length > 0 ? (
            <div>
              <label
                htmlFor='event-category'
                className='mb-1.5 block text-sm font-medium text-gray-800'
              >
                {copy.filterCategory}
              </label>
              <select
                id='event-category'
                value={filters.category}
                onChange={event =>
                  setFilters({ category: event.target.value }, 'push')
                }
                className='flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-base text-gray-800 sm:h-10 sm:text-sm'
              >
                <option value=''>{copy.allCategories}</option>
                {categories.map(item => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>
      </form>

      <div className='flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600'>
        <p aria-live='polite'>{copy.eventCount(results.length)}</p>
        {hasActiveFilters ? (
          <button
            type='button'
            onClick={clearFilters}
            className='min-h-9 font-medium text-gray-800 underline-offset-2 hover:underline'
          >
            {copy.clearFilters}
          </button>
        ) : null}
      </div>

      <CatalogSearchStatus
        locale={locale}
        pending={pending}
        slow={slow}
        error={error}
        retryAfterSec={retryAfterSec}
        onRetry={() => setRetryNonce(value => value + 1)}
      />

      <div
        id='catalog-results'
        aria-busy={pending}
        aria-label={copy.resultsLabel}
        className={
          pending && results.length > 0
            ? 'opacity-70 transition-opacity motion-reduce:transition-none'
            : undefined
        }
      >
        {showSkeleton ? (
          <EventCatalogSkeleton showFilters={false} />
        ) : showEmpty || results.length > 0 ? (
          <EventStackCards
            events={showEmpty ? [] : results}
            locale={locale}
            empty={emptyKind ?? 'catalog'}
            emptyQuery={filters}
            highlightQuery={filters.q}
            onClearFilters={hasActiveFilters ? clearFilters : undefined}
          />
        ) : null}
      </div>
    </div>
  );
}
