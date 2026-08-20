import { assertPostgresUrl } from './postgres-url';

describe('assertPostgresUrl', () => {
  it('accepts postgresql URLs', () => {
    expect(
      assertPostgresUrl('postgresql://event:event@127.0.0.1:5433/event_stack'),
    ).toMatch(/^postgresql:/);
  });

  it('accepts postgres:// URLs', () => {
    expect(assertPostgresUrl('postgres://u:p@localhost:5432/db')).toMatch(
      /^postgres:/,
    );
  });

  it('rejects sqlite file URLs', () => {
    expect(() =>
      assertPostgresUrl('file:./apps/api-server/prisma/dev.db'),
    ).toThrow(/postgresql/);
  });

  it('rejects missing URL', () => {
    expect(() => assertPostgresUrl(undefined)).toThrow(/required/);
  });
});
