import { describe, it, expect } from 'vitest';

import {
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatBytes,
  round,
  clamp,
  randomInt,
  percentage,
  sum,
  average,
  inRange,
} from './number';

describe('Number Utilities', () => {
  describe('formatNumber', () => {
    it('should format with thousand separators', () => {
      expect(formatNumber(1234567)).toMatch(/1[,.]234[,.]567/);
    });
  });

  describe('formatCurrency', () => {
    it('should format as USD', () => {
      const result = formatCurrency(1234.56, 'USD', 'en-US');
      expect(result).toContain('1,234.56');
    });
  });

  describe('formatPercentage', () => {
    it('should format as percentage', () => {
      expect(formatPercentage(0.1234, 2)).toBe('12.34%');
      expect(formatPercentage(0.5, 0)).toBe('50%');
    });
  });

  describe('formatBytes', () => {
    it('should format bytes', () => {
      expect(formatBytes(0)).toBe('0 Bytes');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1536)).toBe('1.5 KB');
      expect(formatBytes(1048576)).toBe('1 MB');
    });
  });

  describe('round', () => {
    it('should round to decimals', () => {
      expect(round(1.2345, 2)).toBe(1.23);
      expect(round(1.2345, 0)).toBe(1);
    });
  });

  describe('clamp', () => {
    it('should clamp number between min and max', () => {
      expect(clamp(150, 0, 100)).toBe(100);
      expect(clamp(-10, 0, 100)).toBe(0);
      expect(clamp(50, 0, 100)).toBe(50);
    });
  });

  describe('randomInt', () => {
    it('should generate random integer in range', () => {
      const result = randomInt(1, 10);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
    });
  });

  describe('percentage', () => {
    it('should calculate percentage', () => {
      expect(percentage(25, 100)).toBe(25);
      expect(percentage(1, 4)).toBe(25);
    });

    it('should handle zero total', () => {
      expect(percentage(10, 0)).toBe(0);
    });
  });

  describe('sum', () => {
    it('should sum array of numbers', () => {
      expect(sum([1, 2, 3, 4])).toBe(10);
    });

    it('should handle empty array', () => {
      expect(sum([])).toBe(0);
    });
  });

  describe('average', () => {
    it('should calculate average', () => {
      expect(average([1, 2, 3, 4])).toBe(2.5);
    });

    it('should handle empty array', () => {
      expect(average([])).toBe(0);
    });
  });

  describe('inRange', () => {
    it('should check if number is in range', () => {
      expect(inRange(5, 1, 10)).toBe(true);
      expect(inRange(0, 1, 10)).toBe(false);
      expect(inRange(11, 1, 10)).toBe(false);
    });
  });
});

