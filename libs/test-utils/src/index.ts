/**
 * @nx-playground/test-utils
 *
 * Unified testing utilities for the Nx monorepo
 * Provides mock data generators, test helpers, and custom matchers
 *
 * @example
 * ```typescript
 * import { createMockUser, renderWithProviders } from '@nx-playground/test-utils';
 *
 * // Create mock data
 * const mockUser = createMockUser({ role: 'admin' });
 *
 * // Render with providers
 * const { getByText } = renderWithProviders(<UserProfile user={mockUser} />);
 * expect(getByText('Admin')).toBeInTheDocument();
 * ```
 */

// Mock data generators
export * from './mocks/user';
export * from './mocks/event';
export * from './mocks/blog';
export * from './mocks/project';

// Test helpers
export * from './helpers/render';
export * from './helpers/wait';
export * from './helpers/mock-functions';

// Custom matchers
export * from './matchers/custom-matchers';

// Testing utilities
export * from './utils/test-utils';
