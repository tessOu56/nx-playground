import { hasOrganizerAccess, mapBetterAuthSession } from './session';

describe('mapBetterAuthSession', () => {
  it('maps id, optional email, and elevated roles', () => {
    expect(
      mapBetterAuthSession({
        user: {
          id: 'user_1',
          email: 'owner@example.com',
          name: 'Owner',
          roles: ['organizer'],
          lineId: 'U123',
        },
      })
    ).toEqual({
      id: 'user_1',
      email: 'owner@example.com',
      name: 'Owner',
      roles: ['organizer'],
      lineId: 'U123',
    });
  });

  it('returns null without a user id', () => {
    expect(mapBetterAuthSession({})).toBeNull();
  });

  it('does not treat an attendee as organizer', () => {
    const user = mapBetterAuthSession({
      user: { id: 'attendee', roles: [] },
    });
    expect(hasOrganizerAccess(user)).toBe(false);
  });
});
