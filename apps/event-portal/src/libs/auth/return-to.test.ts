import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { safeAuthReturnTo } from './return-to';

describe('safeAuthReturnTo', () => {
  it('allows CMS localhost and rejects open redirects', () => {
    assert.equal(
      safeAuthReturnTo(
        'http://localhost:3002/events',
        'http://localhost:3000'
      ),
      'http://localhost:3002/events'
    );
    assert.equal(
      safeAuthReturnTo('https://evil.example/phish', 'http://localhost:3000'),
      'http://localhost:3000/zh-TW/events'
    );
  });
});
