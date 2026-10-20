import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { describe, it } from 'node:test';

import { createLineLoginPkce, isLinePkceVerifier } from './pkce';

describe('createLineLoginPkce', () => {
  it('issues a CSPRNG state and S256 challenge for a valid verifier', async () => {
    const first = await createLineLoginPkce();
    const second = await createLineLoginPkce();

    assert.notEqual(first.state, second.state);
    assert.notEqual(first.codeVerifier, second.codeVerifier);
    assert.equal(isLinePkceVerifier(first.codeVerifier), true);

    const digest = createHash('sha256').update(first.codeVerifier).digest();
    const expected = digest
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    assert.equal(first.codeChallenge, expected);
  });

  it('rejects truncated or padded verifiers', () => {
    assert.equal(isLinePkceVerifier('short'), false);
    assert.equal(isLinePkceVerifier('a'.repeat(43) + '+'), false);
    assert.equal(isLinePkceVerifier('a'.repeat(43)), true);
  });
});
