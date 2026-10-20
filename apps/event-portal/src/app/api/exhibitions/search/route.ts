import { NextResponse } from 'next/server';

import {
  hitToJson,
  parseExhibitionSearchParams,
  searchExhibitions,
} from '../../../../libs/exhibition-search';
import {
  clientIp,
  consumeSearchRateLimit,
  searchRateLimitDisabled,
} from '../../../../libs/exhibition-search/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_SEARCH = 2048;

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.search.length > MAX_SEARCH) {
    return NextResponse.json(
      { error: 'Query too long' },
      { status: 414, headers: { 'cache-control': 'no-store' } }
    );
  }

  if (!searchRateLimitDisabled()) {
    const limited = consumeSearchRateLimit(clientIp(request));
    if (!limited.ok) {
      return NextResponse.json(
        { error: 'Too many requests' },
        {
          status: 429,
          headers: {
            'cache-control': 'no-store',
            'retry-after': String(limited.retryAfterSec),
          },
        }
      );
    }
  }

  const now = new Date();
  const input = parseExhibitionSearchParams(url.searchParams, now);
  const result = await searchExhibitions(input);

  return NextResponse.json(
    {
      source: result.source,
      total: result.items.length,
      query: {
        q: input.keyword,
        region: input.region ?? null,
        dates: input.dateMode ?? 'all',
        category: input.category ?? '',
      },
      items: result.items.map(hitToJson),
    },
    {
      status: 200,
      headers: { 'cache-control': 'no-store' },
    }
  );
}
