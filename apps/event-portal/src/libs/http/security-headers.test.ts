import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  CSP_IMAGE_HOSTS,
  PERMISSIONS_POLICY,
  applySecurityHeaders,
  contentSecurityPolicyReportOnly,
  createCspNonce,
} from './security-headers';

describe('event-portal security headers', () => {
  it('builds a report-only CSP scoped to self, analytics, OAuth, and image hosts', () => {
    const nonce = 'testNonce+/0';
    const csp = contentSecurityPolicyReportOnly(nonce);

    assert.match(csp, /default-src 'self'/);
    assert.ok(csp.includes(`'nonce-${nonce}'`));
    assert.ok(csp.includes('https://va.vercel-scripts.com'));
    assert.ok(csp.includes('https://vitals.vercel-insights.com'));
    assert.ok(csp.includes('https://access.line.me'));
    assert.ok(csp.includes('https://accounts.google.com'));
    assert.ok(csp.includes("form-action 'self' https://access.line.me https://accounts.google.com"));
    for (const host of CSP_IMAGE_HOSTS) {
      assert.ok(csp.includes(host), `missing image host ${host}`);
    }
    assert.doesNotMatch(csp, /discord/i);
    assert.match(csp, /object-src 'none'/);
    assert.match(csp, /frame-ancestors 'none'/);
  });

  it('allows WebAuthn on self and denies unused powerful features', () => {
    assert.match(PERMISSIONS_POLICY, /publickey-credentials-get=\(self\)/);
    assert.match(PERMISSIONS_POLICY, /publickey-credentials-create=\(self\)/);
    assert.match(PERMISSIONS_POLICY, /camera=\(\)/);
    assert.match(PERMISSIONS_POLICY, /microphone=\(\)/);
    assert.match(PERMISSIONS_POLICY, /geolocation=\(\)/);
  });

  it('creates unique nonces and writes both headers', () => {
    const first = createCspNonce();
    const second = createCspNonce();
    assert.notEqual(first, second);
    assert.ok(first.length >= 16);

    const headers = new Headers();
    applySecurityHeaders(headers, first);
    assert.equal(
      headers.get('Content-Security-Policy-Report-Only'),
      contentSecurityPolicyReportOnly(first)
    );
    assert.equal(headers.get('Permissions-Policy'), PERMISSIONS_POLICY);
  });
});
