import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to scroll to top on route change
 * Ensures user sees the top of new pages
 */
export function useScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);
}

