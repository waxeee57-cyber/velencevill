'use client';
import { usePathname } from 'next/navigation';
import MobileStickyBar from '@/components/MobileStickyBar';
import CookieBanner from '@/components/CookieBanner';
import ExitSurvey from '@/components/ExitSurvey';
import ConsentAnalytics from '@/components/ConsentAnalytics';

export default function PublicOverlays() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      <MobileStickyBar />
      <CookieBanner />
      <ExitSurvey />
      <ConsentAnalytics />
    </>
  );
}
