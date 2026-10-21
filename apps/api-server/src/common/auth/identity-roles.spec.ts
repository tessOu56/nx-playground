import {
  canReadUnpublished,
  hasAnyIdentityRole,
  parseIdentityRoles,
  permissionRoleFor,
} from './identity-roles';

describe('identity roles', () => {
  it('stores only elevated roles in JWT claims; attendee is implicit', () => {
    expect(parseIdentityRoles(['user', 'organizer', 'admin', 'nope'])).toEqual([
      'organizer',
      'admin',
    ]);
    expect(parseIdentityRoles('admin')).toEqual([]);
  });

  it('default-denies unpublished catalog reads for attendees', () => {
    expect(
      canReadUnpublished({ kind: 'user', id: 'a', roles: [] })
    ).toBe(false);
    expect(
      hasAnyIdentityRole({ kind: 'user', id: 'a', roles: [] }, [
        'organizer',
        'admin',
      ])
    ).toBe(false);
  });

  it('maps machine and admin principals to the admin permission role', () => {
    expect(
      permissionRoleFor({ kind: 'machine', id: 'admin-token', roles: ['admin'] })
    ).toBe('admin');
    expect(
      permissionRoleFor({
        kind: 'user',
        id: 'org',
        roles: ['organizer'],
      })
    ).toBe('editor');
  });
});
