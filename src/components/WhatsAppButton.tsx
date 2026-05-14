'use client';
import { useState } from 'react';
import { trackEvent } from '@/utils/analytics';

export default function WhatsAppButton() {
  const [tooltip, setTooltip] = useState(false);

  return (
    <div style={{ position: 'fixed', bottom: 24, left: 24, zIndex: 50 }}>
      {tooltip && (
        <div style={{ position: 'absolute', bottom: 60, left: 0, background: 'rgba(13,31,60,0.95)', border: '1px solid rgba(0,255,239,0.15)', color: '#fff', fontSize: 12, padding: '6px 12px', borderRadius: 8, whiteSpace: 'nowrap', backdropFilter: 'blur(12px)' }}>
          SMS-ben is elérhetők vagyunk
        </div>
      )}
      <a
        href="sms:+36306182165"
        onClick={() => trackEvent('sms_click')}
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, borderRadius: '50%', background: '#0ea5e9', boxShadow: '0 4px 16px rgba(14,165,233,0.35)', transition: 'all 0.3s ease', textDecoration: 'none' }}
        onFocus={() => setTooltip(true)}
        onBlur={() => setTooltip(false)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
      </a>
    </div>
  );
}
