import { describe, expect, it } from 'vitest';

import { getPortalAuthUrl, portalLoginUrl } from './handleDomain';

describe('portal login redirect', () => {
  it('points at event-portal Better Auth, not Kratos', () => {
    expect(getPortalAuthUrl()).toBe('http://localhost:3000');
    expect(portalLoginUrl('http://localhost:3002/events')).toBe(
      'http://localhost:3000/zh-TW/login?return_to=http%3A%2F%2Flocalhost%3A3002%2Fevents'
    );
  });
});
