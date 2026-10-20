const WINDOW_MS = 60_000;
const DEFAULT_MAX = 60;

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function prune(now: number) {
  if (buckets.size < 500) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const first = forwarded?.split(',')[0]?.trim();
  if (first) return first.slice(0, 64);
  return (request.headers.get('x-real-ip') ?? 'local').slice(0, 64);
}

export function searchRateLimitDisabled(
  env: NodeJS.ProcessEnv = process.env
): boolean {
  const flag = env.EXHIBITION_SEARCH_RATE_LIMIT?.trim();
  return flag === '0' || flag === 'false';
}

export function consumeSearchRateLimit(
  key: string,
  now = Date.now(),
  max = DEFAULT_MAX
): { ok: true } | { ok: false; retryAfterSec: number } {
  prune(now);
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  if (bucket.count >= max) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }
  bucket.count += 1;
  return { ok: true };
}

export function resetSearchRateLimit() {
  buckets.clear();
}
