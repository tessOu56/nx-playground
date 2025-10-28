/**
 * React hook for automatic page view tracking
 */

import { useEffect } from 'react';
import { pageView } from '../lib/analytics';

/**
 * Automatically track page views on route change
 * 
 * @example
 * ```tsx
 * function App() {
 *   const location = useLocation();
 *   usePageTracking(location.pathname);
 *   
 *   return <Routes>...</Routes>;
 * }
 * ```
 */
export function usePageTracking(pathname: string, title?: string): void {
  useEffect(() => {
    pageView(pathname, title);
  }, [pathname, title]);
}

