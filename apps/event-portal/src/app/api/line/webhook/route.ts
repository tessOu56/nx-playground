import { after, type NextRequest } from 'next/server';

import { handleLineWebhookBody } from '../../../../libs/line/bot/handle';
import { verifyLineSignature } from '../../../../libs/line/bot/signature';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 10;

const UNAUTHORIZED = 'Invalid LINE signature';

export async function GET() {
  return new Response('OK', { status: 200 });
}

export async function POST(request: NextRequest) {
  const secret = process.env.LINE_CHANNEL_SECRET?.trim() ?? '';
  if (!secret) {
    return new Response('LINE_CHANNEL_SECRET is not configured', { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get('x-line-signature');
  if (!verifyLineSignature(rawBody, signature, secret)) {
    return new Response(UNAUTHORIZED, { status: 401 });
  }

  try {
    after(() => handleLineWebhookBody(rawBody));
  } catch {
    void handleLineWebhookBody(rawBody);
  }
  return new Response('OK', { status: 200 });
}
