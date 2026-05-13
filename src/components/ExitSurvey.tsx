'use client';
import { useState, useEffect, useRef } from 'react';
import { trackEvent } from '@/utils/analytics';

type Step = 'hidden' | 'q1' | 'q2' | 'done';

export default function ExitSurvey() {
  const [step, setStep] = useState<Step>('hidden');
  const [q1, setQ1] = useState('');
  const triggered = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (localStorage.getItem('vv_survey_done')) return;
    } catch { return; }

    const trigger = () => {
      if (triggered.current) return;
      triggered.current = true;
      setStep('q1');
    };

    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY < 50 && !e.relatedTarget) trigger();
    };

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const delay = isMobile ? 45000 : 30000;
    const timer = setTimeout(trigger, delay);
    document.addEventListener('mouseout', onMouseOut);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  const dismiss = () => {
    setStep('hidden');
    try { localStorage.setItem('vv_survey_done', '1'); } catch { /* ignore */ }
  };

  const submitQ1 = (answer: string) => {
    setQ1(answer);
    setStep('q2');
  };

  const submitQ2 = (answer: string) => {
    setStep('done');
    try { localStorage.setItem('vv_survey_done', '1'); } catch { /* ignore */ }
    trackEvent('survey_submit', { found: q1, missing: answer });
    setTimeout(dismiss, 2000);
  };

  if (step === 'hidden') return null;

  const btnStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 'max-content',
    background: 'rgba(13,31,60,0.8)',
    border: '1px solid rgba(0,255,239,0.2)',
    borderRadius: 8,
    padding: '8px 12px',
    color: '#fff',
    fontSize: 12,
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 80,
      width: 'min(400px, calc(100vw - 32px))',
    }}>
      <div className="glass-card" style={{ padding: '1.25rem', position: 'relative' }}>
        <button
          onClick={dismiss}
          style={{ position: 'absolute', top: 10, right: 12, background: 'none', border: 'none', color: '#8899aa', fontSize: 20, cursor: 'pointer', lineHeight: 1, padding: 0 }}>
          ×
        </button>

        {step === 'q1' && (
          <>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 10, paddingRight: 24 }}>Megtalálta amit keresett?</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Igen, megtaláltam', 'Részben', 'Nem találtam meg'].map(opt => (
                <button key={opt} onClick={() => submitQ1(opt)} style={btnStyle}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,255,239,0.5)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,255,239,0.2)'; }}>
                  {opt}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'q2' && (
          <>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 10, paddingRight: 24 }}>Mi hiányzott az oldalról?</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Árak', 'Termékfotók', 'Elérhetőség', 'Egyéb'].map(opt => (
                <button key={opt} onClick={() => submitQ2(opt)} style={btnStyle}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,255,239,0.5)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,255,239,0.2)'; }}>
                  {opt}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'done' && (
          <p style={{ fontSize: 13, color: '#00FFEF', textAlign: 'center', margin: 0 }}>Köszönjük visszajelzését!</p>
        )}
      </div>
    </div>
  );
}
