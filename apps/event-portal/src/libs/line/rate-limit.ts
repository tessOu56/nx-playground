import { NextResponse } from 'next/server';

import {
  clientIp,
  createFixedWindowRateLimit,
  envFlagDisabled,
  type RateLimitDecision,
} from '../http/fixed-window-rate-limit';

export { clientIp };
export type { RateLimitDecision };

const WINDOW_MS = 60_000;

/**
 * LINE Messaging webhooks share a small egress IP pool. Keep this high enough
 * that a busy Official Account does not 429 legitimate deliveries.
 */
export const LINE_WEBHOOK_MAX_PER_WINDOW = 180;
/** Authorization-code exchange calls LINE OAuth with the channel secret. */
export const LINE_AUTH_TOKEN_MAX_PER_WINDOW = 20;
/** LIFF /api/line/auth/id-token verify; slightly looser than token exchange. */
export const LINE_AUTH_ID_TOKEN_MAX_PER_WINDOW = 30;

const webhookLimit = createFixedWindowRateLimit({
  windowMs: WINDOW_MS,
  max: LINE_WEBHOOK_MAX_PER_WINDOW,
});
const authTokenLimit = createFixedWindowRateLimit({
  windowMs: WINDOW_MS,
  max: LINE_AUTH_TOKEN_MAX_PER_WINDOW,
});
const authIdTokenLimit = createFixedWindowRateLimit({
  windowMs: WINDOW_MS,
  max: LINE_AUTH_ID_TOKEN_MAX_PER_WINDOW,
});

export function lineRateLimitDisabled(
  env: NodeJS.ProcessEnv = process.env
): boolean {
  return envFlagDisabled(env.LINE_RATE_LIMIT);
}

export function consumeLineWebhookRateLimit(
  key: string,
  now?: number,
  max = LINE_WEBHOOK_MAX_PER_WINDOW
): RateLimitDecision {
  return webhookLimit.consume(key, now, max);
}

export function consumeLineAuthTokenRateLimit(
  key: string,
  now?: number,
  max = LINE_AUTH_TOKEN_MAX_PER_WINDOW
): RateLimitDecision {
  return authTokenLimit.consume(key, now, max);
}

export function consumeLineAuthIdTokenRateLimit(
  key: string,
  now?: number,
  max = LINE_AUTH_ID_TOKEN_MAX_PER_WINDOW
): RateLimitDecision {
  return authIdTokenLimit.consume(key, now, max);
}

export function resetLineRateLimit() {
  webhookLimit.reset();
  authTokenLimit.reset();
  authIdTokenLimit.reset();
}

export function lineTooManyRequests(
  result: Extract<RateLimitDecision, { ok: false }>,
  format: 'json' | 'text'
): Response {
  const headers = {
    'retry-after': String(result.retryAfterSec),
    'cache-control': 'no-store',
  };
  if (format === 'json') {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers }
    );
  }
  return new Response('Too many requests', { status: 429, headers });
}

export function enforceLineRateLimit(
  request: Request,
  consume: (key: string) => RateLimitDecision,
  format: 'json' | 'text'
): Response | null {
  if (lineRateLimitDisabled()) return null;
  const decision = consume(clientIp(request));
  if (decision.ok) return null;
  return lineTooManyRequests(decision, format);
}
