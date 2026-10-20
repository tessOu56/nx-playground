import { DIGEST_CITIES } from './types';
import type { DigestCitySection, DigestExhibition, WeeklyDigest } from './types';
import {
  digestWindow,
  isNewlyAddedInWindow,
  isUpcomingInWindow,
  type DigestWindow,
} from './window';

export const MAX_ITEMS_PER_SECTION = 4;

function byTitle(a: DigestExhibition, b: DigestExhibition): number {
  return a.title.localeCompare(b.title, 'en');
}

function upcomingSort(a: DigestExhibition, b: DigestExhibition): number {
  return a.startDate.getTime() - b.startDate.getTime() || byTitle(a, b);
}

function newlyAddedSort(a: DigestExhibition, b: DigestExhibition): number {
  return b.createdAt.getTime() - a.createdAt.getTime() || byTitle(a, b);
}

function uniqueById(items: DigestExhibition[]): DigestExhibition[] {
  const seen = new Set<string>();
  const unique: DigestExhibition[] = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    unique.push(item);
  }
  return unique;
}

export function classifyWeeklyDigest(
  exhibitions: readonly DigestExhibition[],
  now: Date,
  limit = MAX_ITEMS_PER_SECTION
): WeeklyDigest {
  const window: DigestWindow = digestWindow(now);
  const cities: DigestCitySection[] = DIGEST_CITIES.map(city => {
    const inCity = exhibitions.filter(item => item.city === city);
    return {
      city,
      upcoming: uniqueById(inCity.filter(item => isUpcomingInWindow(item.startDate, window)))
        .sort(upcomingSort)
        .slice(0, limit),
      newlyAdded: uniqueById(
        inCity.filter(item => isNewlyAddedInWindow(item.createdAt, window))
      )
        .sort(newlyAddedSort)
        .slice(0, limit),
    };
  });

  return {
    now: window.now,
    weekStart: window.weekStart,
    weekEnd: window.weekEnd,
    lookbackStart: window.lookbackStart,
    cities,
  };
}
