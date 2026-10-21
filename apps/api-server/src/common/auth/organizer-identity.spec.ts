import { resolveOrganizerIdentity } from './organizer-identity';

describe('resolveOrganizerIdentity', () => {
  const token = 'admin-api-token-value';
  const allowlist = 'owner@example.com,ops@example.com';

  it('accepts a matching ADMIN_API_TOKEN bearer and rejects a wrong one', async () => {
    await expect(
      resolveOrganizerIdentity({
        authorizationHeader: `Bearer ${token}`,
        adminApiToken: token,
        nodeEnv: 'production',
      })
    ).resolves.toEqual({ id: 'admin-token', role: 'admin' });

    await expect(
      resolveOrganizerIdentity({
        authorizationHeader: 'Bearer other-token-value',
        adminApiToken: token,
        nodeEnv: 'production',
      })
    ).resolves.toBeUndefined();
  });

  it('rejects every bearer when ADMIN_API_TOKEN is unset', async () => {
    await expect(
      resolveOrganizerIdentity({
        authorizationHeader: `Bearer ${token}`,
        adminApiToken: '',
        nodeEnv: 'production',
      })
    ).resolves.toBeUndefined();
  });

  it('rejects an allowlisted X-Organizer-Email in production without a session', async () => {
    await expect(
      resolveOrganizerIdentity({
        organizerEmailHeader: 'Owner@Example.com',
        allowedOrganizerEmails: allowlist,
        nodeEnv: 'production',
        kratosPublicUrl: 'http://localhost:4433',
        verifySession: async () => {
          throw new Error('whoami must not run for header-only auth');
        },
      })
    ).resolves.toBeUndefined();
  });

  it('ignores EVENT_STACK_CMS_DEV_AUTH and email headers in production', async () => {
    await expect(
      resolveOrganizerIdentity({
        organizerEmailHeader: 'anyone@example.com',
        eventStackCmsDevAuth: 'true',
        allowedOrganizerEmails: 'anyone@example.com',
        nodeEnv: 'production',
      })
    ).resolves.toBeUndefined();
  });

  it('grants admin from a verified Kratos session on the allowlist', async () => {
    const verifySession = jest.fn().mockResolvedValue({
      id: 'id_1',
      email: 'owner@example.com',
    });

    await expect(
      resolveOrganizerIdentity({
        cookieHeader: 'ory_kratos_session=abc',
        allowedOrganizerEmails: allowlist,
        nodeEnv: 'production',
        kratosPublicUrl: 'http://localhost:4433',
        verifySession,
      })
    ).resolves.toEqual({ id: 'id_1', role: 'admin' });

    expect(verifySession).toHaveBeenCalledWith({
      kratosPublicUrl: 'http://localhost:4433',
      cookie: 'ory_kratos_session=abc',
      sessionToken: undefined,
    });
  });

  it('treats a non-admin bearer as a Kratos session token', async () => {
    const verifySession = jest.fn().mockResolvedValue({
      id: 'id_2',
      email: 'ops@example.com',
    });

    await expect(
      resolveOrganizerIdentity({
        authorizationHeader: 'Bearer kratos-session-token',
        adminApiToken: token,
        allowedOrganizerEmails: allowlist,
        nodeEnv: 'production',
        kratosPublicUrl: 'http://localhost:4433',
        verifySession,
      })
    ).resolves.toEqual({ id: 'id_2', role: 'admin' });

    expect(verifySession).toHaveBeenCalledWith({
      kratosPublicUrl: 'http://localhost:4433',
      cookie: undefined,
      sessionToken: 'kratos-session-token',
    });
  });

  it('fails closed when the session email is not allowlisted or the allowlist is empty', async () => {
    await expect(
      resolveOrganizerIdentity({
        sessionTokenHeader: 'sess',
        allowedOrganizerEmails: allowlist,
        nodeEnv: 'production',
        verifySession: async () => ({ id: 'id_3', email: 'stranger@example.com' }),
      })
    ).resolves.toBeUndefined();

    await expect(
      resolveOrganizerIdentity({
        sessionTokenHeader: 'sess',
        allowedOrganizerEmails: '',
        nodeEnv: 'production',
        verifySession: async () => ({ id: 'id_3', email: 'owner@example.com' }),
      })
    ).resolves.toBeUndefined();
  });

  it('fails closed when Kratos whoami fails', async () => {
    await expect(
      resolveOrganizerIdentity({
        cookieHeader: 'ory_kratos_session=abc',
        allowedOrganizerEmails: allowlist,
        nodeEnv: 'production',
        verifySession: async () => null,
      })
    ).resolves.toBeUndefined();
  });

  it('allows a clearly local email-header path only when dev auth is enabled', async () => {
    await expect(
      resolveOrganizerIdentity({
        organizerEmailHeader: 'dev@example.com',
        eventStackCmsDevAuth: 'true',
        nodeEnv: 'development',
      })
    ).resolves.toEqual({ id: 'dev@example.com', role: 'admin' });

    await expect(
      resolveOrganizerIdentity({
        organizerEmailHeader: 'dev@example.com',
        nodeEnv: 'development',
      })
    ).resolves.toBeUndefined();
  });
});
