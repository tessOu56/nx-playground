import { MACHINE_PRINCIPAL, resolveRequestIdentity } from './request-identity';

describe('resolveRequestIdentity', () => {
  const token = 'admin-api-token-value';

  it('accepts ADMIN_API_TOKEN as a machine principal', async () => {
    await expect(
      resolveRequestIdentity({
        authorizationHeader: `Bearer ${token}`,
        adminApiToken: token,
      })
    ).resolves.toEqual(MACHINE_PRINCIPAL);
  });

  it('rejects a non-matching bearer when JWT verification fails', async () => {
    await expect(
      resolveRequestIdentity({
        authorizationHeader: 'Bearer not-a-jwt',
        adminApiToken: token,
        verifyJwt: async () => null,
      })
    ).resolves.toBeUndefined();
  });

  it('returns JWT claims as a user principal', async () => {
    await expect(
      resolveRequestIdentity({
        authorizationHeader: 'Bearer jwt-token',
        adminApiToken: token,
        verifyJwt: async () => ({ sub: 'user_1', roles: ['organizer'] }),
      })
    ).resolves.toEqual({
      kind: 'user',
      id: 'user_1',
      roles: ['organizer'],
    });
  });
});
