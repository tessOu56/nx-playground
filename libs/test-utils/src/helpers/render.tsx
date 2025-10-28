/**
 * Render helpers for React Testing Library
 */

import { render, type RenderOptions } from '@testing-library/react';
import { type ReactElement } from 'react';

interface AllTheProvidersProps {
  children: React.ReactNode;
}

/**
 * Wrapper with all providers (i18n, theme, router, etc.)
 * Customize this based on your app's providers
 */
function AllTheProviders({ children }: AllTheProvidersProps) {
  return <>{children}</>;
}

/**
 * Custom render with providers
 * 
 * @example
 * ```tsx
 * import { renderWithProviders } from '@nx-playground/test-utils';
 * 
 * const { getByText } = renderWithProviders(<MyComponent />);
 * ```
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): ReturnType<typeof render> {
  return render(ui, { wrapper: AllTheProviders, ...options });
}

// Re-export everything from testing library
export * from '@testing-library/react';

