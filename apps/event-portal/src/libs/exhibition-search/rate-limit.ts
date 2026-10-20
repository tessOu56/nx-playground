import {
  clientIp,
  createFixedWindowRateLimit,
  envFlagDisabled,
} from '../http/fixed-window-rate-limit';

export { clientIp };

const WINDOW_MS = 60_000;
const DEFAULT_MAX = 60;

const limiter = createFixedWindowRateLimit({
  windowMs: WINDOW_MS,
  max: DEFAULT_MAX,
});

export function searchRateLimitDisabled(
  env: NodeJS.ProcessEnv = process.env
): boolean {
  return envFlagDisabled(env.EXHIBITION_SEARCH_RATE_LIMIT);
}

export function consumeSearchRateLimit(
  key: string,
  now = Date.now(),
  max = DEFAULT_MAX
): { ok: true } | { ok: false; retryAfterSec: number } {
  return limiter.consume(key, now, max);
}

export function resetSearchRateLimit() {
  limiter.reset();
}
