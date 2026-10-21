import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it, vi } from 'vitest';

import {
  authorizeCmsBffRequest,
  cmsBffOriginsFromEnv,
  nestApiBaseFromEnv,
  type CmsBffConfig,
} from '../server/cms-bff';

function config(overrides: Partial<CmsBffConfig> = {}): CmsBffConfig {
  return {
    nestApiBaseUrl: 'http://localhost:3001/api',
    authUrl: 'http://localhost:3000',
    nodeEnv: 'production',
    allowedOrigins: ['http://localhost:3002'],
    ...overrides,
  };
}

describe('authorizeCmsBffRequest', () => {
  it('fails closed without an organizer session', async () => {
    const issueOrganizerAccess = vi.fn(async () => null);
    await expect(
      authorizeCmsBffRequest({
        method: 'POST',
        origin: 'http://localhost:3002',
        cookie: 'better-auth.session_token=abc',
        config: config({ issueOrganizerAccess }),
      })
    ).resolves.toEqual({
      ok: false,
      status: 401,
      body: '{"message":"Unauthorized"}',
    });
    expect(issueOrganizerAccess).toHaveBeenCalled();
  });

  it('rejects an attendee session without organizer/admin', async () => {
    await expect(
      authorizeCmsBffRequest({
        method: 'GET',
        cookie: 'better-auth.session_token=abc',
        config: config({
          issueOrganizerAccess: async () => null,
        }),
      })
    ).resolves.toMatchObject({ ok: false, status: 401 });
  });

  it('forwards a Better Auth JWT after an organizer session', async () => {
    const result = await authorizeCmsBffRequest({
      method: 'POST',
      origin: 'http://localhost:3002',
      cookie: 'better-auth.session_token=abc',
      config: config({
        issueOrganizerAccess: async () => ({
          id: 'user_1',
          roles: ['organizer'],
          token: 'short-lived-jwt',
        }),
      }),
    });
    expect(result).toEqual({
      ok: true,
      authorization: 'Bearer short-lived-jwt',
    });
  });

  it('issues a JWT only after get-session shows organizer or admin', async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith('/api/auth/get-session')) {
        return new Response(
          JSON.stringify({
            user: { id: 'user_1', roles: ['organizer'] },
          }),
          { status: 200 }
        );
      }
      if (url.endsWith('/api/auth/token')) {
        return new Response(JSON.stringify({ token: 'short-lived-jwt' }), {
          status: 200,
        });
      }
      return new Response('not found', { status: 404 });
    });
    await expect(
      authorizeCmsBffRequest({
        method: 'POST',
        origin: 'http://localhost:3002',
        cookie: 'better-auth.session_token=abc',
        config: config({ fetchImpl: fetchImpl as unknown as typeof fetch }),
      })
    ).resolves.toEqual({
      ok: true,
      authorization: 'Bearer short-lived-jwt',
    });
  });

  it('denies CMS access for an attendee session', async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith('/api/auth/get-session')) {
        return new Response(
          JSON.stringify({ user: { id: 'attendee', roles: [] } }),
          { status: 200 }
        );
      }
      return new Response(JSON.stringify({ token: 'should-not-issue' }), {
        status: 200,
      });
    });
    await expect(
      authorizeCmsBffRequest({
        method: 'GET',
        cookie: 'better-auth.session_token=abc',
        config: config({ fetchImpl: fetchImpl as unknown as typeof fetch }),
      })
    ).resolves.toMatchObject({ ok: false, status: 401 });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('rejects production mutations from an unexpected Origin', async () => {
    await expect(
      authorizeCmsBffRequest({
        method: 'DELETE',
        origin: 'https://evil.example',
        cookie: 'better-auth.session_token=abc',
        config: config({
          issueOrganizerAccess: async () => ({
            id: 'user_1',
            roles: ['admin'],
            token: 'short-lived-jwt',
          }),
        }),
      })
    ).resolves.toMatchObject({ ok: false, status: 403 });
  });
});

describe('cms BFF env helpers', () => {
  it('never treats /cms-api as the Nest upstream', () => {
    expect(nestApiBaseFromEnv({ VITE_API_BASE_URL: '/cms-api' })).toBe(
      'http://localhost:3001/api'
    );
    expect(
      nestApiBaseFromEnv({
        VITE_API_BASE_URL: '/cms-api',
        EVENT_STACK_NEST_URL: 'https://nest.example/api',
      })
    ).toBe('https://nest.example/api');
    expect(
      nestApiBaseFromEnv({ VITE_API_BASE_URL: 'http://localhost:3011/api' })
    ).toBe('http://localhost:3011/api');
  });

  it('defaults local CMS origins', () => {
    expect(cmsBffOriginsFromEnv({})).toEqual([
      'http://localhost:3002',
      'http://127.0.0.1:3002',
    ]);
  });
});

describe('CMS client bundle', () => {
  it('does not inline privileged tokens into Vite define', () => {
    const src = readFileSync(resolve(__dirname, '../vite.config.ts'), 'utf8');
    expect(src).not.toMatch(/VITE_CMS_ORGANIZER_API_TOKEN/);
    expect(src).not.toMatch(/['"]process\.env\.ADMIN_API_TOKEN['"]\s*:/);
    expect(src).toMatch(/['"]\/cms-api['"]/);
  });
});
