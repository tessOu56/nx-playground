/**
 * React hook for analytics
 */

import { useCallback } from 'react';
import { track, pageView, identify } from '../lib/analytics';
import type { EventProperties, UserProperties } from '../types/analytics';

export function useAnalytics() {
  const trackEvent = useCallback(
    (eventName: string, properties?: EventProperties) => {
      track(eventName, properties);
    },
    []
  );

  const trackPageView = useCallback((path: string, title?: string) => {
    pageView(path, title);
  }, []);

  const identifyUser = useCallback(
    (userId: string, properties?: UserProperties) => {
      identify(userId, properties);
    },
    []
  );

  return {
    track: trackEvent,
    pageView: trackPageView,
    identify: identifyUser,
  };
}

