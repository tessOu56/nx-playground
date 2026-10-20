import {
  isAdminBearerAuthorized,
  parseBearerToken,
  timingSafeEqualUtf8,
} from './timing-safe-equal';

describe('admin bearer', () => {
  const token = 'test-admin-token-value';

  it('parses a Bearer token and rejects other schemes', () => {
    expect(parseBearerToken('Bearer abc')).toBe('abc');
    expect(parseBearerToken('bearer abc')).toBe('abc');
    expect(parseBearerToken('Basic abc')).toBeUndefined();
    expect(parseBearerToken('Bearer')).toBeUndefined();
    expect(parseBearerToken(undefined)).toBeUndefined();
  });

  it('compares utf8 bytes in constant time', () => {
    expect(timingSafeEqualUtf8(token, token)).toBe(true);
    expect(timingSafeEqualUtf8(token, 'other-admin-token-xx')).toBe(false);
    expect(timingSafeEqualUtf8('ab', 'abc')).toBe(false);
  });

  it('rejects every request when ADMIN_API_TOKEN is unset', () => {
    expect(isAdminBearerAuthorized(`Bearer ${token}`, undefined)).toBe(false);
    expect(isAdminBearerAuthorized(`Bearer ${token}`, '')).toBe(false);
    expect(isAdminBearerAuthorized(`Bearer ${token}`, '   ')).toBe(false);
  });

  it('accepts only the matching bearer', () => {
    expect(isAdminBearerAuthorized(`Bearer ${token}`, token)).toBe(true);
    expect(isAdminBearerAuthorized(`Bearer ${token}`, ` ${token} `)).toBe(true);
    expect(isAdminBearerAuthorized(`Bearer wrong-token-value`, token)).toBe(
      false
    );
    expect(isAdminBearerAuthorized(undefined, token)).toBe(false);
    expect(isAdminBearerAuthorized(token, token)).toBe(false);
  });
});
