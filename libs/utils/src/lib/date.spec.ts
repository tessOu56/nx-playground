import { describe, it, expect } from 'vitest';

import {
  formatDate,
  formatRelativeTime,
  isToday,
  isPast,
  isFuture,
  addDays,
  getDateRange,
} from './date';

describe('Date Utilities', () => {
  describe('formatDate', () => {
    it('should format date to YYYY-MM-DD', () => {
      const date = new Date('2025-01-27T12:00:00');
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2025-01-27');
    });

    it('should format date to YYYY-MM-DD HH:mm:ss', () => {
      const date = new Date('2025-01-27T15:30:45');
      expect(formatDate(date, 'YYYY-MM-DD HH:mm:ss')).toBe('2025-01-27 15:30:45');
    });

    it('should handle string date input', () => {
      expect(formatDate('2025-01-27', 'YYYY-MM-DD')).toBe('2025-01-27');
    });

    it('should return Invalid Date for invalid input', () => {
      expect(formatDate('invalid', 'YYYY-MM-DD')).toBe('Invalid Date');
    });
  });

  describe('formatRelativeTime', () => {
    it('should return "just now" for recent dates', () => {
      const now = new Date();
      expect(formatRelativeTime(now, 'en')).toBe('just now');
    });

    it('should return "剛剛" for recent dates in zh-TW', () => {
      const now = new Date();
      expect(formatRelativeTime(now, 'zh-TW')).toBe('剛剛');
    });

    it('should return days ago', () => {
      const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      expect(formatRelativeTime(date, 'en')).toBe('3 days ago');
    });
  });

  describe('isToday', () => {
    it('should return true for today', () => {
      expect(isToday(new Date())).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      expect(isToday(yesterday)).toBe(false);
    });
  });

  describe('isPast', () => {
    it('should return true for past dates', () => {
      const past = new Date('2020-01-01');
      expect(isPast(past)).toBe(true);
    });

    it('should return false for future dates', () => {
      const future = new Date('2030-01-01');
      expect(isPast(future)).toBe(false);
    });
  });

  describe('isFuture', () => {
    it('should return true for future dates', () => {
      const future = new Date('2030-01-01');
      expect(isFuture(future)).toBe(true);
    });

    it('should return false for past dates', () => {
      const past = new Date('2020-01-01');
      expect(isFuture(past)).toBe(false);
    });
  });

  describe('addDays', () => {
    it('should add days to date', () => {
      const date = new Date('2025-01-27');
      const result = addDays(date, 3);
      expect(formatDate(result, 'YYYY-MM-DD')).toBe('2025-01-30');
    });

    it('should subtract days with negative number', () => {
      const date = new Date('2025-01-27');
      const result = addDays(date, -3);
      expect(formatDate(result, 'YYYY-MM-DD')).toBe('2025-01-24');
    });
  });

  describe('getDateRange', () => {
    it('should return start and end of day', () => {
      const date = new Date('2025-01-27T15:30:00');
      const { start, end } = getDateRange(date);

      expect(start.getHours()).toBe(0);
      expect(start.getMinutes()).toBe(0);
      expect(end.getHours()).toBe(23);
      expect(end.getMinutes()).toBe(59);
    });
  });
});

