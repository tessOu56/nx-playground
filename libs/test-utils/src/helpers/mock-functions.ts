/**
 * Mock function utilities
 */

import { vi } from 'vitest';

/**
 * Create a mock function with type safety
 */
export function createMockFn<T extends (...args: any[]) => any>(): T {
  return vi.fn() as unknown as T;
}

/**
 * Mock console methods
 */
export function mockConsole() {
  const originalConsole = { ...console };
  
  const mocks = {
    log: vi.spyOn(console, 'log').mockImplementation(() => {}),
    error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
    info: vi.spyOn(console, 'info').mockImplementation(() => {}),
  };

  return {
    mocks,
    restore: () => {
      Object.assign(console, originalConsole);
    },
  };
}

/**
 * Mock fetch globally
 */
export function mockFetch(response: any) {
  return vi.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => response,
    text: async () => JSON.stringify(response),
    status: 200,
  } as Response);
}

