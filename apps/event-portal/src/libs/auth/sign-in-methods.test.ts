import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  LastSignInMethodError,
  DELETE_PASSKEY_PATH,
  UNLINK_ACCOUNT_PATH,
  assertNotRemovingLastSignInMethod,
  loadSignInMethodCounts,
  removalForAuthPath,
  signInMethodCount,
  wouldRemoveLastSignInMethod,
} from './sign-in-methods';

function fakeDb(counts: { accounts: number; passkeys: number }) {
  return {
    identityAccount: {
      async count() {
        return counts.accounts;
      },
    },
    identityPasskey: {
      async count() {
        return counts.passkeys;
      },
    },
  };
}

describe('sign-in method linking rules', () => {
  it('maps unlink and passkey delete routes', () => {
    assert.equal(removalForAuthPath(UNLINK_ACCOUNT_PATH), 'account');
    assert.equal(removalForAuthPath(DELETE_PASSKEY_PATH), 'passkey');
    assert.equal(removalForAuthPath('/passkey/list-user-passkeys'), null);
    assert.equal(removalForAuthPath('/sign-in/passkey'), null);
  });

  it('counts social accounts and passkeys as sign-in methods', () => {
    assert.equal(signInMethodCount({ accounts: 1, passkeys: 2 }), 3);
    assert.equal(signInMethodCount({ accounts: 0, passkeys: 0 }), 0);
  });

  it('blocks removing the last remaining method', () => {
    assert.equal(
      wouldRemoveLastSignInMethod({ accounts: 1, passkeys: 0 }, 'account'),
      true
    );
    assert.equal(
      wouldRemoveLastSignInMethod({ accounts: 0, passkeys: 1 }, 'passkey'),
      true
    );
  });

  it('allows unlink when a passkey remains, and passkey delete when a social remains', () => {
    assert.equal(
      wouldRemoveLastSignInMethod({ accounts: 1, passkeys: 1 }, 'account'),
      false
    );
    assert.equal(
      wouldRemoveLastSignInMethod({ accounts: 1, passkeys: 1 }, 'passkey'),
      false
    );
    assert.equal(
      wouldRemoveLastSignInMethod({ accounts: 2, passkeys: 0 }, 'account'),
      false
    );
    assert.equal(
      wouldRemoveLastSignInMethod({ accounts: 0, passkeys: 2 }, 'passkey'),
      false
    );
  });

  it('loads counts from identity tables', async () => {
    assert.deepEqual(
      await loadSignInMethodCounts(
        fakeDb({ accounts: 2, passkeys: 1 }),
        'usr_1'
      ),
      {
        accounts: 2,
        passkeys: 1,
      }
    );
  });

  it('throws when unlinking or deleting the last method', async () => {
    await assert.rejects(
      () =>
        assertNotRemovingLastSignInMethod({
          db: fakeDb({ accounts: 1, passkeys: 0 }),
          userId: 'usr_1',
          removing: 'account',
        }),
      LastSignInMethodError
    );
    await assert.rejects(
      () =>
        assertNotRemovingLastSignInMethod({
          db: fakeDb({ accounts: 0, passkeys: 1 }),
          userId: 'usr_1',
          removing: 'passkey',
        }),
      LastSignInMethodError
    );
    await assertNotRemovingLastSignInMethod({
      db: fakeDb({ accounts: 1, passkeys: 1 }),
      userId: 'usr_1',
      removing: 'account',
    });
  });
});
