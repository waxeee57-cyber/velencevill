import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#060d18', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        <div style={{ fontSize: '10rem', fontWeight: 700, color: 'rgba(0,255,239,0.08)', lineHeight: 1, letterSpacing: '-0.05em', userSelect: 'none' }}>404</div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="64" height="96" viewBox="0 0 24 36" fill="none" stroke="#00FFEF" strokeWidth="1.5"
            style={{ filter: 'drop-shadow(0 0 12px #00FFEF)', animation: 'float 3s ease-in-out infinite' }}>
            <path d="M13 1L3 18h9l-1 17 10-18h-9l1-17z"/>
          </svg>
        </div>
      </div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem' }}>
        Az oldal nem található
      </h1>
      <p style={{ fontSize: '1rem', color: '#8899aa', marginBottom: '2rem', maxWidth: 400 }}>
        A keresett oldal nem létezik, vagy áthelyezték. Térjen vissza a főoldalra.
      </p>
      <Link href="/" className="btn-primary" style={{ textDecoration: 'none' }}>
        Vissza a főoldalra
      </Link>
      <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }`}</style>
    </div>
  );
}
