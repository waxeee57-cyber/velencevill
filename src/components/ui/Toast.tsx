'use client';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const COLORS = {
  success: { bg: '#166534', border: 'rgba(34,197,94,0.4)', dot: '#22c55e' },
  error:   { bg: '#7f1d1d', border: 'rgba(239,68,68,0.4)',  dot: '#ef4444' },
  info:    { bg: '#1e3a5f', border: 'rgba(0,255,239,0.3)',  dot: '#00FFEF' },
};

export default function Toast({ message, type = 'info', onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  const c = COLORS[type];
  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: 'fixed', bottom: 96, right: 16, zIndex: 200,
        background: c.bg, border: `1px solid ${c.border}`,
        borderRadius: 12, padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 10,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        maxWidth: 'min(360px, calc(100vw - 32px))',
        animation: 'slideUp 0.3s ease-out',
      }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
      <p style={{ flex: 1, fontSize: 14, color: '#fff', lineHeight: 1.4, margin: 0 }}>{message}</p>
      <button
        onClick={onClose}
        aria-label="Bezárás"
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', flexShrink: 0, padding: 4, lineHeight: 1 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
  );
}
