export const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export type DigestWindow = {
  now: Date;
  weekStart: Date;
  weekEnd: Date;
  lookbackStart: Date;
};

/** Rolling 7-day window: upcoming openings in [now, now+7d), new rows in [now-7d, now]. */
export function digestWindow(now: Date): DigestWindow {
  const weekStart = new Date(now.getTime());
  return {
    now: weekStart,
    weekStart,
    weekEnd: new Date(weekStart.getTime() + WEEK_MS),
    lookbackStart: new Date(weekStart.getTime() - WEEK_MS),
  };
}

export function isUpcomingInWindow(
  startDate: Date,
  window: DigestWindow
): boolean {
  const start = startDate.getTime();
  return start >= window.weekStart.getTime() && start < window.weekEnd.getTime();
}

export function isNewlyAddedInWindow(
  createdAt: Date,
  window: DigestWindow
): boolean {
  const created = createdAt.getTime();
  return (
    created >= window.lookbackStart.getTime() &&
    created <= window.weekStart.getTime()
  );
}
