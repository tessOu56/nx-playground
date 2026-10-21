import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { identityAuthErrorKey, identityAuthErrorText } from './auth-errors';

describe('identityAuthErrorKey', () => {
  it('maps already-linked-to-another-user from Better Auth codes and query params', () => {
    assert.equal(
      identityAuthErrorKey({
        code: 'ACCOUNT_ALREADY_LINKED_TO_DIFFERENT_USER',
      }),
      'alreadyLinkedToOtherUser'
    );
    assert.equal(
      identityAuthErrorKey({
        error: 'account_already_linked_to_different_user',
      }),
      'alreadyLinkedToOtherUser'
    );
    assert.equal(
      identityAuthErrorKey({
        message: 'The account is already linked to a different user.',
      }),
      'alreadyLinkedToOtherUser'
    );
  });

  it('maps last-method unlink and passkey delete', () => {
    assert.equal(
      identityAuthErrorKey({ code: 'FAILED_TO_UNLINK_LAST_ACCOUNT' }),
      'lastSignInMethod'
    );
    assert.equal(
      identityAuthErrorKey({ code: 'LAST_SIGN_IN_METHOD' }),
      'lastSignInMethod'
    );
  });

  it('maps implicit-link rejection so the user can link from settings instead', () => {
    assert.equal(
      identityAuthErrorKey({ error: 'account_not_linked' }),
      'accountNotLinked'
    );
  });

  it('returns null when no error is present', () => {
    assert.equal(identityAuthErrorKey({}), null);
    assert.equal(identityAuthErrorKey({ error: '   ' }), null);
  });

  it('renders a clear already-linked-to-another-user message', () => {
    assert.equal(
      identityAuthErrorText(
        {
          alreadyLinkedToOtherUser: 'linked to another user',
          lastSignInMethod: 'keep one method',
          accountNotLinked: 'link from settings',
          sessionNotFresh: 'sign in again',
          fallback: 'try again',
        },
        { error: 'account_already_linked_to_different_user' }
      ),
      'linked to another user'
    );
  });
});
