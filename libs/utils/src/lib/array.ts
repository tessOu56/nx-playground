/**
 * Array manipulation utilities
 */

/**
 * Remove duplicates from array
 * @example unique([1, 2, 2, 3]) => [1, 2, 3]
 */
export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * Chunk array into smaller arrays
 * @example chunk([1, 2, 3, 4, 5], 2) => [[1, 2], [3, 4], [5]]
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/**
 * Shuffle array randomly
 * @example shuffle([1, 2, 3, 4]) => [3, 1, 4, 2]
 */
export function shuffle<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Group array by key
 * @example groupBy([{type: 'a', val: 1}, {type: 'b', val: 2}], 'type')
 *          => {a: [{type: 'a', val: 1}], b: [{type: 'b', val: 2}]}
 */
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const groupKey = String(item[key]);
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

/**
 * Sort array by key
 * @example sortBy([{age: 30}, {age: 20}], 'age') => [{age: 20}, {age: 30}]
 */
export function sortBy<T>(
  arr: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Pick random element from array
 * @example sample([1, 2, 3, 4]) => 3
 */
export function sample<T>(arr: T[]): T | undefined {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Pick N random elements from array
 * @example sampleSize([1, 2, 3, 4], 2) => [2, 4]
 */
export function sampleSize<T>(arr: T[], n: number): T[] {
  const shuffled = shuffle(arr);
  return shuffled.slice(0, Math.min(n, arr.length));
}

/**
 * Flatten nested array
 * @example flatten([[1, 2], [3, [4, 5]]]) => [1, 2, 3, 4, 5]
 */
export function flatten<T>(arr: unknown[]): T[] {
  return arr.flat(Infinity) as T[];
}

/**
 * Remove falsy values from array
 * @example compact([0, 1, false, 2, '', 3]) => [1, 2, 3]
 */
export function compact<T>(arr: (T | null | undefined | false | 0 | '')[]): T[] {
  return arr.filter(Boolean) as T[];
}

/**
 * Intersect multiple arrays
 * @example intersection([1, 2, 3], [2, 3, 4]) => [2, 3]
 */
export function intersection<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) return [];
  return arrays.reduce((acc, arr) => acc.filter(item => arr.includes(item)));
}

/**
 * Difference between two arrays
 * @example difference([1, 2, 3], [2, 3, 4]) => [1]
 */
export function difference<T>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter(item => !arr2.includes(item));
}

