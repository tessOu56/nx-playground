import { resolveOrganizerIdentity } from './organizer-auth.middleware';

describe('resolveOrganizerIdentity', () => {
  const token = 'cms-organizer-token-value';

  it('accepts a matching CMS bearer and rejects a wrong one', () => {
    expect(
      resolveOrganizerIdentity({
        authorizationHeader: `Bearer ${token}`,
        cmsOrganizerApiToken: token,
        nodeEnv: 'production',
      })
    ).toEqual({ id: 'cms-token', role: 'admin' });

    expect(
      resolveOrganizerIdentity({
        authorizationHeader: 'Bearer other-token-value',
        cmsOrganizerApiToken: token,
        nodeEnv: 'production',
      })
    ).toBeUndefined();
  });

  it('rejects every bearer when CMS_ORGANIZER_API_TOKEN is unset', () => {
    expect(
      resolveOrganizerIdentity({
        authorizationHeader: `Bearer ${token}`,
        cmsOrganizerApiToken: '',
        nodeEnv: 'production',
      })
    ).toBeUndefined();
  });

  it('ignores EVENT_STACK_CMS_DEV_AUTH in production', () => {
    expect(
      resolveOrganizerIdentity({
        organizerEmailHeader: 'anyone@example.com',
        eventStackCmsDevAuth: 'true',
        nodeEnv: 'production',
      })
    ).toBeUndefined();
  });

  it('grants admin from an allowlisted email in production', () => {
    expect(
      resolveOrganizerIdentity({
        organizerEmailHeader: 'Owner@Example.com',
        allowedOrganizerEmails: 'owner@example.com,ops@example.com',
        nodeEnv: 'production',
      })
    ).toEqual({ id: 'owner@example.com', role: 'admin' });
  });

  it('grants admin from any email outside production', () => {
    expect(
      resolveOrganizerIdentity({
        organizerEmailHeader: 'dev@example.com',
        nodeEnv: 'development',
      })
    ).toEqual({ id: 'dev@example.com', role: 'admin' });
  });
});
