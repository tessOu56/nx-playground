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
    assert.match(csp, new RegExp(`script-src[^;]*'nonce-${nonce.replace(/[+/]/g, '\\$&')}'`));
    assert.match(csp, /script-src[^;]*https:\/\/va\.vercel-scripts\.com/);
    assert.match(csp, /connect-src[^;]*https:\/\/vitals\.vercel-insights\.com/);
    assert.match(csp, /connect-src[^;]*https:\/\/access\.line\.me/);
    assert.match(csp, /connect-src[^;]*https:\/\/accounts\.google\.com/);
    assert.match(csp, /form-action[^;]*https:\/\/access\.line\.me/);
    assert.match(csp, /form-action[^;]*https:\/\/accounts\.google\.com/);
    for (const host of CSP_IMAGE_HOSTS) {
      assert.match(csp, new RegExp(host.replace(/[./]/g, '\\$&')));
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
