'use client';

import { useLiff } from './LiffProvider';
import {
  attendeeUserIdFromLine,
  isLineAttendeeUserId,
} from './attendee-user-id';

export function useAttendeeUserId() {
  const { lineId, profile, userInfo, isInitialized } = useLiff();
  const raw =
    lineId ??
    (typeof profile?.userId === 'string' ? profile.userId : null) ??
    userInfo?.profile?.userId ??
    null;
  const userId = attendeeUserIdFromLine(raw);
  return {
    userId,
    isLiffIdentity: isLineAttendeeUserId(userId),
    isReady: isInitialized,
  };
}
