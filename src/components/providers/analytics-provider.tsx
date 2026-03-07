'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { logEvent } from 'firebase/analytics';
import { useAnalytics } from '@/firebase/provider';

/**
 * Component that tracks page views on route changes.
 */
function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const analytics = useAnalytics();

  useEffect(() => {
    if (analytics) {
      // Small delay to ensure document.title is updated by Next.js
      const timer = setTimeout(() => {
        logEvent(analytics, 'page_view', {
          page_path: pathname,
          page_location: window.location.href,
          page_title: document.title,
        });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams, analytics]);

  return null;
}

export function AnalyticsProvider() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTracker />
    </Suspense>
  );
}
