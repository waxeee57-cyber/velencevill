'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAnyaglistaCount } from '@/hooks/useAnyaglista';

type Notice = { id: string; body: string; href?: string | null };

function NoticeItem({ notice }: { notice: Notice }) {
  const style: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: '#060d18',
    whiteSpace: 'nowrap',
    textDecoration: notice.href ? 'underline' : 'none',
    textUnderlineOffset: 3,
  };
  if (notice.href) {
    const external = notice.href.startsWith('http');
    return (
      <a
        href={notice.href}
        style={style}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {notice.body}
      </a>
    );
  }
  return <span style={style}>{notice.body}</span>;
}

function NewsBar({ notices }: { notices: Notice[] }) {
  const items = notices.length === 1 ? notices : [...notices, ...notices];
  const scroll = notices.length > 1;

  return (
    <div
      className="news-bar"
      role="status"
      aria-live="polite"
      style={{
        background: '#00FFEF',
        color: '#060d18',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(6,13,24,0.12)',
      }}
    >
      <div
        className={scroll ? 'news-bar-track' : undefined}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: scroll ? 'flex-start' : 'center',
          gap: scroll ? 40 : 12,
          width: scroll ? 'max-content' : '100%',
          padding: '8px 16px',
        }}
      >
        {items.map((n, i) => (
          <span key={`${n.id}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
            <NoticeItem notice={n} />
            {scroll && (
              <span aria-hidden="true" style={{ opacity: 0.45, fontWeight: 700 }}>·</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const anyaglistaCount = useAnyaglistaCount();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    let stop = false;
    async function load() {
      try {
        const res = await fetch('/api/notices');
        if (!res.ok) return;
        const data = await res.json();
        if (!stop) setNotices(Array.isArray(data.notices) ? data.notices : []);
      } catch {
        /* üres sáv, ha nincs hír / tábla */
      }
    }
    load();
    const t = setInterval(load, 60000);
    return () => { stop = true; clearInterval(t); };
  }, []);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50 }}>
      {notices.length > 0 && <NewsBar notices={notices} />}
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
