'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { trackEvent, hasAnalyticsConsent } from '@/utils/analytics';

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!hasAnalyticsConsent()) return;
    trackEvent('pageview', { url: pathname });
  }, [pathname]);

  return null;
}