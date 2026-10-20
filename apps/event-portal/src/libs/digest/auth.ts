import { timingSafeEqual } from 'node:crypto';

export function parseBearerToken(
  authorizationHeader: string | undefined | null
): string | undefined {
  if (!authorizationHeader) return undefined;
  const match = /^Bearer\s+(\S+)$/i.exec(authorizationHeader.trim());
  return match?.[1];
}

export function timingSafeEqualUtf8(left: string, right: string): boolean {
  const a = Buffer.from(left, 'utf8');
  const b = Buffer.from(right, 'utf8');
  if (a.length !== b.length) {
    timingSafeEqual(a, a);
    return false;
  }
  return timingSafeEqual(a, b);
}

/** Fail closed when CRON_SECRET is unset or the bearer does not match. */
export function isCronAuthorized(
  authorizationHeader: string | undefined | null,
  expectedSecret: string | undefined = process.env.CRON_SECRET
): boolean {
  const expected = expectedSecret?.trim() ?? '';
  if (!expected) return false;
  const provided = parseBearerToken(authorizationHeader);
  if (!provided) return false;
  return timingSafeEqualUtf8(provided, expected);
}
