import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { NextRequest, NextResponse } from 'next/server';

import {
  LINE_ACCESS_TOKEN_COOKIE,
  LINE_ID_TOKEN_COOKIE,
  attachLineSessionCookies,
  claimsFromLineIdToken,
  clearLineSessionCookies,
  lineSessionCookieOptions,
  publicLineSessionFromClaims,
  readLineSessionCookies,
} from './session-cookies';

function encodeClaims(claims: Record<string, unknown>) {
  return `h.${Buffer.from(JSON.stringify(claims)).toString('base64url')}.s`;
}

describe('line session cookies', () => {
  it('sets httpOnly SameSite=Lax cookies and does not expose tokens on the options object', () => {
    const options = lineSessionCookieOptions(3600, true);
    assert.equal(options.httpOnly, true);
    assert.equal(options.secure, true);
    assert.equal(options.sameSite, 'lax');
    assert.equal(options.path, '/');
    assert.equal(options.maxAge, 3600);
  });

  it('attaches and reads tokens only from cookies', () => {
    const request = new NextRequest('http://localhost:3000/api/line/auth/token');
    const response = NextResponse.json({ lineId: 'U1' });
    attachLineSessionCookies(
      response,
      { accessToken: 'access-secret', idToken: 'id-secret', expiresIn: 120 },
      request
    );
    const cookies = response.headers.getSetCookie();
    assert.ok(
      cookies.some(
        cookie =>
          cookie.startsWith(`${LINE_ACCESS_TOKEN_COOKIE}=access-secret`) &&
          cookie.includes('HttpOnly') &&
          /samesite=lax/i.test(cookie)
      )
    );
    assert.ok(
      cookies.some(cookie =>
        cookie.startsWith(`${LINE_ID_TOKEN_COOKIE}=id-secret`)
      )
    );

    const inbound = new NextRequest('http://localhost:3000/api/line/auth/session', {
      headers: {
        cookie: `${LINE_ACCESS_TOKEN_COOKIE}=access-secret; ${LINE_ID_TOKEN_COOKIE}=id-secret`,
      },
    });
    assert.deepEqual(readLineSessionCookies(inbound), {
      accessToken: 'access-secret',
      idToken: 'id-secret',
    });
  });

  it('clears both cookies', () => {
    const response = NextResponse.json({ ok: true });
    clearLineSessionCookies(response);
    const cookies = response.headers.getSetCookie();
    assert.ok(cookies.some(cookie => cookie.includes(`${LINE_ACCESS_TOKEN_COOKIE}=`)));
    assert.ok(cookies.some(cookie => cookie.includes('Max-Age=0')));
  });
});

describe('claimsFromLineIdToken', () => {
  it('reads sub and rejects expired tokens', () => {
    const live = encodeClaims({
      sub: 'U123',
      name: 'Ada',
      exp: Math.floor(Date.now() / 1000) + 3600,
    });
    const claims = claimsFromLineIdToken(live);
    assert.equal(claims?.sub, 'U123');
    assert.equal(claims?.name, 'Ada');
    assert.equal(publicLineSessionFromClaims(claims!).accessToken, null);
    assert.equal(publicLineSessionFromClaims(claims!).idToken, null);

    const expired = encodeClaims({
      sub: 'U123',
      exp: Math.floor(Date.now() / 1000) - 10,
    });
    assert.equal(claimsFromLineIdToken(expired), null);
  });
});
