import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  LINE_TW_PROVIDER_ID,
  findIdentityUserIdByLineSub,
  lineTwAccountKey,
  optionalEmail,
  stripProviderSecrets,
} from './line-account-map';

describe('LINE login callback mapping', () => {
  it('keys existing LINE users by line-tw + sub', () => {
    assert.deepEqual(lineTwAccountKey(' U123 '), {
      providerId: LINE_TW_PROVIDER_ID,
      accountId: 'U123',
    });
  });

  it('returns the existing identity user for a known LINE sub', async () => {
    const db = {
      identityAccount: {
        async findUnique(args: {
          where: {
            providerId_accountId: { providerId: string; accountId: string };
          };
        }) {
          assert.equal(args.where.providerId_accountId.providerId, 'line-tw');
          assert.equal(args.where.providerId_accountId.accountId, 'Uexisting');
          return { userId: 'identity_existing' };
        },
      },
    };
    await assert.equal(
      await findIdentityUserIdByLineSub(db, 'Uexisting'),
      'identity_existing'
    );
  });

  it('does not invent an account when the LINE sub is unknown', async () => {
    const db = {
      identityAccount: {
        async findUnique() {
          return null;
        },
      },
    };
    await assert.equal(await findIdentityUserIdByLineSub(db, 'Unew'), null);
  });

  it('strips provider tokens and drops empty emails', () => {
    assert.deepEqual(
      stripProviderSecrets({
        accessToken: 'at',
        refreshToken: 'rt',
        idToken: 'id',
        accountId: 'U123',
      }),
      {
        accessToken: null,
        refreshToken: null,
        idToken: null,
        accountId: 'U123',
      }
    );
    assert.equal(optionalEmail(''), undefined);
    assert.equal(optionalEmail(' user@example.com '), 'user@example.com');
  });
});
