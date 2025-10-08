import { useLocalStorage as useLocalStorageOriginal } from 'usehooks-ts';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  return useLocalStorageOriginal(key, initialValue);
}
