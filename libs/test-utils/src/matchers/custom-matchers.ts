/**
 * Custom Vitest matchers
 */

import { expect } from 'vitest';

/**
 * Custom matcher: toHaveBeenCalledWithContext
 * Check if logger was called with specific context
 */
export function toHaveBeenCalledWithContext(
  received: any,
  message: string,
  context: Record<string, any>
) {
  const calls = received.mock?.calls || [];
  const pass = calls.some((call: any[]) => {
    return (
      call[0] === message &&
      call[2] &&
      Object.entries(context).every(
        ([key, value]) => call[2][key] === value
      )
    );
  });

  return {
    pass,
    message: () =>
      pass
        ? `Expected function not to be called with message "${message}" and context ${JSON.stringify(context)}`
        : `Expected function to be called with message "${message}" and context ${JSON.stringify(context)}`,
  };
}

// Extend Vitest matchers (optional, for TypeScript support)
declare module 'vitest' {
  interface Assertion {
    toHaveBeenCalledWithContext(
      message: string,
      context: Record<string, any>
    ): void;
  }
}

