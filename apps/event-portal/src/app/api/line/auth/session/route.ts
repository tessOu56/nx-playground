import { type NextRequest, NextResponse } from 'next/server';

import {
  consumeLineAuthIdTokenRateLimit,
  enforceLineRateLimit,
} from '../../../../../libs/line/rate-limit';
import { isAllowedPortalOrigin } from '../../../../../libs/line/request-origin';
import {
  attachLineSessionCookies,
  claimsFromLineIdToken,
  clearLineSessionCookies,
  publicLineSessionFromClaims,
  readLineSessionCookies,
} from '../../../../../libs/line/session-cookies';
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

function jsonSession(session: ReturnType<typeof publicLineSessionFromClaims>) {
  return NextResponse.json(session, {
    headers: { 'cache-control': 'no-store' },
  });
}

export async function GET(request: NextRequest) {
  const tokens = readLineSessionCookies(request);
  if (!tokens) {
    return NextResponse.json({ lineId: null }, { status: 401 });
  }
  const claims = claimsFromLineIdToken(tokens.idToken);
  if (!claims) {
    const response = NextResponse.json({ lineId: null }, { status: 401 });
    return clearLineSessionCookies(response);
  }
  return jsonSession(publicLineSessionFromClaims(claims));
}

export async function POST(request: NextRequest) {
  const limited = await enforceLineRateLimit(
    request,
    consumeLineAuthIdTokenRateLimit,
    'json'
  );
  if (limited) return limited;

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

  let body: { idToken?: unknown; accessToken?: unknown; nonce?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const idToken = typeof body.idToken === 'string' ? body.idToken.trim() : '';
  const accessToken =
    typeof body.accessToken === 'string' ? body.accessToken.trim() : '';
  const nonce = typeof body.nonce === 'string' ? body.nonce : undefined;
  if (!idToken || !accessToken) {
    return NextResponse.json(
      { error: 'Missing LINE session tokens' },
      { status: 400 }
    );
  }

  try {
    const payload = await verifyLineIdToken({ idToken, clientId, nonce });
    const response = jsonSession(
      publicLineSessionFromClaims({
        sub: payload.sub,
        name: payload.name,
        picture: payload.picture,
        email: payload.email,
        exp: payload.exp,
      })
    );
    const expiresIn =
      typeof payload.exp === 'number'
        ? Math.max(60, payload.exp - Math.floor(Date.now() / 1000))
        : 3600;
    return attachLineSessionCookies(
      response,
      { accessToken, idToken, expiresIn },
      request
    );
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

export async function DELETE() {
  const response = NextResponse.json(
    { ok: true },
    { headers: { 'cache-control': 'no-store' } }
  );
  return clearLineSessionCookies(response);
}
