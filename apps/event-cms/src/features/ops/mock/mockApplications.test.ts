import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { MockDataApplications } from './mockApplications';

describe('MockDataApplications (T-2026-283)', () => {
  it('returns labelled mock rows without a blob or quota pipeline', () => {
    MockDataApplications.reset();
    const rows = MockDataApplications.list();
    assert.equal(rows.length, 3);
    assert.ok(rows.every(row => row.labelledMock === true));
    assert.ok(rows.some(row => row.status === 'pending'));
    assert.ok(rows.some(row => row.status === 'approved'));
    assert.ok(rows.some(row => row.status === 'rejected'));
  });

  it('copies rows so callers cannot mutate the store by reference', () => {
    MockDataApplications.reset();
    const first = MockDataApplications.list();
    first[0].purpose = 'mutated';
    const second = MockDataApplications.list();
    assert.notEqual(second[0].purpose, 'mutated');
  });
});
