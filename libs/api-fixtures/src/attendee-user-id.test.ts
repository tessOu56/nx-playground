import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  DEMO_ATTENDEE_USER_ID,
  attendeeUserIdFromLine,
  isLineAttendeeUserId,
} from './attendee-user-id';

describe('attendeeUserIdFromLine', () => {
  it('falls back to user_demo when LIFF is absent', () => {
    assert.equal(attendeeUserIdFromLine(undefined), DEMO_ATTENDEE_USER_ID);
    assert.equal(attendeeUserIdFromLine(''), DEMO_ATTENDEE_USER_ID);
  });

  it('prefixes LINE user ids so user_demo is not the only path', () => {
    assert.equal(attendeeUserIdFromLine('Uabc123'), 'line_Uabc123');
    assert.equal(attendeeUserIdFromLine('line_Uabc123'), 'line_Uabc123');
    assert.equal(isLineAttendeeUserId('line_Uabc123'), true);
    assert.equal(isLineAttendeeUserId('user_demo'), false);
  });
});
