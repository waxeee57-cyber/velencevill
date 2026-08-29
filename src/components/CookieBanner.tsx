'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CONSENT_EVENT, CONSENT_KEY } from '@/utils/analytics';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
  }, []);

  const accept = (type: 'all' | 'necessary') => {
    localStorage.setItem(CONSENT_KEY, type);
    window.dispatchEvent(new Event(CONSENT_EVENT));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" style={{ position: 'fixed', left: 0, right: 0, zIndex: 100, paddingTop: '1rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', background: 'rgba(6,13,24,0.96)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(0,255,239,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
      <p style={{ fontSize: 13, color: '#8899aa', maxWidth: 600, margin: 0 }}>
        Ez a weboldal sütiket (cookie-kat) használ a jobb felhasználói élmény érdekében.
        <Link href="/adatvedelem" style={{ color: '#00FFEF', marginLeft: 4 }}>Adatvédelmi tájékoztató</Link>
      </p>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button onClick={() => accept('necessary')} className="btn-secondary" style={{ padding: '11px 18px', fontSize: 13, minHeight: 44 }}>
          Csak szükségesek
        </button>
        <button onClick={() => accept('all')} className="btn-primary" style={{ padding: '11px 20px', fontSize: 13, minHeight: 44 }}>
          Elfogadom
        </button>
      </div>
    </div>
  );
}
