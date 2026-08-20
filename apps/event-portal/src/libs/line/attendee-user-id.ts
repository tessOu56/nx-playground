export const DEMO_ATTENDEE_USER_ID = 'user_demo';

/** LIFF / LINE Login subject → event-stack userId. No LINE session → labelled demo. */
export function attendeeUserIdFromLine(lineId?: string | null): string {
  const id = lineId?.trim();
  if (!id) return DEMO_ATTENDEE_USER_ID;
  if (id === DEMO_ATTENDEE_USER_ID) return DEMO_ATTENDEE_USER_ID;
  return id.startsWith('line_') ? id : `line_${id}`;
}

export function isLineAttendeeUserId(userId: string): boolean {
  return userId.startsWith('line_') && userId.length > 'line_'.length;
}

export function stubLineAttendeeUser(userId: string) {
  return {
    id: userId,
    email: `${userId}@attendee.nx-playground.local`,
    name: 'LINE attendee',
    role: 'user',
    status: 'active',
  };
}
