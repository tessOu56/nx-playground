/**
 * Wait utilities for async testing
 */

/**
 * Wait for a condition to be true
 * 
 * @example
 * ```ts
 * await waitFor(() => expect(element).toBeInTheDocument());
 * ```
 */
export { waitFor } from '@testing-library/react';

/**
 * Wait for specified milliseconds
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wait for next tick
 */
export function waitForNextTick(): Promise<void> {
  return new Promise((resolve) => process.nextTick(resolve));
}

