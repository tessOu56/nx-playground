import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * LINE Messaging API: x-line-signature = base64(HMAC-SHA256(raw body, channel secret)).
 * Compare digests with timingSafeEqual. Never hash-then-string-compare.
 */
export function verifyLineSignature(
  rawBody: string,
  signatureHeader: string | null | undefined,
  channelSecret: string
): boolean {
  if (!channelSecret || !signatureHeader) return false;

  const expected = createHmac('sha256', channelSecret)
    .update(rawBody, 'utf8')
    .digest();

  const actual = Buffer.from(signatureHeader, 'base64');
  if (actual.length === 0 || actual.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(actual, expected);
}

export function lineSignatureHeader(
  rawBody: string,
  channelSecret: string
): string {
  return createHmac('sha256', channelSecret)
    .update(rawBody, 'utf8')
    .digest('base64');
}
