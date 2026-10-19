export type ExhibitionRegion = 'TAIPEI' | 'TOKYO';
export type TimeWindowKind = 'today' | 'this_week' | 'weekend' | 'this_month';

export const REGION_TIMEZONE: Record<ExhibitionRegion, string> = {
  TAIPEI: 'Asia/Taipei',
  TOKYO: 'Asia/Tokyo',
};

export type UtcRange = { start: Date; end: Date };

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

type TzParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  weekday: number;
};

function tzParts(date: Date, timeZone: string): TzParts {
  const map: Record<string, string> = {};
  for (const part of new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)) {
    if (part.type !== 'literal') map[part.type] = part.value;
  }
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
    second: Number(map.second),
    weekday: WEEKDAY_INDEX[map.weekday] ?? 0,
  };
}

/** Interpret a civil datetime in `timeZone` as a UTC Date. */
export function zonedTimeToUtc(
  timeZone: string,
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
  ms = 0
): Date {
  const probe = new Date(Date.UTC(year, month - 1, day, hour, minute, second, ms));
  const parts = tzParts(probe, timeZone);
  const asShown = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
    ms
  );
  return new Date(probe.getTime() - (asShown - probe.getTime()));
}

function addDays(year: number, month: number, day: number, delta: number) {
  const utc = new Date(Date.UTC(year, month - 1, day + delta));
  return {
    year: utc.getUTCFullYear(),
    month: utc.getUTCMonth() + 1,
    day: utc.getUTCDate(),
  };
}

function endOfDay(timeZone: string, year: number, month: number, day: number): Date {
  return zonedTimeToUtc(timeZone, year, month, day, 23, 59, 59, 999);
}

function startOfDay(timeZone: string, year: number, month: number, day: number): Date {
  return zonedTimeToUtc(timeZone, year, month, day, 0, 0, 0, 0);
}

function lastDayOfMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function resolveTimeWindow(
  kind: TimeWindowKind,
  region: ExhibitionRegion,
  now: Date
): UtcRange {
  const timeZone = REGION_TIMEZONE[region];
  const parts = tzParts(now, timeZone);
  const mondayDelta = (parts.weekday + 6) % 7;
  const monday = addDays(parts.year, parts.month, parts.day, -mondayDelta);

  switch (kind) {
    case 'today':
      return {
        start: startOfDay(timeZone, parts.year, parts.month, parts.day),
        end: endOfDay(timeZone, parts.year, parts.month, parts.day),
      };
    case 'this_week': {
      const sunday = addDays(monday.year, monday.month, monday.day, 6);
      return {
        start: startOfDay(timeZone, monday.year, monday.month, monday.day),
        end: endOfDay(timeZone, sunday.year, sunday.month, sunday.day),
      };
    }
    case 'weekend': {
      const friday = addDays(monday.year, monday.month, monday.day, 4);
      const sunday = addDays(monday.year, monday.month, monday.day, 6);
      return {
        start: startOfDay(timeZone, friday.year, friday.month, friday.day),
        end: endOfDay(timeZone, sunday.year, sunday.month, sunday.day),
      };
    }
    case 'this_month':
      return {
        start: startOfDay(timeZone, parts.year, parts.month, 1),
        end: endOfDay(
          timeZone,
          parts.year,
          parts.month,
          lastDayOfMonth(parts.year, parts.month)
        ),
      };
  }
}

/** Ongoing + upcoming horizon when the user did not name a window. */
export function defaultCatalogWindow(now: Date): UtcRange {
  const horizon = new Date(now.getTime());
  horizon.setUTCMonth(horizon.getUTCMonth() + 18);
  return { start: now, end: horizon };
}
