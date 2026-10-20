import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  exhibitionShareText,
  exhibitionShareUrl,
  lineTextShareHref,
} from './exhibition-share';

describe('exhibitionShareUrl', () => {
  it('builds a locale-prefixed public URL', () => {
    assert.equal(
      exhibitionShareUrl(
        'zh-TW',
        'event_sample_tfam',
        'https://nx-event-portal.vercel.app'
      ),
      'https://nx-event-portal.vercel.app/zh-TW/events/event_sample_tfam'
    );
  });
});

describe('exhibitionShareText', () => {
  it('puts the listing URL on its own line', () => {
    assert.equal(
      exhibitionShareText('TFAM', 'https://example.test/zh-TW/events/tfam'),
      'TFAM\nhttps://example.test/zh-TW/events/tfam'
    );
  });
});

describe('lineTextShareHref', () => {
  it('encodes the message for LINE text share', () => {
    const href = lineTextShareHref('TFAM\nhttps://example.test/x');
    assert.equal(href.startsWith('https://line.me/R/msg/text/?'), true);
    assert.equal(href.includes('javascript:'), false);
  });
});
