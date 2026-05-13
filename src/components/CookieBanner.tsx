'use client';
import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('velencevill_cookie_consent')) setVisible(true);
  }, []);

  const accept = (type: 'all' | 'necessary') => {
    localStorage.setItem('velencevill_cookie_consent', type);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, padding: '1rem 1.5rem', background: 'rgba(6,13,24,0.96)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(0,255,239,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
      <p style={{ fontSize: 13, color: '#8899aa', maxWidth: 600, margin: 0 }}>
        Ez a weboldal sütiket (cookie-kat) használ a jobb felhasználói élmény érdekében.
        <a href="#" style={{ color: '#00FFEF', marginLeft: 4 }}>Adatvédelmi tájékoztató</a>
      </p>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button onClick={() => accept('necessary')} className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>
          Csak szükségesek
        </button>
        <button onClick={() => accept('all')} className="btn-primary" style={{ padding: '8px 20px', fontSize: 13 }}>
          Elfogadom
        </button>
      </div>
    </div>
  );
}
