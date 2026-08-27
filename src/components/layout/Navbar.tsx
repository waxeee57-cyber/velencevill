'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAnyaglistaCount } from '@/hooks/useAnyaglista';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const anyaglistaCount = useAnyaglistaCount();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50 }}>
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2rem', height: 64,
        background: scrolled ? 'rgba(6,13,24,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,255,239,0.1)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        <Link href="/" aria-label="Velence Vill Kft. – Főoldal" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(0,255,239,0.08)', border: '0.5px solid rgba(0,255,239,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00FFEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <span style={{ fontSize: 15, fontWeight: 500, color: 'white' }}>
            Velence <span style={{ color: '#00FFEF' }}>Vill</span> Kft.
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div className="nav-links">
            {[['Termékek','/termekek'],['Márkák','/markak'],['Villanyszerelő','/szerelo'],['Tudástár','/tudastar'],['Kalkulátor','/kalkulator']].map(([label, href]) => (
              <Link key={href} href={href}
                style={{ fontSize: 14, color: '#64748B', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}>
                {label}
              </Link>
            ))}
          </div>
          <Link
            href="/anyaglista"
            aria-label={`Anyaglista${anyaglistaCount > 0 ? ` — ${anyaglistaCount} tétel` : ''}`}
            style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 8, background: 'rgba(0,255,239,0.08)', border: '0.5px solid rgba(0,255,239,0.2)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00FFEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {anyaglistaCount > 0 && (
              <span aria-hidden="true" style={{ position: 'absolute', top: -6, right: -6, minWidth: 17, height: 17, padding: '0 4px', borderRadius: 9, background: '#EF4444', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {anyaglistaCount}
              </span>
            )}
          </Link>
          <Link href="/#ajanlat" className="btn-primary" style={{ textDecoration: 'none', padding: '9px 16px', fontSize: 13 }}>
            Ajánlatot kérek
          </Link>
        </div>
      </nav>
    </header>
  );
}
