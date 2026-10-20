import { UnauthorizedException } from '@nestjs/common';

import { AdminBearerGuard } from './admin-bearer.guard';

describe('AdminBearerGuard', () => {
  const guard = new AdminBearerGuard();

  function contextWithAuthorization(authorization?: string) {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: authorization ? { authorization } : {},
        }),
      }),
    };
  }

  const original = process.env.ADMIN_API_TOKEN;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.ADMIN_API_TOKEN;
    } else {
      process.env.ADMIN_API_TOKEN = original;
    }
  });

  it('throws 401 when the env token is missing', () => {
    delete process.env.ADMIN_API_TOKEN;
    expect(() =>
      guard.canActivate(contextWithAuthorization('Bearer any-token') as never)
    ).toThrow(UnauthorizedException);
  });

  it('allows a matching bearer and rejects a wrong one', () => {
    process.env.ADMIN_API_TOKEN = 'guard-secret';
    expect(
      guard.canActivate(
        contextWithAuthorization('Bearer guard-secret') as never
      )
    ).toBe(true);
    expect(() =>
      guard.canActivate(
        contextWithAuthorization('Bearer other-secret') as never
      )
    ).toThrow(UnauthorizedException);
  });
});
