export const DEMO_ATTENDEE_USER_ID = 'user_demo';

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
