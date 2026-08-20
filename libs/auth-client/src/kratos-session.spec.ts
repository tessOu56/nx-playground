import { mapKratosWhoami } from './kratos-session';

describe('mapKratosWhoami', () => {
  it('maps identity id and email', () => {
    expect(
      mapKratosWhoami({
        identity: { id: 'id_1', traits: { email: 'organizer@nx-playground.local' } },
      }),
    ).toEqual({
      id: 'id_1',
      email: 'organizer@nx-playground.local',
      name: 'organizer@nx-playground.local',
    });
  });

  it('returns null when session has no identity', () => {
    expect(mapKratosWhoami({})).toBeNull();
  });
});
