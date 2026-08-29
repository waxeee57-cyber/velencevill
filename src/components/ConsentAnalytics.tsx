'use client';
import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { CONSENT_EVENT, hasAnalyticsConsent } from '@/utils/analytics';

export default function ConsentAnalytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sync = () => setAllowed(hasAnalyticsConsent());
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  if (!allowed) return null;
  return <Analytics />;
}
