import { describe, it, expect } from 'vitest';

import {
  unique,
  chunk,
  shuffle,
  groupBy,
  sortBy,
  sample,
  sampleSize,
  flatten,
  compact,
  intersection,
  difference,
} from './array';

describe('Array Utilities', () => {
  describe('unique', () => {
    it('should remove duplicates', () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
      expect(unique(['a', 'b', 'a'])).toEqual(['a', 'b']);
    });
  });

  describe('chunk', () => {
    it('should chunk array', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('should handle exact chunks', () => {
      expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
    });
  });

  describe('shuffle', () => {
    it('should shuffle array', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = shuffle(arr);
      
      expect(shuffled.length).toBe(arr.length);
      expect(shuffled).toContain(1);
      expect(shuffled).toContain(5);
    });
  });

  describe('groupBy', () => {
    it('should group by key', () => {
      const items = [
        { type: 'a', value: 1 },
        { type: 'b', value: 2 },
        { type: 'a', value: 3 },
      ];
      const grouped = groupBy(items, 'type');
      
      expect(grouped.a.length).toBe(2);
      expect(grouped.b.length).toBe(1);
    });
  });

  describe('sortBy', () => {
    it('should sort by key ascending', () => {
      const items = [{ age: 30 }, { age: 20 }, { age: 25 }];
      const sorted = sortBy(items, 'age', 'asc');
      
      expect(sorted[0].age).toBe(20);
      expect(sorted[2].age).toBe(30);
    });

    it('should sort by key descending', () => {
      const items = [{ age: 30 }, { age: 20 }, { age: 25 }];
      const sorted = sortBy(items, 'age', 'desc');
      
      expect(sorted[0].age).toBe(30);
      expect(sorted[2].age).toBe(20);
    });
  });

  describe('sample', () => {
    it('should return random element', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = sample(arr);
      
      expect(arr).toContain(result);
    });

    it('should return undefined for empty array', () => {
      expect(sample([])).toBeUndefined();
    });
  });

  describe('sampleSize', () => {
    it('should return N random elements', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = sampleSize(arr, 3);
      
      expect(result.length).toBe(3);
      result.forEach(item => expect(arr).toContain(item));
    });

    it('should handle size larger than array', () => {
      const arr = [1, 2, 3];
      const result = sampleSize(arr, 10);
      
      expect(result.length).toBe(3);
    });
  });

  describe('flatten', () => {
    it('should flatten nested arrays', () => {
      expect(flatten([[1, 2], [3, [4, 5]]])).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('compact', () => {
    it('should remove falsy values', () => {
      expect(compact([0, 1, false, 2, '', 3, null, undefined])).toEqual([1, 2, 3]);
    });
  });

  describe('intersection', () => {
    it('should return common elements', () => {
      expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
    });

    it('should handle multiple arrays', () => {
      expect(intersection([1, 2, 3], [2, 3, 4], [2, 5])).toEqual([2]);
    });
  });

  describe('difference', () => {
    it('should return elements in first array only', () => {
      expect(difference([1, 2, 3], [2, 3, 4])).toEqual([1]);
    });
  });
});

