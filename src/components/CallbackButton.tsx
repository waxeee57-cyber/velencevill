'use client';
import { useState } from 'react';

export default function CallbackButton() {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  const submit = async () => {
    if (!phone) return;
    setStatus('loading');
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nev: 'Visszahívás kérés', telefon: phone, tema: 'Visszahívás', tipus: 'szakuzlet' }),
      });
    } catch { /* graceful skip */ }
    setStatus('done');
    setTimeout(() => { setOpen(false); setPhone(''); setStatus('idle'); }, 2500);
  };

  return (
    <div className="desktop-only" style={{ position: 'fixed', bottom: 88, right: 24, zIndex: 50 }}>
      {open && (
        <div className="glass-card" style={{ position: 'absolute', bottom: 60, right: 0, width: 260, padding: '1rem', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          {status === 'done' ? (
            <p style={{ fontSize: 14, color: '#00FFEF', textAlign: 'center' }}>✓ Visszahívást kértük!</p>
          ) : (
            <>
              <p style={{ fontSize: 13, color: '#8899aa', marginBottom: 10 }}>Telefonszáma és visszahívjuk!</p>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+36 30 ..."
                style={{ width: '100%', boxSizing: 'border-box', background: '#060d18', border: '1px solid rgba(0,255,239,0.2)', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 14, marginBottom: 8, outline: 'none' }}
                onKeyDown={e => e.key === 'Enter' && submit()}
              />
              <button onClick={submit} disabled={status === 'loading'} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px 20px', fontSize: 14 }}>
                {status === 'loading' ? 'Küldés...' : 'Visszahívást kérek'}
              </button>
            </>
          )}
        </div>
      )}
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, borderRadius: '50%', background: '#00FFEF', border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,255,239,0.3)', transition: 'all 0.3s ease' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,255,239,0.5)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,255,239,0.3)'; }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.01 2.22a2 2 0 011.98-2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
        </svg>
      </button>
    </div>
  );
}
