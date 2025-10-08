import { parseISO } from 'date-fns';
import { useMemo } from 'react';

import { type SessionBlockType } from '../types';

export interface UseSortSessionsResult {
  sortedSessions: SessionBlockType[];
  orderedDates: string[];
  groupedSessions: Record<string, SessionBlockType[]>;
}

export function useSortSessions(
  sessions: SessionBlockType[]
): UseSortSessionsResult {
  // Helper: 合併 date + time
  const getDateTime = (s: SessionBlockType) => {
    if (!s.date || !s.startTime) return null;
    // "YYYY-MM-DDTHH:mm:ss+0800" -> ISO 可解析
    return parseISO(`${s.date}T${s.startTime}`);
  };

  const sortedSessions = useMemo<SessionBlockType[]>(() => {
    return [...sessions].sort((a, b) => {
      const aTime = getDateTime(a)?.getTime() ?? 0;
      const bTime = getDateTime(b)?.getTime() ?? 0;
      return aTime - bTime;
    });
  }, [sessions]);

  const orderedDates = useMemo<string[]>(() => {
    const set = new Set<string>();
    sortedSessions.forEach((s: SessionBlockType) => {
      if (!s.date) return;
      set.add(s.date);
    });
    return Array.from(set).sort();
  }, [sortedSessions]);

  const groupedSessions = useMemo<Record<string, SessionBlockType[]>>(() => {
    const groups: Record<string, SessionBlockType[]> = {};
    sortedSessions.forEach((s: SessionBlockType) => {
      const key = s.date;
      if (!key) return;
      if (!groups[key]) groups[key] = [];
      groups[key].push(s);
    });
    return groups;
  }, [sortedSessions]);

  return { sortedSessions, orderedDates, groupedSessions };
}
