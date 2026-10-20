import { redactSecrets, safeErrorReason } from './redact';
import type {
  DigestMessage,
  DigestPublisher,
  PublishResult,
} from './types';

export const DISCORD_WEBHOOK_ENV = 'DISCORD_WEBHOOK_URL';

const DISCORD_WEBHOOK_RE =
  /^https:\/\/(?:(?:canary|ptb)\.)?discord(?:app)?\.com\/api\/webhooks\/\d+\/[A-Za-z0-9_-]+$/;

export function discordWebhookUrl(
  env: NodeJS.ProcessEnv = process.env
): string {
  return env[DISCORD_WEBHOOK_ENV]?.trim() ?? '';
}

export function isDiscordWebhookUrl(value: string): boolean {
  return DISCORD_WEBHOOK_RE.test(value);
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
      const webhookUrl = options.webhookUrl ?? discordWebhookUrl();
      if (!webhookUrl) {
        return {
          publisher: 'discord',
          status: 'skipped',
          reason: 'webhook-unset',
        };
      }
      if (!isDiscordWebhookUrl(webhookUrl)) {
        return {
          publisher: 'discord',
          status: 'skipped',
          reason: 'webhook-invalid',
        };
      }

      let posted = 0;
      try {
        for (const message of messages) {
          const response = await fetchImpl(webhookUrl, {
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
