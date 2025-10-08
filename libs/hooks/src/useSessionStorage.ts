import { useSessionStorage as useSessionStorageOriginal } from 'usehooks-ts';

export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  return useSessionStorageOriginal(key, initialValue);
}
