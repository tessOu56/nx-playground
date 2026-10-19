import { searchCatalog, type CatalogEvent } from './catalog-search';
import {
  catalogUnavailableMessage,
  exhibitionCarousel,
  helpMessage,
  noResultsMessage,
  portalOriginFromEnv,
  type LineMessage,
} from './messages';
import { parseCatalogQuery } from './parse-query';
import { replyMessages } from './reply';

type LineTextEvent = {
  type: 'message';
  replyToken?: string;
  message?: { type: string; text?: string };
};

type LineFollowEvent = {
  type: 'follow';
  replyToken?: string;
};

type LineWebhookEvent = LineTextEvent | LineFollowEvent | { type: string; replyToken?: string };

type LineWebhookBody = {
  events?: LineWebhookEvent[];
};

export type LineBotDeps = {
  now?: Date;
  search?: (input: Parameters<typeof searchCatalog>[0]) => Promise<CatalogEvent[]>;
  reply?: typeof replyMessages;
  portalOrigin?: string;
};

function asBody(rawBody: string): LineWebhookBody {
  try {
    const parsed = JSON.parse(rawBody) as unknown;
    if (parsed && typeof parsed === 'object') return parsed as LineWebhookBody;
  } catch {
    /* LINE can retry empty / truncated payloads; still 200 after signature. */
  }
  return { events: [] };
}

async function messagesForText(
  text: string,
  deps: LineBotDeps
): Promise<LineMessage[]> {
  const parsed = parseCatalogQuery(text, deps.now ?? new Date());
  if (parsed.help || text.trim() === '') {
    return [helpMessage(parsed.locale)];
  }

  try {
    const search = deps.search ?? searchCatalog;
    const events = await search({
      region: parsed.region,
      keyword: parsed.keyword,
      windows: parsed.windows,
      limit: 10,
    });
    if (events.length === 0) {
      return [noResultsMessage(parsed.locale)];
    }
    const origin = deps.portalOrigin ?? portalOriginFromEnv();
    return [exhibitionCarousel(events, parsed.locale, origin)];
  } catch {
    return [catalogUnavailableMessage(parsed.locale)];
  }
}

export async function handleLineWebhookBody(
  rawBody: string,
  deps: LineBotDeps = {}
): Promise<void> {
  const body = asBody(rawBody);
  const reply = deps.reply ?? replyMessages;

  for (const event of body.events ?? []) {
    const replyToken = event.replyToken?.trim();
    if (!replyToken) continue;

    if (event.type === 'follow') {
      await reply(replyToken, [helpMessage('zh-TW')]);
      continue;
    }

    if (event.type !== 'message') continue;
    const message = (event as LineTextEvent).message;
    if (!message || message.type !== 'text' || typeof message.text !== 'string') {
      continue;
    }

    const messages = await messagesForText(message.text, deps);
    await reply(replyToken, messages);
  }
}
