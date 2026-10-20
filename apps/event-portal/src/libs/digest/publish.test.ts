import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  createConfiguredPublishers,
  createDiscordPublisher,
  discordWebhookUrl,
  isDiscordWebhookUrl,
} from './publish';
import { redactSecrets } from './redact';
import type { DigestMessage } from './types';

const WEBHOOK =
  'https://discord.com/api/webhooks/123456789012345678/abcdefghijklmnopqrstuvwxyzABCDEF';

const MESSAGES: DigestMessage[] = [
  { locale: 'zh', text: '台北摘要' },
  { locale: 'ja', text: '東京ダイジェスト' },
  { locale: 'en', text: 'Weekly digest' },
];

describe('discord webhook config', () => {
  it('treats a missing or blank DISCORD_WEBHOOK_URL as unset', () => {
    assert.equal(discordWebhookUrl({}), '');
    assert.equal(discordWebhookUrl({ DISCORD_WEBHOOK_URL: '  ' }), '');
  });

  it('accepts only Discord webhook HTTPS URLs', () => {
    assert.equal(isDiscordWebhookUrl(WEBHOOK), true);
    assert.equal(
      isDiscordWebhookUrl('https://ptb.discord.com/api/webhooks/1/token'),
      true
    );
    assert.equal(
      isDiscordWebhookUrl('https://example.com/api/webhooks/1/token'),
      false
    );
    assert.equal(isDiscordWebhookUrl('http://discord.com/api/webhooks/1/t'), false);
    assert.equal(
      isDiscordWebhookUrl(
        `https://evil.example/?next=${WEBHOOK}`
      ),
      false
    );
    assert.equal(
      isDiscordWebhookUrl(
        'https://discord.com.evil.example/api/webhooks/1/token'
      ),
      false
    );
    assert.equal(
      isDiscordWebhookUrl(`${WEBHOOK}?wait=true`),
      false
    );
  });
});

describe('createDiscordPublisher', () => {
  it('is a no-op when the webhook URL is unset', async () => {
    const calls: unknown[] = [];
    const publisher = createDiscordPublisher({
      webhookUrl: '',
      fetchImpl: async (...args) => {
        calls.push(args);
        return new Response('ok', { status: 204 });
      },
    });
    const result = await publisher.publish(MESSAGES);
    assert.deepEqual(result, {
      publisher: 'discord',
      status: 'skipped',
      reason: 'webhook-unset',
    });
    assert.equal(calls.length, 0);
  });

  it('skips an invalid webhook without posting', async () => {
    const publisher = createDiscordPublisher({
      webhookUrl: 'https://evil.example/hook',
      fetchImpl: async () => {
        throw new Error('should not fetch');
      },
    });
    const result = await publisher.publish(MESSAGES);
    assert.equal(result.status, 'skipped');
    assert.equal(result.reason, 'webhook-invalid');
    assert.ok(!JSON.stringify(result).includes('evil.example'));
  });

  it('posts one Discord message per locale and never returns the URL', async () => {
    const bodies: string[] = [];
    const urls: string[] = [];
    const publisher = createDiscordPublisher({
      webhookUrl: WEBHOOK,
      fetchImpl: async (input, init) => {
        urls.push(String(input));
        bodies.push(String(init?.body ?? ''));
        return new Response(null, { status: 204 });
      },
    });
    const result = await publisher.publish(MESSAGES);
    assert.deepEqual(result, {
      publisher: 'discord',
      status: 'published',
      posted: 3,
    });
    assert.equal(bodies.length, 3);
    assert.match(bodies[0] ?? '', /台北摘要/);
    assert.ok(!JSON.stringify(result).includes(WEBHOOK));
    assert.equal(urls[0], WEBHOOK);
  });

  it('redacts webhook URLs from failed fetch reasons', async () => {
    const publisher = createDiscordPublisher({
      webhookUrl: WEBHOOK,
      fetchImpl: async () => {
        throw new Error(`fetch failed ${WEBHOOK}`);
      },
    });
    const result = await publisher.publish(MESSAGES);
    assert.equal(result.status, 'failed');
    assert.ok(result.reason);
    assert.ok(!result.reason.includes(WEBHOOK));
    assert.match(result.reason, /\[redacted\]/);
  });
});

describe('publisher registry', () => {
  it('exposes Discord only; Threads/X stay unimplemented', () => {
    const publishers = createConfiguredPublishers({ webhookUrl: '' });
    assert.deepEqual(
      publishers.map(publisher => publisher.id),
      ['discord']
    );
  });
});

describe('redactSecrets', () => {
  it('strips webhook URLs and env assignments', () => {
    assert.equal(
      redactSecrets(`posted ${WEBHOOK} DISCORD_WEBHOOK_URL=${WEBHOOK}`),
      'posted https://discord.com/api/webhooks/[redacted] DISCORD_WEBHOOK_URL=[redacted]'
    );
  });
});
