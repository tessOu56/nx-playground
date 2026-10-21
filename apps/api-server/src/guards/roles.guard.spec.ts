import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RolesGuard } from './roles.guard';
import type { IdentityPrincipal } from '../common/auth/identity-roles';

describe('RolesGuard', () => {
  const reflector = { getAllAndOverride: jest.fn() };
  const guard = new RolesGuard(reflector as unknown as Reflector);

  function context(identity?: IdentityPrincipal) {
    return {
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ identity }),
      }),
    };
  }

  afterEach(() => {
    reflector.getAllAndOverride.mockReset();
  });

  it('denies when no roles metadata is declared', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    expect(() =>
      guard.canActivate(
        context({
          kind: 'user',
          id: 'admin-1',
          roles: ['admin'],
        }) as never
      )
    ).toThrow(ForbiddenException);
  });

  it('denies an authenticated attendee without organizer/admin', () => {
    reflector.getAllAndOverride.mockReturnValue(['organizer', 'admin']);
    expect(() =>
      guard.canActivate(
        context({ kind: 'user', id: 'attendee-1', roles: [] }) as never
      )
    ).toThrow(ForbiddenException);
  });

  it('rejects a missing identity', () => {
    reflector.getAllAndOverride.mockReturnValue(['organizer']);
    expect(() => guard.canActivate(context(undefined) as never)).toThrow(
      UnauthorizedException
    );
  });

  it('allows a machine admin principal on organizer|admin routes', () => {
    reflector.getAllAndOverride.mockReturnValue(['organizer', 'admin']);
    expect(
      guard.canActivate(
        context({
          kind: 'machine',
          id: 'admin-token',
          roles: ['admin'],
        }) as never
      )
    ).toBe(true);
  });

  it('allows an organizer on organizer|admin routes', () => {
    reflector.getAllAndOverride.mockReturnValue(['organizer', 'admin']);
    expect(
      guard.canActivate(
        context({
          kind: 'user',
          id: 'org-1',
          roles: ['organizer'],
        }) as never
      )
    ).toBe(true);
  });
});
