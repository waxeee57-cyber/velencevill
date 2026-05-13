'use client';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2rem', height: 64,
      background: scrolled ? 'rgba(6,13,24,0.96)' : '#060d18',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: '0.5px solid rgba(255,255,255,0.06)',
      transition: 'all 0.3s',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(0,255,239,0.08)', border: '0.5px solid rgba(0,255,239,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00FFEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <span style={{ fontSize: 15, fontWeight: 500, color: 'white', fontFamily: 'system-ui, sans-serif' }}>
          Velence <span style={{ color: '#00FFEF' }}>Vill</span> Kft.
        </span>
      </div>

      {/* Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {[['Termékek','termekek'],['Márkák','markak'],['Villanyszerelő','szerelo']].map(([label, id]) => (
          <button key={id} onClick={() => scrollTo(id)} style={{ background: 'none', border: 'none', fontSize: 14, color: '#64748B', cursor: 'pointer', fontFamily: 'system-ui, sans-serif', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}>
            {label}
          </button>
        ))}
        <button onClick={() => scrollTo('ajanlat')} style={{ background: '#00FFEF', color: '#000', fontSize: 14, fontWeight: 600, padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'system-ui, sans-serif' }}>
          Ajánlatot kérek
        </button>
      </div>
    </nav>
  );
}
