import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { parseLineAuthNotice } from './line-auth-notice';

describe('parseLineAuthNotice', () => {
  it('maps cancelled login, failed login, and opened-outside-LINE', () => {
    assert.equal(
      parseLineAuthNotice(new URLSearchParams('error=access_denied')),
      'cancelled'
    );
    assert.equal(
      parseLineAuthNotice(new URLSearchParams('error=server_error')),
      'failed'
    );
    assert.equal(
      parseLineAuthNotice(new URLSearchParams('liff.state=abc'), {
        isInClient: false,
      }),
      'outside'
    );
    assert.equal(
      parseLineAuthNotice(new URLSearchParams('liff.state=abc'), {
        isInClient: true,
      }),
      null
    );
    assert.equal(parseLineAuthNotice(new URLSearchParams()), null);
  });
});
