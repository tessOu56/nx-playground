import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  MOC_EXHIBITION_URL,
  assertMocOpenDataUrl,
  fetchMocExhibitions,
} from './fetch';

describe('assertMocOpenDataUrl', () => {
  it('accepts the Ministry of Culture open-data URL', () => {
    assert.equal(assertMocOpenDataUrl(MOC_EXHIBITION_URL), MOC_EXHIBITION_URL);
  });

  it('rejects private hosts, http, and credentialed URLs', () => {
    assert.throws(() => assertMocOpenDataUrl('https://127.0.0.1/x'), /allowlisted/);
    assert.throws(
      () => assertMocOpenDataUrl('https://169.254.169.254/latest/meta-data/'),
      /allowlisted/
    );
    assert.throws(() => assertMocOpenDataUrl('http://cloud.culture.tw/x'), /https/);
    assert.throws(
      () =>
        assertMocOpenDataUrl('https://user:pass@cloud.culture.tw/frontsite/trans/x'),
      /credentials/
    );
  });
});

describe('fetchMocExhibitions', () => {
  it('does not call fetch when the URL is not allowlisted', async () => {
    await assert.rejects(
      () =>
        fetchMocExhibitions('https://evil.example/open.json', async () => {
          throw new Error('must not fetch');
        }),
      /allowlisted/
    );
  });
});
