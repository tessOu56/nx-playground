import { NextResponse } from 'next/server';

import {
  clientIp,
  envFlagDisabled,
  type RateLimitDecision,
} from '../http/fixed-window-rate-limit';
import { resetSharedKvMemory, sharedIncr } from '../http/shared-kv';

export { clientIp };
export type { RateLimitDecision };

const WINDOW_MS = 60_000;

/**
 * LINE Messaging webhooks share a small egress IP pool. Keep this high enough
 * that a busy Official Account does not 429 legitimate deliveries.
 */
export const LINE_WEBHOOK_MAX_PER_WINDOW = 180;

async function consumeShared(
  prefix: string,
  key: string,
  now: number,
  max: number
): Promise<RateLimitDecision> {
  const result = await sharedIncr(`${prefix}:${key}`, WINDOW_MS, now);
  if (result.count > max) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((result.resetAt - now) / 1000)),
    };
  }
  return { ok: true };
}

export function lineRateLimitDisabled(
  env: NodeJS.ProcessEnv = process.env
): boolean {
  return envFlagDisabled(env.LINE_RATE_LIMIT);
}

export function consumeLineWebhookRateLimit(
  key: string,
  now = Date.now(),
  max = LINE_WEBHOOK_MAX_PER_WINDOW
): Promise<RateLimitDecision> {
  return consumeShared('line:webhook', key, now, max);
}

export function resetLineRateLimit() {
  resetSharedKvMemory();
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

export async function enforceLineRateLimit(
  request: Request,
  consume: (key: string) => RateLimitDecision | Promise<RateLimitDecision>,
  format: 'json' | 'text'
): Promise<Response | null> {
  if (lineRateLimitDisabled()) return null;
  const decision = await consume(clientIp(request));
  if (decision.ok) return null;
  return lineTooManyRequests(decision, format);
}
