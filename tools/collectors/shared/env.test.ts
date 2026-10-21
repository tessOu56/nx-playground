import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { assertPostgresUrl, collectorDatabaseUrl } from './env';

describe('collectorDatabaseUrl', () => {
  it('prefers COLLECTOR_DATABASE_URL over DATABASE_URL', () => {
    assert.equal(
      collectorDatabaseUrl({
        COLLECTOR_DATABASE_URL: 'postgresql://collector/db',
        DATABASE_URL: 'postgresql://owner/db',
      }),
      'postgresql://collector/db'
    );
  });

  it('falls back to DATABASE_URL for local CLI', () => {
    assert.equal(
      collectorDatabaseUrl({ DATABASE_URL: 'postgresql://owner/db' }),
      'postgresql://owner/db'
    );
    assert.equal(collectorDatabaseUrl({}), '');
  });
});

describe('assertPostgresUrl', () => {
  it('rejects sqlite and empty schemes', () => {
    assert.throws(() => assertPostgresUrl('file:./dev.db'), /postgresql/);
    assert.equal(
      assertPostgresUrl('postgresql://event_collector@127.0.0.1/event_stack'),
      'postgresql://event_collector@127.0.0.1/event_stack'
    );
  });
});
