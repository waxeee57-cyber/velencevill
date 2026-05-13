'use client';
import { useState, useEffect } from 'react';

interface Spark { id: number; x: number; y: number }

export default function FloatingBolt() {
  const [show, setShow] = useState(false);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [flashing, setFlashing] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sparkTimer = setInterval(() => {
      const count = 3 + Math.floor(Math.random() * 3);
      setSparks(Array.from({ length: count }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 50 - 5,
        y: Math.random() * 80 - 5,
      })));
      setTimeout(() => setSparks([]), 400);
    }, 3000);

    const flashTimer = setInterval(() => {
      setFlashing(true);
      setTimeout(() => setFlashing(false), 100);
    }, 5000);

    return () => { clearInterval(sparkTimer); clearInterval(flashTimer); };
  }, []);

  if (!show) return null;

  return (
    <div
      style={{ position: 'fixed', top: 80, right: 24, zIndex: 40, cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <div style={{
        position: 'relative',
        animation: 'boltSpin 8s cubic-bezier(0.68,-0.55,0.265,1.55) infinite',
        filter: flashing
          ? 'brightness(3) drop-shadow(0 0 15px #00FFEF)'
          : `drop-shadow(0 0 ${hovered ? '20px' : '6px'} rgba(0,255,239,${hovered ? '0.9' : '0.5'}))`,
        transform: hovered ? 'perspective(200px) rotateY(20deg) rotateX(-10deg) scale(1.2)' : 'none',
        transition: 'transform 0.3s ease, filter 0.3s ease',
      }}>
        <svg width="50" height="80" viewBox="0 0 24 38" fill="none" stroke="#00FFEF" strokeWidth="1.5">
          <path d="M13 2L3 20h9l-1 16 10-19h-9l1-17z"/>
        </svg>
        {sparks.map(s => (
          <div key={s.id} style={{
            position: 'absolute', width: 5, height: 5, borderRadius: '50%',
            background: '#00FFEF', left: s.x, top: s.y,
            animation: 'sparkFade 0.4s ease-out forwards',
            boxShadow: '0 0 4px #00FFEF',
          }} />
        ))}
      </div>
    </div>
  );
}
