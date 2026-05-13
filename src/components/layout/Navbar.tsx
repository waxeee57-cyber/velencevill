'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2rem', height: 64,
      background: scrolled ? 'rgba(6,13,24,0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(0,255,239,0.1)' : '1px solid transparent',
      transition: 'all 0.3s ease',
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(0,255,239,0.08)', border: '0.5px solid rgba(0,255,239,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00FFEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <span style={{ fontSize: 15, fontWeight: 500, color: 'white' }}>
          Velence <span style={{ color: '#00FFEF' }}>Vill</span> Kft.
        </span>
      </Link>

      {/* Nav links + CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {[['Termékek','/termekek'],['Márkák','/markak'],['Villanyszerelő','/szerelo'],['Tudástár','/tudastar'],['Kalkulátor','/kalkulator']].map(([label, href]) => (
          <Link key={href} href={href}
            style={{ fontSize: 14, color: '#64748B', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}>
            {label}
          </Link>
        ))}
        <Link href="/#ajanlat" className="btn-primary" style={{ textDecoration: 'none', padding: '9px 20px', fontSize: 14 }}>
          Ajánlatot kérek
        </Link>
      </div>
    </nav>
  );
}
