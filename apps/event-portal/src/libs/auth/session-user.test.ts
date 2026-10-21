import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { readPortalSessionUser } from './session-user';

describe('readPortalSessionUser', () => {
  it('reads custom session fields from Better Auth get-session', () => {
    const user = readPortalSessionUser({
      id: 'usr_1',
      name: 'Ada',
      email: 'ada@example.com',
      image: 'https://example.com/ada.png',
      roles: ['organizer', 'user', 'admin'],
      lineId: 'U123',
    });
    assert.deepEqual(user, {
      id: 'usr_1',
      name: 'Ada',
      email: 'ada@example.com',
      image: 'https://example.com/ada.png',
      roles: ['organizer', 'admin'],
      lineId: 'U123',
    });
  });

  it('defaults missing LINE id and elevated roles', () => {
    const user = readPortalSessionUser({ id: 'usr_2' });
    assert.deepEqual(user, {
      id: 'usr_2',
      name: null,
      email: null,
      image: null,
      roles: [],
      lineId: null,
    });
  });

  it('rejects a session user without an id', () => {
    assert.equal(readPortalSessionUser({ name: 'Ada' }), null);
    assert.equal(readPortalSessionUser(null), null);
  });
});
