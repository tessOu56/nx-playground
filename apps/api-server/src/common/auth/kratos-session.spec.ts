import { verifyKratosSession } from './kratos-session';

describe('verifyKratosSession', () => {
  it('fails closed when the public URL or credentials are missing', async () => {
    const fetchImpl = jest.fn();
    expect(
      await verifyKratosSession({
        kratosPublicUrl: '',
        cookie: 'ory_kratos_session=abc',
        fetchImpl: fetchImpl as never,
      })
    ).toBeNull();
    expect(
      await verifyKratosSession({
        kratosPublicUrl: 'http://localhost:4433',
        fetchImpl: fetchImpl as never,
      })
    ).toBeNull();
    expect(
      await verifyKratosSession({
        kratosPublicUrl: 'ftp://localhost:4433',
        cookie: 'ory_kratos_session=abc',
        fetchImpl: fetchImpl as never,
      })
    ).toBeNull();
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('returns the session identity from a successful whoami', async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        identity: {
          id: 'id_1',
          traits: { email: 'Owner@Example.com' },
        },
      }),
    });

    await expect(
      verifyKratosSession({
        kratosPublicUrl: 'http://localhost:4433/',
        cookie: 'ory_kratos_session=abc',
        fetchImpl: fetchImpl as never,
      })
    ).resolves.toEqual({ id: 'id_1', email: 'owner@example.com' });

    expect(fetchImpl).toHaveBeenCalledWith(
      'http://localhost:4433/sessions/whoami',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          cookie: 'ory_kratos_session=abc',
        }),
      })
    );
  });

  it('fails closed on HTTP, JSON, and network errors', async () => {
    await expect(
      verifyKratosSession({
        kratosPublicUrl: 'http://localhost:4433',
        sessionToken: 'sess',
        fetchImpl: jest.fn().mockResolvedValue({ ok: false }) as never,
      })
    ).resolves.toBeNull();

    await expect(
      verifyKratosSession({
        kratosPublicUrl: 'http://localhost:4433',
        sessionToken: 'sess',
        fetchImpl: jest.fn().mockResolvedValue({
          ok: true,
          json: async () => ({ identity: { id: 'id_1' } }),
        }) as never,
      })
    ).resolves.toBeNull();

    await expect(
      verifyKratosSession({
        kratosPublicUrl: 'http://localhost:4433',
        sessionToken: 'sess',
        fetchImpl: jest.fn().mockRejectedValue(new Error('offline')) as never,
      })
    ).resolves.toBeNull();
  });
});
