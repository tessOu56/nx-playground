import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { catalogPriceLabel, demoCopy, priceFromLabel } from './demo-copy';

describe('demo-copy', () => {
  it('localizes exhibition discovery copy in zh-TW and en', () => {
    assert.equal(priceFromLabel(800, 'zh-TW'), 'NT$ 800 起');
    assert.equal(priceFromLabel(800, 'en'), 'From NT$ 800');
    assert.equal(priceFromLabel(0, 'en'), 'Free');
    assert.equal(
      catalogPriceLabel({ price: 0, priceText: '¥1,800' }, 'en'),
      '¥1,800'
    );
    assert.match(demoCopy('en').homeLead, /Taipei and Tokyo/);
    assert.match(demoCopy('zh-TW').demoBannerBody, /官方頁面/);
    assert.equal(demoCopy('en').searchEvents, 'Search exhibitions');
    assert.match(demoCopy('en').searchHint, /type/);
    assert.match(demoCopy('en').searchKeyboardHint, /Enter/);
    assert.equal(demoCopy('zh-TW').searchErrorRateLimit.includes('太多'), true);
    assert.equal(demoCopy('ja').searching, '検索中…');
    assert.equal(demoCopy('zh-TW').backToEvents, '回到展覽目錄');
    assert.equal(demoCopy('en').sessions, 'Schedule');
    assert.equal(demoCopy('en').skipToContent, 'Skip to content');
    assert.equal(demoCopy('en').lineChat, 'Ask on LINE');
    assert.equal(demoCopy('zh-TW').officialSource, '官方頁面');
    assert.equal(
      demoCopy('en').emptyCity('TOKYO'),
      'No exhibitions listed in Tokyo'
    );
    assert.equal(demoCopy('zh-TW').endedNotice, '這檔展覽已結束');
    assert.equal(
      demoCopy('en').lineLoginCancelled,
      'LINE sign-in was cancelled'
    );
    assert.equal(
      demoCopy('ja').lineOutside,
      'このページは LINE で開いてください'
    );
    assert.equal(demoCopy('en').shareListing, 'Share this listing');
    assert.equal(demoCopy('zh-TW').retryLogin, '再試一次登入');
    assert.equal(demoCopy('ja').appError, 'ページで問題が起きました');
    assert.equal(demoCopy('en').navAccount, 'Account');
    assert.equal(demoCopy('en').passkeyLogin, 'Sign in with passkey');
    assert.match(
      demoCopy('en').alreadyLinkedToOtherUser,
      /already linked to another user/
    );
    assert.match(demoCopy('zh-TW').lastSignInMethod, /至少要保留/);
    assert.match(demoCopy('en').sessionNotFresh, /Sign in again/);
  });

  it('localizes Japanese discovery copy and retired ticketing keys', () => {
    const copy = demoCopy('ja');
    assert.equal(copy.navEvents, '展覧会');
    assert.equal(copy.venue, '会場');
    assert.equal(copy.when, '会期');
    assert.equal(copy.free, '無料');
    assert.match(copy.homeLead, /台北と東京/);
    assert.equal(copy.searchEvents, '展覧会を検索');
    assert.equal(copy.skipToContent, '本文へスキップ');
    assert.equal(copy.langJa, '日本語');
    assert.equal(copy.checkoutTitle, 'チケット販売は終了しました');
    assert.equal(copy.cash, '現地払い');
    assert.equal(copy.region.TOKYO, '東京');
  });
});
