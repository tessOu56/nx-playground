import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  CSP_IMAGE_HOSTS,
  PERMISSIONS_POLICY,
  applySecurityHeaders,
  contentSecurityPolicyReportOnly,
  createCspNonce,
} from './security-headers';

function cspTokens(csp: string, directive: string): string[] {
  const prefix = `${directive} `;
  const part = csp.split('; ').find(entry => entry.startsWith(prefix));
  return part ? part.slice(prefix.length).split(' ') : [];
}

describe('event-portal security headers', () => {
  it('builds a report-only CSP scoped to self, analytics, OAuth, and image hosts', () => {
    const nonce = 'testNonce+/0';
    const csp = contentSecurityPolicyReportOnly(nonce);

    assert.deepEqual(cspTokens(csp, 'default-src'), ["'self'"]);
    assert.deepEqual(cspTokens(csp, 'script-src'), [
      "'self'",
      `'nonce-${nonce}'`,
      'https://va.vercel-scripts.com',
      'https://static.line-scdn.net',
      'https://d.line-scdn.net',
      'https://liff.line.me',
      "'unsafe-eval'",
    ]);
    assert.deepEqual(cspTokens(csp, 'style-src'), ["'self'", "'unsafe-inline'"]);
    assert.deepEqual(cspTokens(csp, 'img-src'), [
      "'self'",
      'data:',
      'blob:',
      ...CSP_IMAGE_HOSTS,
      'https://profile.line-scdn.net',
      'https://sprofile.line-scdn.net',
      'https://lh3.googleusercontent.com',
    ]);
    assert.deepEqual(cspTokens(csp, 'font-src'), ["'self'", 'data:']);
    assert.deepEqual(cspTokens(csp, 'connect-src'), [
      "'self'",
      'https://va.vercel-scripts.com',
      'https://vitals.vercel-insights.com',
      'https://va.vercel-insights.com',
      'https://access.line.me',
      'https://api.line.me',
      'https://liff.line.me',
      'https://accounts.google.com',
      'https://oauth2.googleapis.com',
      'https://www.googleapis.com',
      'ws:',
      'wss:',
    ]);
    assert.deepEqual(cspTokens(csp, 'form-action'), [
      "'self'",
      'https://access.line.me',
      'https://accounts.google.com',
    ]);
    assert.deepEqual(cspTokens(csp, 'frame-src'), [
      "'self'",
      'https://access.line.me',
      'https://api.line.me',
      'https://liff.line.me',
      'https://accounts.google.com',
    ]);
    assert.deepEqual(cspTokens(csp, 'worker-src'), ["'self'", 'blob:']);
    assert.deepEqual(cspTokens(csp, 'object-src'), ["'none'"]);
    assert.deepEqual(cspTokens(csp, 'base-uri'), ["'self'"]);
    assert.deepEqual(cspTokens(csp, 'frame-ancestors'), ["'none'"]);
    assert.equal(csp.includes('discord'), false);
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
