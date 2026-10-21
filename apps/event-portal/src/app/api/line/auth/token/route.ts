import { type NextRequest, NextResponse } from 'next/server';

import { getLineRedirectUri } from '../../../../../libs/line/constants';
import { isLinePkceVerifier } from '../../../../../libs/line/pkce';
import {
  consumeLineAuthTokenRateLimit,
  enforceLineRateLimit,
} from '../../../../../libs/line/rate-limit';
import { isAllowedPortalOrigin } from '../../../../../libs/line/request-origin';
import {
  attachLineSessionCookies,
  publicLineSessionFromClaims,
} from '../../../../../libs/line/session-cookies';
import {
  LineIdTokenVerificationError,
  verifyLineIdToken,
} from '../../../../../libs/line/verify-id-token';

export const dynamic = 'force-dynamic';

const LEFTOVER_CHANNEL_IDS = new Set(['2007835339']);
const PLACEHOLDER_SECRETS = new Set([
  'your_line_client_secret_here',
  'your_line_client_secret',
]);

function ownerChannelId(value: string | undefined): string {
  const trimmed = value?.trim() ?? '';
  if (!trimmed || LEFTOVER_CHANNEL_IDS.has(trimmed)) return '';
  return trimmed;
}

function ownerSecret(value: string | undefined): string {
  const trimmed = value?.trim() ?? '';
  if (!trimmed || PLACEHOLDER_SECRETS.has(trimmed)) return '';
  return trimmed;
}

function lineOauthConfig(request: NextRequest) {
  return {
    clientId: ownerChannelId(process.env.NEXT_PUBLIC_LINE_CLIENT_ID),
    clientSecret: ownerSecret(process.env.LINE_CLIENT_SECRET),
    redirectUri: getLineRedirectUri({
      protocol: request.nextUrl.protocol,
      hostname: request.nextUrl.hostname,
      origin: request.nextUrl.origin,
    }),
    tokenEndpoint: 'https://api.line.me/oauth2/v2.1/token',
    profileEndpoint: 'https://api.line.me/v2/profile',
  };
}

export async function POST(request: NextRequest) {
  try {
    const limited = await enforceLineRateLimit(
      request,
      consumeLineAuthTokenRateLimit,
      'json'
    );
    if (limited) return limited;

    if (!isAllowedPortalOrigin(request)) {
      return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
    }

    const LINE_OAUTH_CONFIG = lineOauthConfig(request);
    if (
      !LINE_OAUTH_CONFIG.clientId ||
      !LINE_OAUTH_CONFIG.clientSecret ||
      !LINE_OAUTH_CONFIG.redirectUri
    ) {
      return NextResponse.json(
        {
          error: 'Missing environment variables',
          details:
            'Owner LINE Login channel is not configured (STOP-013). Do not use another organisation’s credentials.',
        },
        { status: 500 }
      );
    }

    let body: {
      code?: unknown;
      redirect_uri?: unknown;
      code_verifier?: unknown;
    };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const code = typeof body.code === 'string' ? body.code.trim() : '';
    if (!code) {
      return NextResponse.json(
        { error: 'Missing authorization code' },
        { status: 400 }
      );
    }

    if (!isLinePkceVerifier(body.code_verifier)) {
      return NextResponse.json(
        { error: 'Missing PKCE verifier' },
        { status: 400 }
      );
    }

    const tokenRequestBody = new URLSearchParams();
    tokenRequestBody.set('grant_type', 'authorization_code');
    tokenRequestBody.set('code', code);
    tokenRequestBody.set('redirect_uri', LINE_OAUTH_CONFIG.redirectUri);
    tokenRequestBody.set('client_id', LINE_OAUTH_CONFIG.clientId);
    tokenRequestBody.set('client_secret', LINE_OAUTH_CONFIG.clientSecret);
    tokenRequestBody.set('code_verifier', body.code_verifier);

    const tokenResponse = await fetch(LINE_OAUTH_CONFIG.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenRequestBody.toString(),
      signal: AbortSignal.timeout(10_000),
    });

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to exchange authorization code for token' },
        { status: 400 }
      );
    }

    const tokenData = await tokenResponse.json();

    const profileResponse = await fetch(LINE_OAUTH_CONFIG.profileEndpoint, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!profileResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to get user profile' },
        { status: 400 }
      );
    }

    const profile = await profileResponse.json();

    if (typeof tokenData.id_token !== 'string' || !tokenData.id_token.trim()) {
      return NextResponse.json(
        { error: 'Missing ID token from LINE token endpoint' },
        { status: 401 }
      );
    }

    let decodedIdToken;
    try {
      decodedIdToken = await verifyLineIdToken({
        idToken: tokenData.id_token,
        clientId: LINE_OAUTH_CONFIG.clientId,
      });
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

    const expiresIn =
      typeof tokenData.expires_in === 'number' && tokenData.expires_in > 0
        ? tokenData.expires_in
        : 3600;
    const response = NextResponse.json({
      ...publicLineSessionFromClaims({
        sub: decodedIdToken.sub,
        name: decodedIdToken.name,
        picture: decodedIdToken.picture,
        email: decodedIdToken.email,
        exp: decodedIdToken.exp,
      }),
      profile,
      decodedIdToken,
      tokenType: tokenData.token_type,
      expiresIn,
    });
    return attachLineSessionCookies(
      response,
      {
        accessToken: tokenData.access_token,
        idToken: tokenData.id_token,
        expiresIn,
      },
      request
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
