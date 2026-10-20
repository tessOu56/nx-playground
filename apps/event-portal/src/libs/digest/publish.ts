import { redactSecrets, safeErrorReason } from './redact';
import type {
  DigestMessage,
  DigestPublisher,
  PublishResult,
} from './types';

export const DISCORD_WEBHOOK_ENV = 'DISCORD_WEBHOOK_URL';

const DISCORD_WEBHOOK_HOSTS = new Set([
  'discord.com',
  'discordapp.com',
  'ptb.discord.com',
  'canary.discord.com',
]);

const WEBHOOK_PATH = /^\/api\/webhooks\/\d+\/[A-Za-z0-9_-]+$/;

export function discordWebhookUrl(
  env: NodeJS.ProcessEnv = process.env
): string {
  return env[DISCORD_WEBHOOK_ENV]?.trim() ?? '';
}

/** Parse + host-allowlist. Regex-on-string is not enough for open-redirect hosts. */
export function parseDiscordWebhookUrl(value: string): URL | null {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return null;
  }
  if (parsed.protocol !== 'https:') return null;
  if (parsed.username || parsed.password) return null;
  if (parsed.search || parsed.hash) return null;
  if (!DISCORD_WEBHOOK_HOSTS.has(parsed.hostname.toLowerCase())) return null;
  if (!WEBHOOK_PATH.test(parsed.pathname)) return null;
  return parsed;
}

export function isDiscordWebhookUrl(value: string): boolean {
  return parseDiscordWebhookUrl(value) !== null;
}

export type DiscordPublisherOptions = {
  webhookUrl?: string;
  fetchImpl?: typeof fetch;
};

export function createDiscordPublisher(
  options: DiscordPublisherOptions = {}
): DigestPublisher {
  const fetchImpl = options.fetchImpl ?? fetch;

  return {
    id: 'discord',
    async publish(messages: readonly DigestMessage[]): Promise<PublishResult> {
      const configured = options.webhookUrl ?? discordWebhookUrl();
      if (!configured) {
        return {
          publisher: 'discord',
          status: 'skipped',
          reason: 'webhook-unset',
        };
      }
      const webhook = parseDiscordWebhookUrl(configured);
      if (!webhook) {
        return {
          publisher: 'discord',
          status: 'skipped',
          reason: 'webhook-invalid',
        };
      }

      let posted = 0;
      try {
        for (const message of messages) {
          const response = await fetchImpl(webhook.href, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              content: message.text,
              allowed_mentions: { parse: [] },
            }),
          });
          if (!response.ok) {
            return {
              publisher: 'discord',
              status: 'failed',
              reason: redactSecrets(`http-${response.status}`),
              posted,
            };
          }
          posted += 1;
        }
        return { publisher: 'discord', status: 'published', posted };
      } catch (error) {
        return {
          publisher: 'discord',
          status: 'failed',
          reason: safeErrorReason(error),
          posted,
        };
      }
    },
  };
}

/** Active publishers. Threads/X stay off this list until they are implemented. */
export function createConfiguredPublishers(
  options: DiscordPublisherOptions = {}
): DigestPublisher[] {
  return [createDiscordPublisher(options)];
}
