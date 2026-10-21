import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT } from 'jose';

import {
  createRemoteJwtVerifier,
  resolveAuthJwksHref,
  verifyAccessJwt,
} from './jwt-verify';

describe('verifyAccessJwt', () => {
  async function signedToken(claims: {
    sub?: string;
    roles?: string[];
    aud?: string;
    iss?: string;
    exp?: number | string;
  }) {
    const { publicKey, privateKey } = await generateKeyPair('EdDSA');
    const jwk = await exportJWK(publicKey);
    jwk.kid = 'test-key';
    let jwt = new SignJWT({ roles: claims.roles ?? ['organizer'] })
      .setProtectedHeader({ alg: 'EdDSA', kid: 'test-key', typ: 'JWT' })
      .setIssuer(claims.iss ?? 'http://localhost:3000')
      .setAudience(claims.aud ?? 'event-stack-api')
      .setExpirationTime(claims.exp ?? '15m');
    if (claims.sub !== '') {
      jwt = jwt.setSubject(claims.sub ?? 'user_1');
    }
    const token = await jwt.sign(privateKey);
    return {
      token,
      jwks: createLocalJWKSet({ keys: [jwk] }),
    };
  }

  it('accepts a JWKS-signed token with matching iss/aud and roles', async () => {
    const { token, jwks } = await signedToken({ roles: ['organizer'] });
    await expect(
      verifyAccessJwt(token, {
        jwks,
        issuer: 'http://localhost:3000',
        audience: 'event-stack-api',
      })
    ).resolves.toEqual({ sub: 'user_1', roles: ['organizer'] });
  });

  it('rejects a token with the wrong audience', async () => {
    const { token, jwks } = await signedToken({ aud: 'other-api' });
    await expect(
      verifyAccessJwt(token, {
        jwks,
        issuer: 'http://localhost:3000',
        audience: 'event-stack-api',
      })
    ).resolves.toBeNull();
  });

  it('rejects a token with the wrong issuer', async () => {
    const { token, jwks } = await signedToken({ iss: 'http://evil.example' });
    await expect(
      verifyAccessJwt(token, {
        jwks,
        issuer: 'http://localhost:3000',
        audience: 'event-stack-api',
      })
    ).resolves.toBeNull();
  });

  it('rejects a token without sub', async () => {
    const { token, jwks } = await signedToken({ sub: '' });
    await expect(
      verifyAccessJwt(token, {
        jwks,
        issuer: 'http://localhost:3000',
        audience: 'event-stack-api',
      })
    ).resolves.toBeNull();
  });

  it('rejects an expired token', async () => {
    const { token, jwks } = await signedToken({
      exp: Math.floor(Date.now() / 1000) - 60,
    });
    await expect(
      verifyAccessJwt(token, {
        jwks,
        issuer: 'http://localhost:3000',
        audience: 'event-stack-api',
      })
    ).resolves.toBeNull();
  });
});

describe('createRemoteJwtVerifier', () => {
  it('derives JWKS from the issuer when AUTH_JWKS_URL is omitted', () => {
    expect(
      resolveAuthJwksHref({ issuer: 'https://nx-event-portal.vercel.app/' })
    ).toBe('https://nx-event-portal.vercel.app/api/auth/jwks');
    expect(createRemoteJwtVerifier({})).toBeNull();
    expect(
      createRemoteJwtVerifier({
        issuer: 'http://localhost:3000',
      })
    ).not.toBeNull();
  });
});
