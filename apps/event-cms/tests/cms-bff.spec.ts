import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it, vi } from 'vitest';

import {
  authorizeCmsBffRequest,
  cmsBffOriginsFromEnv,
  nestApiBaseFromEnv,
  type CmsBffConfig,
} from '../server/cms-bff';

const token = 'server-only-admin-token';

function config(overrides: Partial<CmsBffConfig> = {}): CmsBffConfig {
  return {
    nestApiBaseUrl: 'http://localhost:3001/api',
    adminApiToken: token,
    kratosPublicUrl: 'http://localhost:4433',
    allowedOrganizerEmails: 'owner@example.com',
    nodeEnv: 'production',
    allowedOrigins: ['http://localhost:3002'],
    ...overrides,
  };
}

describe('authorizeCmsBffRequest', () => {
  it('fails closed when ADMIN_API_TOKEN is unset', async () => {
    const verifySession = vi.fn();
    await expect(
      authorizeCmsBffRequest({
        method: 'POST',
        origin: 'http://localhost:3002',
        cookie: 'ory_kratos_session=abc',
        config: config({ adminApiToken: '', verifySession }),
      })
    ).resolves.toEqual({
      ok: false,
      status: 401,
      body: '{"message":"Unauthorized"}',
    });
    expect(verifySession).not.toHaveBeenCalled();
  });

  it('rejects production writes without a verified session', async () => {
    await expect(
      authorizeCmsBffRequest({
        method: 'POST',
        origin: 'http://localhost:3002',
        config: config({
          verifySession: async () => null,
        }),
      })
    ).resolves.toMatchObject({ ok: false, status: 401 });
  });

  it('rejects a verified session that is not on the allowlist', async () => {
    await expect(
      authorizeCmsBffRequest({
        method: 'GET',
        cookie: 'ory_kratos_session=abc',
        config: config({
          verifySession: async () => ({
            id: 'id_1',
            email: 'stranger@example.com',
          }),
        }),
      })
    ).resolves.toMatchObject({ ok: false, status: 401 });
  });

  it('attaches the server token after a verified allowlisted session', async () => {
    const result = await authorizeCmsBffRequest({
      method: 'POST',
      origin: 'http://localhost:3002',
      cookie: 'ory_kratos_session=abc',
      config: config({
        verifySession: async () => ({
          id: 'id_1',
          email: 'owner@example.com',
        }),
      }),
    });
    expect(result).toEqual({
      ok: true,
      authorization: `Bearer ${token}`,
    });
  });

  it('ignores EVENT_STACK_CMS_DEV_AUTH in production', async () => {
    await expect(
      authorizeCmsBffRequest({
        method: 'POST',
        origin: 'http://localhost:3002',
        config: config({
          eventStackCmsDevAuth: 'true',
          verifySession: async () => null,
        }),
      })
    ).resolves.toMatchObject({ ok: false, status: 401 });
  });

  it('allows the local-only dev path when not in production', async () => {
    await expect(
      authorizeCmsBffRequest({
        method: 'POST',
        config: config({
          nodeEnv: 'development',
          eventStackCmsDevAuth: 'true',
          verifySession: async () => {
            throw new Error('whoami must not run for local dev auth');
          },
        }),
      })
    ).resolves.toEqual({ ok: true, authorization: `Bearer ${token}` });
  });

  it('rejects production mutations from an unexpected Origin', async () => {
    await expect(
      authorizeCmsBffRequest({
        method: 'DELETE',
        origin: 'https://evil.example',
        cookie: 'ory_kratos_session=abc',
        config: config({
          verifySession: async () => ({
            id: 'id_1',
            email: 'owner@example.com',
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
    expect(src).not.toMatch(
      /['"]process\.env\.ADMIN_API_TOKEN['"]\s*:/
    );
    expect(src).toMatch(/['"]\/cms-api['"]/);
  });
});
