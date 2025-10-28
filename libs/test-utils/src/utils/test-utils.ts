/**
 * General testing utilities
 */

/**
 * Create a fake DOM event
 */
export function createFakeEvent<K extends keyof DocumentEventMap>(
  type: K,
  options?: EventInit
): Event {
  return new Event(type, options);
}

/**
 * Suppress console errors during test
 */
export function suppressConsoleError(fn: () => void | Promise<void>) {
  const originalError = console.error;
  console.error = () => {};
  try {
    return fn();
  } finally {
    console.error = originalError;
  }
}

/**
 * Generate random string for test IDs
 */
export function randomId(prefix = 'test'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

