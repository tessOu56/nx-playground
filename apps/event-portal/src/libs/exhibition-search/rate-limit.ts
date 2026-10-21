import {
  clientIp,
  envFlagDisabled,
} from '../http/fixed-window-rate-limit';
import { resetSharedKvMemory, sharedIncr } from '../http/shared-kv';

export { clientIp };

const WINDOW_MS = 60_000;
const DEFAULT_MAX = 60;

export function searchRateLimitDisabled(
  env: NodeJS.ProcessEnv = process.env
): boolean {
  return envFlagDisabled(env.EXHIBITION_SEARCH_RATE_LIMIT);
}

export async function consumeSearchRateLimit(
  key: string,
  now = Date.now(),
  max = DEFAULT_MAX
): Promise<{ ok: true } | { ok: false; retryAfterSec: number }> {
  const result = await sharedIncr(`search:${key}`, WINDOW_MS, now);
  if (result.count > max) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((result.resetAt - now) / 1000)),
    };
  }
  return { ok: true };
}

export function resetSearchRateLimit() {
  resetSharedKvMemory();
}
