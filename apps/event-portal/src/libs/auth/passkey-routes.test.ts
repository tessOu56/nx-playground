import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  DELETE_PASSKEY_PATH,
  LastSignInMethodError,
  UNLINK_ACCOUNT_PATH,
  assertNotRemovingLastSignInMethod,
  removalForAuthPath,
} from './sign-in-methods';

const PASSKEY_ROUTES = {
  list: '/passkey/list-user-passkeys',
  registerOptions: '/passkey/generate-register-options',
  authenticateOptions: '/passkey/generate-authenticate-options',
  verifyRegistration: '/passkey/verify-registration',
  verifyAuthentication: '/passkey/verify-authentication',
  delete: DELETE_PASSKEY_PATH,
  update: '/passkey/update-passkey',
  signIn: '/sign-in/passkey',
};

describe('passkey and linking routes', () => {
  it('guards unlink and passkey delete, not list/register/sign-in', () => {
    assert.equal(removalForAuthPath(UNLINK_ACCOUNT_PATH), 'account');
    assert.equal(removalForAuthPath(PASSKEY_ROUTES.delete), 'passkey');
    assert.equal(removalForAuthPath(PASSKEY_ROUTES.list), null);
    assert.equal(removalForAuthPath(PASSKEY_ROUTES.registerOptions), null);
    assert.equal(removalForAuthPath(PASSKEY_ROUTES.authenticateOptions), null);
    assert.equal(removalForAuthPath(PASSKEY_ROUTES.verifyRegistration), null);
    assert.equal(removalForAuthPath(PASSKEY_ROUTES.verifyAuthentication), null);
    assert.equal(removalForAuthPath(PASSKEY_ROUTES.update), null);
    assert.equal(removalForAuthPath(PASSKEY_ROUTES.signIn), null);
    assert.equal(removalForAuthPath('/link-social'), null);
  });

  it('enforces last-method on passkey delete when no social account remains', async () => {
    const db = {
      identityAccount: {
        async count() {
          return 0;
        },
      },
      identityPasskey: {
        async count() {
          return 1;
        },
      },
    };
    await assert.rejects(
      () =>
        assertNotRemovingLastSignInMethod({
          db,
          userId: 'usr_last_passkey',
          removing: 'passkey',
        }),
      LastSignInMethodError
    );
  });

  it('allows passkey delete when a linked social account remains', async () => {
    const db = {
      identityAccount: {
        async count() {
          return 1;
        },
      },
      identityPasskey: {
        async count() {
          return 1;
        },
      },
    };
    await assertNotRemovingLastSignInMethod({
      db,
      userId: 'usr_google_and_passkey',
      removing: 'passkey',
    });
  });
});
