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
  });
});
