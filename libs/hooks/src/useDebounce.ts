import { useDebounceValue } from 'usehooks-ts';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue] = useDebounceValue(value, delay);
  return debouncedValue;
}
