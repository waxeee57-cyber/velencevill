'use client';

export default function MobileStickyBar() {
  const scrollToAjanlat = () =>
    document.getElementById('ajanlat')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div
      className="flex md:hidden"
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 60,
        background: 'rgba(6,13,24,0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(0,255,239,0.2)',
      }}>
      <a
        href="tel:+36306182165"
        style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 0', textDecoration: 'none', color: '#8899aa', fontSize: 10, fontWeight: 500, gap: 3, transition: 'color 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#00FFEF')}
        onMouseLeave={e => (e.currentTarget.style.color = '#8899aa')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.01 2.22a2 2 0 011.98-2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
        </svg>
        Hívás
      </a>

      <a
        href="https://www.google.com/maps/dir/?api=1&destination=47.2474,18.6421"
        target="_blank"
        rel="noopener noreferrer"
        style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 0', textDecoration: 'none', color: '#8899aa', fontSize: 10, fontWeight: 500, gap: 3, transition: 'color 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#00FFEF')}
        onMouseLeave={e => (e.currentTarget.style.color = '#8899aa')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
        Útvonal
      </a>

      <a
        href="https://wa.me/36306182165"
        target="_blank"
        rel="noopener noreferrer"
        style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 0', textDecoration: 'none', color: '#8899aa', fontSize: 10, fontWeight: 500, gap: 3, transition: 'color 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#00FFEF')}
        onMouseLeave={e => (e.currentTarget.style.color = '#8899aa')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
        </svg>
        WhatsApp
      </a>

      <button
        onClick={scrollToAjanlat}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 0', background: 'none', border: 'none', color: '#8899aa', fontSize: 10, fontWeight: 500, cursor: 'pointer', gap: 3, transition: 'color 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#00FFEF')}
        onMouseLeave={e => (e.currentTarget.style.color = '#8899aa')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
        </svg>
        Árajánlat
      </button>
    </div>
  );
}
