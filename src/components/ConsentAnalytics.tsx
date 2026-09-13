'use client';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { CONSENT_EVENT, hasAnalyticsConsent } from '@/utils/analytics';

// Microsoft Clarity (session replay + hőtérkép). Csak akkor töltődik be, ha
// a látogató elfogadta az analitikai sütiket (CookieBanner) ÉS be van állítva
// a NEXT_PUBLIC_CLARITY_ID env változó. ID nélkül nulla hálózati kérés megy ki.
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

export default function ConsentAnalytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sync = () => setAllowed(hasAnalyticsConsent());
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  if (!allowed) return null;

  return (
    <>
      <Analytics />
      {CLARITY_ID ? (
        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
        </Script>
      ) : null}
    </>
  );
}
