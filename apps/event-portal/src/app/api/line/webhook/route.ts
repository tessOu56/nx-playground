import { after, type NextRequest } from 'next/server';

import { handleLineWebhookBody } from '../../../../libs/line/bot/handle';
import { verifyLineSignature } from '../../../../libs/line/bot/signature';
import {
  consumeLineWebhookRateLimit,
  enforceLineRateLimit,
} from '../../../../libs/line/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 10;

const UNAUTHORIZED = 'Invalid LINE signature';
/** LINE webhook JSON is small; cap before HMAC to bound memory. */
export const MAX_LINE_WEBHOOK_BYTES = 256 * 1024;

export async function GET(request: NextRequest) {
  const limited = await enforceLineRateLimit(
    request,
    consumeLineWebhookRateLimit,
    'text'
  );
  if (limited) return limited;
  return new Response('OK', { status: 200 });
}

export async function POST(request: NextRequest) {
  const limited = await enforceLineRateLimit(
    request,
    consumeLineWebhookRateLimit,
    'text'
  );
  if (limited) return limited;

  const secret = process.env.LINE_CHANNEL_SECRET?.trim() ?? '';
  if (!secret) {
    return new Response('Webhook is not configured', { status: 500 });
  }

  const rawBuffer = Buffer.from(await request.arrayBuffer());
  if (rawBuffer.byteLength > MAX_LINE_WEBHOOK_BYTES) {
    return new Response('Payload too large', { status: 413 });
  }

  const signature = request.headers.get('x-line-signature');
  if (!verifyLineSignature(rawBuffer, signature, secret)) {
    return new Response(UNAUTHORIZED, { status: 401 });
  }

  const rawBody = rawBuffer.toString('utf8');
  try {
    after(() => handleLineWebhookBody(rawBody));
  } catch {
    void handleLineWebhookBody(rawBody);
  }
  return new Response('OK', { status: 200 });
}
