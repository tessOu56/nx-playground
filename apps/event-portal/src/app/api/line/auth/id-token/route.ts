import { type NextRequest, NextResponse } from 'next/server';

import { isAllowedPortalOrigin } from '../../../../../libs/line/request-origin';
import {
  LineIdTokenVerificationError,
  verifyLineIdToken,
} from '../../../../../libs/line/verify-id-token';

export const dynamic = 'force-dynamic';

const LEFTOVER_CHANNEL_IDS = new Set(['2007835339']);

function ownerChannelId(value: string | undefined): string {
  const trimmed = value?.trim() ?? '';
  if (!trimmed || LEFTOVER_CHANNEL_IDS.has(trimmed)) return '';
  return trimmed;
}

export async function POST(request: NextRequest) {
  if (!isAllowedPortalOrigin(request)) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  }

  const clientId = ownerChannelId(process.env.NEXT_PUBLIC_LINE_CLIENT_ID);
  if (!clientId) {
    return NextResponse.json(
      { error: 'LINE Login channel is not configured' },
      { status: 500 }
    );
  }

  let body: { idToken?: unknown; nonce?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const idToken = typeof body.idToken === 'string' ? body.idToken : '';
  const nonce = typeof body.nonce === 'string' ? body.nonce : undefined;
  if (!idToken.trim()) {
    return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });
  }

  try {
    const payload = await verifyLineIdToken({ idToken, clientId, nonce });
    return NextResponse.json({ payload, lineId: payload.sub });
  } catch (error) {
    if (error instanceof LineIdTokenVerificationError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { error: 'ID token verification failed' },
      { status: 401 }
    );
  }
}
