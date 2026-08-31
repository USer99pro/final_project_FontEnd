/**
 * RouteAnalytics.jsx
 * Automatically tracks PAGE_VIEW events on every route change.
 * - Uses useRef to prevent double-tracking from React StrictMode.
 * - Fire-and-forget: never blocks rendering.
 */
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackAnalyticsEvent } from '../../api/analyticsService';

export default function RouteAnalytics() {
  const location = useLocation();
  const lastTrackedPath = useRef(null);

  useEffect(() => {
    // Prevent double-fire from React StrictMode or re-renders
    const path = location.pathname + location.search;
    if (lastTrackedPath.current === path) return;
    lastTrackedPath.current = path;

    trackAnalyticsEvent({
      event: 'PAGE_VIEW',
      page: location.pathname,
    });
  }, [location.pathname, location.search]);

  // Renders nothing
  return null;
}
