export const LINE_ID_TOKEN_ISSUER = 'https://access.line.me';
export const LINE_ID_TOKEN_VERIFY_URL =
  'https://api.line.me/oauth2/v2.1/verify';

export class LineIdTokenVerificationError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status = 401) {
    super(message);
    this.name = 'LineIdTokenVerificationError';
    this.code = code;
    this.status = status;
  }
}

export type LineVerifiedIdToken = {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat?: number;
  nonce?: string;
  name?: string;
  picture?: string;
  email?: string;
  amr?: string[];
};

type VerifyDeps = {
  fetchImpl?: typeof fetch;
  nowMs?: number;
};

function fail(code: string, message: string, status = 401): never {
  throw new LineIdTokenVerificationError(code, message, status);
}

export function assertLocalIdTokenClaims(
  payload: unknown,
  opts: { clientId: string; nonce?: string; nowMs?: number }
): LineVerifiedIdToken {
  if (!payload || typeof payload !== 'object') {
    fail('invalid_payload', 'ID token payload is missing');
  }

  const claims = payload as Record<string, unknown>;
  const iss = typeof claims.iss === 'string' ? claims.iss : '';
  const sub = typeof claims.sub === 'string' ? claims.sub : '';
  const aud = typeof claims.aud === 'string' ? claims.aud : '';
  const exp =
    typeof claims.exp === 'number' ? claims.exp : Number(claims.exp);

  if (!sub.trim()) fail('missing_sub', 'ID token subject is missing');
  if (iss !== LINE_ID_TOKEN_ISSUER) {
    fail('invalid_iss', 'ID token issuer is invalid');
  }
  if (aud !== opts.clientId) {
    fail('invalid_aud', 'ID token audience is invalid');
  }
  if (!Number.isFinite(exp)) {
    fail('invalid_exp', 'ID token expiry is invalid');
  }

  const nowSec = Math.floor((opts.nowMs ?? Date.now()) / 1000);
  if (exp <= nowSec) fail('expired', 'ID token has expired');

  if (opts.nonce) {
    if (typeof claims.nonce !== 'string' || claims.nonce !== opts.nonce) {
      fail('invalid_nonce', 'ID token nonce mismatch');
    }
  }

  return {
    iss,
    sub,
    aud,
    exp,
    iat: typeof claims.iat === 'number' ? claims.iat : undefined,
    nonce: typeof claims.nonce === 'string' ? claims.nonce : undefined,
    name: typeof claims.name === 'string' ? claims.name : undefined,
    picture: typeof claims.picture === 'string' ? claims.picture : undefined,
    email: typeof claims.email === 'string' ? claims.email : undefined,
    amr: Array.isArray(claims.amr)
      ? claims.amr.filter((value): value is string => typeof value === 'string')
      : undefined,
  };
}

/**
 * Verify a LINE ID token via the official verify endpoint, then re-check
 * iss / aud / exp / nonce locally. Fail closed on any uncertainty.
 */
export async function verifyLineIdToken(
  input: { idToken: string; clientId: string; nonce?: string },
  deps: VerifyDeps = {}
): Promise<LineVerifiedIdToken> {
  const idToken = input.idToken?.trim() ?? '';
  const clientId = input.clientId?.trim() ?? '';
  if (!idToken) fail('missing_id_token', 'ID token is required');
  if (!clientId) fail('missing_client_id', 'LINE channel ID is required');

  const body = new URLSearchParams();
  body.set('id_token', idToken);
  body.set('client_id', clientId);
  if (input.nonce) body.set('nonce', input.nonce);

  const fetchImpl = deps.fetchImpl ?? fetch;
  let response: Response;
  try {
    const init: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    };
    if (!deps.fetchImpl) {
      init.signal = AbortSignal.timeout(8_000);
    }
    response = await fetchImpl(LINE_ID_TOKEN_VERIFY_URL, init);
  } catch {
    fail(
      'verify_unreachable',
      'LINE ID token verify endpoint unreachable',
      503
    );
  }

  if (!response.ok) {
    fail('verify_rejected', 'LINE ID token verification failed');
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    fail('invalid_payload', 'LINE ID token verify returned invalid JSON');
  }

  return assertLocalIdTokenClaims(payload, {
    clientId,
    nonce: input.nonce,
    nowMs: deps.nowMs,
  });
}
