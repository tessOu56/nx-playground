import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { lineSignatureHeader, verifyLineSignature } from './signature';

const SECRET = 'test-channel-secret';
const BODY = '{"destination":"U1","events":[]}';

describe('verifyLineSignature', () => {
  it('accepts a valid HMAC-SHA256 signature of the raw body', () => {
    const signature = lineSignatureHeader(BODY, SECRET);
    assert.equal(verifyLineSignature(BODY, signature, SECRET), true);
  });

  it('rejects a tampered body', () => {
    const signature = lineSignatureHeader(BODY, SECRET);
    assert.equal(
      verifyLineSignature(BODY.replace('U1', 'U2'), signature, SECRET),
      false
    );
  });

  it('rejects a signature computed with a different secret', () => {
    const signature = lineSignatureHeader(BODY, 'other-secret');
    assert.equal(verifyLineSignature(BODY, signature, SECRET), false);
  });

  it('rejects missing or empty inputs without throwing', () => {
    const signature = lineSignatureHeader(BODY, SECRET);
    assert.equal(verifyLineSignature(BODY, signature, ''), false);
    assert.equal(verifyLineSignature(BODY, '', SECRET), false);
    assert.equal(verifyLineSignature(BODY, null, SECRET), false);
    assert.equal(verifyLineSignature(BODY, undefined, SECRET), false);
  });

  it('rejects a truncated base64 digest (length mismatch)', () => {
    const signature = lineSignatureHeader(BODY, SECRET);
    assert.equal(verifyLineSignature(BODY, signature.slice(0, 8), SECRET), false);
  });

  it('accepts the same HMAC over raw bytes as over the UTF-8 string', () => {
    const raw = Buffer.from(BODY, 'utf8');
    const signature = lineSignatureHeader(raw, SECRET);
    assert.equal(verifyLineSignature(raw, signature, SECRET), true);
    assert.equal(verifyLineSignature(BODY, signature, SECRET), true);
  });
});
