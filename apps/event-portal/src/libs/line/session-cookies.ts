import { type NextRequest, type NextResponse } from 'next/server';

export const LINE_ACCESS_TOKEN_COOKIE = 'nx_line_at';
export const LINE_ID_TOKEN_COOKIE = 'nx_line_it';

const MAX_SESSION_SEC = 30 * 24 * 60 * 60;

export type LineSessionTokens = {
  accessToken: string;
  idToken: string;
  expiresIn?: number;
};

export function lineSessionCookieSecure(request: {
  nextUrl: { protocol: string };
}): boolean {
  return (
    request.nextUrl.protocol === 'https:' || process.env.NODE_ENV === 'production'
  );
}

export function lineSessionCookieOptions(
  expiresInSec: number,
  secure: boolean
) {
  const maxAge = Math.min(
    Math.max(Number.isFinite(expiresInSec) ? expiresInSec : 3600, 60),
    MAX_SESSION_SEC
  );
  return {
    httpOnly: true,
    secure,
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}

export function attachLineSessionCookies(
  response: NextResponse,
  tokens: LineSessionTokens,
  request: NextRequest
): NextResponse {
  const expiresIn =
    typeof tokens.expiresIn === 'number' && tokens.expiresIn > 0
      ? tokens.expiresIn
      : 3600;
  const options = lineSessionCookieOptions(
    expiresIn,
    lineSessionCookieSecure(request)
  );
  response.cookies.set(LINE_ACCESS_TOKEN_COOKIE, tokens.accessToken, options);
  response.cookies.set(LINE_ID_TOKEN_COOKIE, tokens.idToken, options);
  return response;
}

export function clearLineSessionCookies(response: NextResponse): NextResponse {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };
  response.cookies.set(LINE_ACCESS_TOKEN_COOKIE, '', options);
  response.cookies.set(LINE_ID_TOKEN_COOKIE, '', options);
  return response;
}

export function readLineSessionCookies(
  request: NextRequest
): { accessToken: string; idToken: string } | null {
  const accessToken = request.cookies.get(LINE_ACCESS_TOKEN_COOKIE)?.value?.trim() ?? '';
  const idToken = request.cookies.get(LINE_ID_TOKEN_COOKIE)?.value?.trim() ?? '';
  if (!accessToken || !idToken) return null;
  return { accessToken, idToken };
}

export type LineIdTokenClaims = {
  sub: string;
  name?: string;
  picture?: string;
  email?: string;
  exp?: number;
};

export function claimsFromLineIdToken(
  idToken: string,
  now = Date.now()
): LineIdTokenClaims | null {
  const payload = idToken.split('.')[1];
  if (!payload) return null;
  try {
    const json = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8')
    ) as Record<string, unknown>;
    if (typeof json.sub !== 'string' || !json.sub) return null;
    if (typeof json.exp === 'number' && json.exp * 1000 <= now) return null;
    return {
      sub: json.sub,
      name: typeof json.name === 'string' ? json.name : undefined,
      picture: typeof json.picture === 'string' ? json.picture : undefined,
      email: typeof json.email === 'string' ? json.email : undefined,
      exp: typeof json.exp === 'number' ? json.exp : undefined,
    };
  } catch {
    return null;
  }
}

export function publicLineSessionFromClaims(claims: LineIdTokenClaims) {
  return {
    lineId: claims.sub,
    profile: {
      userId: claims.sub,
      displayName: claims.name ?? '',
      pictureUrl: claims.picture,
    },
    decodedIdToken: claims,
    idToken: null,
    accessToken: null,
  };
}
