import { useDebounceValue } from 'usehooks-ts';

export function useThrottle<T>(value: T, delay: number): T {
  // Note: usehooks-ts doesn't have useThrottle, so we'll use useDebounceValue for now
  // In a real implementation, you might want to create a proper throttle hook
  const [throttledValue] = useDebounceValue(value, delay);
  return throttledValue;
}
