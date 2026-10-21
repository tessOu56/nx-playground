import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { publicUserInfo } from './storage';

describe('publicUserInfo', () => {
  it('strips access and id tokens from any cached LINE profile', () => {
    const publicProfile = publicUserInfo({
      lineId: 'U1',
      accessToken: 'must-not-persist',
      idToken: 'must-not-persist',
      profile: { userId: 'U1', displayName: 'Ada' },
    });
    assert.equal(publicProfile.lineId, 'U1');
    assert.equal(publicProfile.accessToken, null);
    assert.equal(publicProfile.idToken, null);
    assert.equal(publicProfile.profile.displayName, 'Ada');
  });
});
