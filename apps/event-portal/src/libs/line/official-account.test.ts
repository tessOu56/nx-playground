import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  lineOfficialAccountId,
  lineOfficialAccountUrl,
} from './official-account';

describe('official-account', () => {
  it('uses the documented public OA id', () => {
    assert.equal(lineOfficialAccountId(), '@006dcvmv');
    assert.equal(lineOfficialAccountUrl(), 'https://line.me/R/ti/p/@006dcvmv');
  });
});
