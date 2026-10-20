import { NextResponse } from 'next/server';

import {
  digestRunSummary,
  isCronAuthorized,
  runWeeklyDigest,
} from '../../../../libs/digest';
import { publicSiteUrl } from '../../../../libs/seo/public-site-url';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

function unauthorized() {
  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401, headers: { 'cache-control': 'no-store' } }
  );
}

async function handle(request: Request) {
  if (!isCronAuthorized(request.headers.get('authorization'))) {
    return unauthorized();
  }

  const run = await runWeeklyDigest({
    origin: publicSiteUrl(),
    now: new Date(),
  });

  return NextResponse.json(
    { ok: true, ...digestRunSummary(run) },
    { status: 200, headers: { 'cache-control': 'no-store' } }
  );
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
