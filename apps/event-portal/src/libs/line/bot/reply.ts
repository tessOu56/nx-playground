import type { LineMessage } from './messages';

const REPLY_URL = 'https://api.line.me/v2/bot/message/reply';

export async function replyMessages(
  replyToken: string,
  messages: LineMessage[],
  accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN,
  fetchImpl: typeof fetch = fetch
): Promise<void> {
  const token = accessToken?.trim();
  if (!token || messages.length === 0) return;

  const response = await fetchImpl(REPLY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      replyToken,
      messages: messages.slice(0, 5),
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`LINE Reply API ${response.status}: ${detail.slice(0, 300)}`);
  }
}
