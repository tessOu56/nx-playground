export type RateLimitDecision =
  | { ok: true }
  | { ok: false; retryAfterSec: number };

export type FixedWindowRateLimit = {
  consume(key: string, now?: number, max?: number): RateLimitDecision;
  reset(): void;
};

type Bucket = { count: number; resetAt: number };

/**
 * In-process fixed window. Fine for a single Node instance; on Vercel each
 * isolate has its own map, so this is a best-effort app layer, not a WAF.
 */
export function createFixedWindowRateLimit(options: {
  windowMs: number;
  max: number;
  pruneAfter?: number;
}): FixedWindowRateLimit {
  const pruneAfter = options.pruneAfter ?? 500;
  const buckets = new Map<string, Bucket>();

  function prune(now: number) {
    if (buckets.size < pruneAfter) return;
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
  }

  return {
    consume(key, now = Date.now(), max = options.max) {
      prune(now);
      const bucket = buckets.get(key);
      if (!bucket || bucket.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + options.windowMs });
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
    },
    reset() {
      buckets.clear();
    },
  };
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const first = forwarded?.split(',')[0]?.trim();
  if (first) return first.slice(0, 64);
  return (request.headers.get('x-real-ip') ?? 'local').slice(0, 64);
}

export function envFlagDisabled(value: string | undefined): boolean {
  const flag = value?.trim();
  return flag === '0' || flag === 'false';
}
