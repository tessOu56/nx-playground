import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { publicHref, publicHttpsUrl } from './https-url';

describe('publicHttpsUrl', () => {
  it('keeps ordinary https hosts', () => {
    assert.equal(
      publicHttpsUrl('https://www.tfam.museum/visit'),
      'https://www.tfam.museum/visit'
    );
  });

  it('drops javascript, http, credentials, localhost, and raw IPs', () => {
    assert.equal(publicHttpsUrl('javascript:alert(1)'), null);
    assert.equal(publicHttpsUrl('http://www.tfam.museum/'), null);
    assert.equal(publicHttpsUrl('https://user:pass@evil.example/x'), null);
    assert.equal(publicHttpsUrl('https://localhost/secret'), null);
    assert.equal(publicHttpsUrl('https://foo.localhost/secret'), null);
    assert.equal(publicHttpsUrl('https://169.254.169.254/latest'), null);
    assert.equal(publicHttpsUrl('https://metadata.google.internal/'), null);
  });
});

describe('publicHref', () => {
  it('allows same-origin paths and public https', () => {
    assert.equal(publicHref('/zh-TW/events'), '/zh-TW/events');
    assert.equal(publicHref('https://www.tfam.museum/'), 'https://www.tfam.museum/');
  });

  it('rejects protocol-relative, javascript, and data URLs', () => {
    assert.equal(publicHref('//evil.example/phish'), null);
    assert.equal(publicHref('javascript:alert(1)'), null);
    assert.equal(publicHref('data:text/html,hi'), null);
  });
});
