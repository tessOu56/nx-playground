const YEAR_RE = /(?:(\d{4})\s*年\s*)?(\d{1,2})\s*月\s*(\d{1,2})\s*日/;
const RANGE_RE =
  /((?:\d{4}\s*年\s*)?\d{1,2}\s*月\s*\d{1,2}\s*日)[^日]{0,16}(?:～|〜|~|－|—|-|から)\s*((?:\d{4}\s*年\s*)?\d{1,2}\s*月\s*\d{1,2}\s*日)/;

export function parseTokyoDateTime(
  raw: unknown,
  endOfDay = false
): Date | null {
  const text = typeof raw === 'string' ? raw.trim().replace(/-/g, '/') : '';
  const match = text.match(
    /^(\d{4})\/(\d{1,2})\/(\d{1,2})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/
  );
  if (!match) return null;
  return tokyoCivilDate(
    Number(match[1]),
    Number(match[2]),
    Number(match[3]),
    match[4] != null ? Number(match[4]) : endOfDay ? 23 : 0,
    match[4] != null ? Number(match[5]) : endOfDay ? 59 : 0,
    match[4] != null ? Number(match[6] ?? '0') : endOfDay ? 59 : 0,
    !match[4] && endOfDay ? 999 : 0
  );
}

export function tokyoCivilDate(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
  ms = 0
): Date | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (
    probe.getUTCFullYear() !== year ||
    probe.getUTCMonth() + 1 !== month ||
    probe.getUTCDate() !== day
  ) {
    return null;
  }
  return new Date(Date.UTC(year, month - 1, day, hour - 9, minute, second, ms));
}

function expandYear(year: number): number {
  if (year >= 100) return year;
  return year >= 80 ? 1900 + year : 2000 + year;
}

/**
 * Museum slugs encode the run as YYMMDD-MMDD, YYMMDD-YYMMDD,
 * YYYYMMDD-MMDD, or YYYYMMDD-YYYYMMDD.
 */
export function parseSlugDateRange(
  slug: string
): { start: Date; end: Date } | null {
  const head = slug.split('_')[0] ?? '';
  const full = /^(20\d{2})(\d{2})(\d{2})-(20\d{2})(\d{2})(\d{2})$/.exec(head);
  if (full) {
    return civilRange(
      Number(full[1]),
      Number(full[2]),
      Number(full[3]),
      Number(full[4]),
      Number(full[5]),
      Number(full[6])
    );
  }
  const ymdYmd = /^(20\d{2})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})$/.exec(head);
  if (ymdYmd) {
    return civilRange(
      Number(ymdYmd[1]),
      Number(ymdYmd[2]),
      Number(ymdYmd[3]),
      expandYear(Number(ymdYmd[4])),
      Number(ymdYmd[5]),
      Number(ymdYmd[6])
    );
  }
  const ymdMd = /^(20\d{2})(\d{2})(\d{2})-(\d{2})(\d{2})$/.exec(head);
  if (ymdMd) {
    const startYear = Number(ymdMd[1]);
    const startMonth = Number(ymdMd[2]);
    const endMonth = Number(ymdMd[4]);
    const endYear = endMonth < startMonth ? startYear + 1 : startYear;
    return civilRange(
      startYear,
      startMonth,
      Number(ymdMd[3]),
      endYear,
      endMonth,
      Number(ymdMd[5])
    );
  }
  const yyYymd = /^(\d{2})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})$/.exec(head);
  if (yyYymd) {
    return civilRange(
      expandYear(Number(yyYymd[1])),
      Number(yyYymd[2]),
      Number(yyYymd[3]),
      expandYear(Number(yyYymd[4])),
      Number(yyYymd[5]),
      Number(yyYymd[6])
    );
  }
  const yyMd = /^(\d{2})(\d{2})(\d{2})-(\d{2})(\d{2})$/.exec(head);
  if (yyMd) {
    const startYear = expandYear(Number(yyMd[1]));
    const startMonth = Number(yyMd[2]);
    const endMonth = Number(yyMd[4]);
    const endYear = endMonth < startMonth ? startYear + 1 : startYear;
    return civilRange(
      startYear,
      startMonth,
      Number(yyMd[3]),
      endYear,
      endMonth,
      Number(yyMd[5])
    );
  }
  return null;
}

function civilRange(
  y1: number,
  m1: number,
  d1: number,
  y2: number,
  m2: number,
  d2: number
): { start: Date; end: Date } | null {
  const start = tokyoCivilDate(y1, m1, d1, 0, 0, 0, 0);
  const end = tokyoCivilDate(y2, m2, d2, 23, 59, 59, 999);
  if (!start || !end || end.getTime() < start.getTime()) return null;
  return { start, end };
}

function parseJaDate(
  raw: string,
  fallbackYear: number
): { year: number; month: number; day: number } | null {
  const match = raw.match(YEAR_RE);
  if (!match) return null;
  const year = match[1] ? Number(match[1]) : fallbackYear;
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!year || month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { year, month, day };
}

export function parseJapaneseDateRange(
  text: string,
  fallbackYear = new Date().getUTCFullYear()
): { start: Date; end: Date } | null {
  const range = text.match(RANGE_RE);
  if (range) {
    const startParts = parseJaDate(range[1], fallbackYear);
    if (!startParts) return null;
    const endParts = parseJaDate(range[2], startParts.year);
    if (!endParts) return null;
    let endYear = endParts.year;
    if (!range[2].includes('年') && endParts.month < startParts.month) {
      endYear = startParts.year + 1;
    }
    return civilRange(
      startParts.year,
      startParts.month,
      startParts.day,
      endYear,
      endParts.month,
      endParts.day
    );
  }
  const single = parseJaDate(text, fallbackYear);
  if (!single) return null;
  return civilRange(
    single.year,
    single.month,
    single.day,
    single.year,
    single.month,
    single.day
  );
}

export function extractVenue(text: string): string | undefined {
  const match = text.match(/開催場所\s+([^\n]+)/);
  const venue = match?.[1]?.trim();
  return venue || undefined;
}

export const EXHIBITION_HINT =
  /展覧会|企画展|特別展|作品展示|美術展|展示|\bexhibition\b/i;
