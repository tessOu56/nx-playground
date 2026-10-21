import { Reflector } from '@nestjs/core';

import { PermissionsGuard } from './permissions.guard';

describe('PermissionsGuard', () => {
  const reflector = { get: jest.fn() };
  const guard = new PermissionsGuard(reflector as unknown as Reflector);

  function context(user?: { id: string; role: string }) {
    return {
      getHandler: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    };
  }

  afterEach(() => {
    reflector.get.mockReset();
  });

  it('denies when the handler declares no permissions', () => {
    reflector.get.mockReturnValue(undefined);
    expect(
      guard.canActivate(context({ id: 'admin-1', role: 'admin' }) as never)
    ).toBe(false);
    reflector.get.mockReturnValue([]);
    expect(
      guard.canActivate(context({ id: 'admin-1', role: 'admin' }) as never)
    ).toBe(false);
  });

  it('denies an unauthenticated caller even when permissions are declared', () => {
    reflector.get.mockReturnValue(['users:read']);
    expect(guard.canActivate(context(undefined) as never)).toBe(false);
  });

  it('allows an admin with users:read and rejects a guest', () => {
    reflector.get.mockReturnValue(['users:read']);
    expect(
      guard.canActivate(context({ id: 'admin-1', role: 'admin' }) as never)
    ).toBe(true);
    expect(
      guard.canActivate(context({ id: 'guest-1', role: 'guest' }) as never)
    ).toBe(false);
  });
});
