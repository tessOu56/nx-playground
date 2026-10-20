import { createHmac, timingSafeEqual } from 'node:crypto';

function hmacSha256(rawBody: string | Buffer, channelSecret: string): Buffer {
  const hmac = createHmac('sha256', channelSecret);
  if (typeof rawBody === 'string') {
    hmac.update(rawBody, 'utf8');
  } else {
    hmac.update(rawBody);
  }
  return hmac.digest();
}

/**
 * LINE Messaging API: x-line-signature = base64(HMAC-SHA256(raw body, channel secret)).
 * Compare digests with timingSafeEqual. Never hash-then-string-compare.
 */
export function verifyLineSignature(
  rawBody: string | Buffer,
  signatureHeader: string | null | undefined,
  channelSecret: string
): boolean {
  if (!channelSecret || !signatureHeader) return false;

  const expected = hmacSha256(rawBody, channelSecret);
  const actual = Buffer.from(signatureHeader, 'base64');
  if (actual.length === 0 || actual.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(actual, expected);
}

export function lineSignatureHeader(
  rawBody: string | Buffer,
  channelSecret: string
): string {
  return hmacSha256(rawBody, channelSecret).toString('base64');
}
