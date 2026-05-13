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
      background: scrolled ? 'rgba(6,13,24,0.85)' : '#060d18',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(0,255,239,0.1)' : '0.5px solid rgba(255,255,255,0.06)',
      transition: 'all 0.3s ease',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(0,255,239,0.08)', border: '0.5px solid rgba(0,255,239,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00FFEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <span style={{ fontSize: 15, fontWeight: 500, color: 'white' }}>
          Velence <span style={{ color: '#00FFEF' }}>Vill</span> Kft.
        </span>
      </div>

      {/* Nav links + CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {[['Termékek','termekek'],['Márkák','markak'],['Villanyszerelő','szerelo']].map(([label, id]) => (
          <button key={id} onClick={() => scrollTo(id)}
            style={{ background: 'none', border: 'none', fontSize: 14, color: '#64748B', cursor: 'pointer', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}>
            {label}
          </button>
        ))}
        <button
          onClick={() => scrollTo('ajanlat')}
          style={{ background: '#00FFEF', color: '#000', fontSize: 14, fontWeight: 700, padding: '9px 20px', borderRadius: 50, border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 0 16px rgba(0,255,239,0.25)' }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 28px rgba(0,255,239,0.45)'; e.currentTarget.style.transform = 'scale(1.04)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 16px rgba(0,255,239,0.25)'; e.currentTarget.style.transform = 'scale(1)'; }}>
          Ajánlatot kérek
        </button>
      </div>
    </nav>
  );
}
