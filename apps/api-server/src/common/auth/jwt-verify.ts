import {
  createRemoteJWKSet,
  jwtVerify,
  type JWTVerifyGetKey,
} from 'jose';

import {
  AUTH_JWT_AUDIENCE,
  parseIdentityRoles,
  type AccessTokenClaims,
} from './identity-roles';

export type JwtVerifyOptions = {
  jwks: JWTVerifyGetKey;
  issuer: string;
  audience: string;
};

export function parseAuthJwksUrl(raw: string | undefined): URL | null {
  const trimmed = raw?.trim() ?? '';
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

export async function verifyAccessJwt(
  token: string,
  options: JwtVerifyOptions
): Promise<AccessTokenClaims | null> {
  const value = token.trim();
  if (!value) return null;
  try {
    const { payload } = await jwtVerify(value, options.jwks, {
      issuer: options.issuer,
      audience: options.audience,
      algorithms: ['EdDSA', 'ES256', 'RS256'],
    });
    const sub = typeof payload.sub === 'string' ? payload.sub.trim() : '';
    if (!sub) return null;
    return {
      sub,
      roles: parseIdentityRoles(payload.roles),
    };
  } catch {
    return null;
  }
}

export function resolveAuthIssuer(raw: string | undefined): string {
  return raw?.trim().replace(/\/$/, '') ?? '';
}

export function resolveAuthJwksHref(env: {
  jwksUrl?: string;
  issuer?: string;
}): string | undefined {
  const explicit = env.jwksUrl?.trim();
  if (explicit) return explicit;
  const issuer = resolveAuthIssuer(env.issuer);
  return issuer ? `${issuer}/api/auth/jwks` : undefined;
}

export function createRemoteJwtVerifier(env: {
  jwksUrl?: string;
  issuer?: string;
  audience?: string;
}): JwtVerifyOptions | null {
  const issuer = resolveAuthIssuer(env.issuer);
  const jwksUrl = parseAuthJwksUrl(resolveAuthJwksHref({ ...env, issuer }));
  const audience = env.audience?.trim() || AUTH_JWT_AUDIENCE;
  if (!jwksUrl || !issuer) return null;
  return {
    jwks: createRemoteJWKSet(jwksUrl),
    issuer,
    audience,
  };
}
