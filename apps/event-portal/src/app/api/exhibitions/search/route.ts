import { NextResponse } from 'next/server';

import {
  hitToJson,
  parseExhibitionSearchParams,
  searchExhibitions,
} from '../../../../libs/exhibition-search';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
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
