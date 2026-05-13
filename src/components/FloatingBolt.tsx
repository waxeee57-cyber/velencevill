'use client';
import { useState, useEffect } from 'react';

export default function FloatingBolt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <div
      className="floating-bolt"
      style={{ position: 'fixed', top: 80, right: 24, zIndex: 40, cursor: 'pointer' }}>
      <div className="bolt-flash" style={{ position: 'relative' }}>
        <svg width="50" height="80" viewBox="0 0 24 38" fill="none" stroke="#00FFEF" strokeWidth="1.5">
          <path d="M13 2L3 20h9l-1 16 10-19h-9l1-17z"/>
        </svg>
        <span className="bolt-spark spark-1" />
        <span className="bolt-spark spark-2" />
        <span className="bolt-spark spark-3" />
        <span className="bolt-spark spark-4" />
      </div>
    </div>
  );
}
