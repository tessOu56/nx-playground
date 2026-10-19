import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { demoCopy, priceFromLabel } from './demo-copy';

describe('demo-copy', () => {
  it('localizes price-from and guest honesty', () => {
    assert.equal(priceFromLabel(800, 'zh-TW'), 'NT$ 800 起');
    assert.equal(priceFromLabel(800, 'en'), 'From NT$ 800');
    assert.equal(priceFromLabel(0, 'en'), 'Free');
    assert.match(demoCopy('en').homeLead, /user_demo/);
    assert.match(demoCopy('zh-TW').demoBannerBody, /不是 Nest 資金 API/);
    assert.equal(demoCopy('en').searchEvents, 'Search events');
    assert.equal(demoCopy('zh-TW').backToEvents, '回到活動列表');
    assert.equal(demoCopy('en').sessions, 'Sessions');
    assert.equal(demoCopy('en').skipToContent, 'Skip to content');
  });

  it('scaffolds Japanese discovery copy and leaves ticketing keys in English', () => {
    const copy = demoCopy('ja');
    assert.equal(copy.navEvents, '展覧会');
    assert.equal(copy.venue, '会場');
    assert.equal(copy.when, '会期');
    assert.equal(copy.free, '無料');
    assert.match(copy.homeLead, /台北と東京/);
    assert.equal(copy.searchEvents, '展覧会を検索');
    assert.equal(copy.skipToContent, '本文へスキップ');
    assert.equal(copy.langJa, '日本語');
    assert.equal(copy.checkoutTitle, 'Choose tickets');
    assert.equal(copy.cash, 'Pay at the door');
  });
});
