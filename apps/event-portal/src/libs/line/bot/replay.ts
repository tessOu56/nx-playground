import { sharedSetNx } from '../../http/shared-kv';

/** LINE Messaging events older than this are treated as replays. */
export const LINE_WEBHOOK_MAX_AGE_MS = 10 * 60 * 1000;
/** Keep webhookEventId keys at least as long as the stale window. */
export const LINE_WEBHOOK_EVENT_TTL_MS = 24 * 60 * 60 * 1000;
const FUTURE_SKEW_MS = 60_000;

export function isStaleLineWebhookEvent(
  event: { timestamp?: unknown },
  now = Date.now()
): boolean {
  if (typeof event.timestamp !== 'number' || !Number.isFinite(event.timestamp)) {
    return true;
  }
  if (event.timestamp > now + FUTURE_SKEW_MS) return true;
  return now - event.timestamp > LINE_WEBHOOK_MAX_AGE_MS;
}

export function lineWebhookEventId(event: { webhookEventId?: unknown }): string {
  return typeof event.webhookEventId === 'string' ? event.webhookEventId.trim() : '';
}

export async function claimLineWebhookEventId(
  webhookEventId: string,
  now = Date.now()
): Promise<boolean> {
  const id = webhookEventId.trim();
  if (!id) return false;
  return sharedSetNx(`line:webhook-event:${id}`, LINE_WEBHOOK_EVENT_TTL_MS, now);
}
