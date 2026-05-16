'use client';
import { useState } from 'react';
import { trackEvent } from '@/utils/analytics';
import Toast from '@/components/ui/Toast';

type FormState = 'idle' | 'loading' | 'success';

const inputStyle: React.CSSProperties = {
  fontSize: 14,
  padding: '10px 14px',
  border: '1px solid rgba(0,255,239,0.2)',
  borderRadius: 8,
  background: '#060d18',
  color: '#ffffff',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#8899aa',
  display: 'block',
  marginBottom: 4,
};

export default function ContactForm() {
  const [state, setState] = useState<FormState>('idle');
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setToast({ message: 'Kérjük adja meg a nevét.', type: 'error' });
      return;
    }
    if (!form.phone.trim()) {
      setToast({ message: 'Telefonszám kötelező.', type: 'error' });
      return;
    }
    setState('loading');
    trackEvent('form_submit');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setState('success');
      trackEvent('form_success');
    } catch {
      setState('idle');
      setToast({ message: 'Hiba történt. Kérjük, próbálja újra.', type: 'error' });
    }
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = '#00FFEF';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,255,239,0.1)';
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'rgba(0,255,239,0.2)';
    e.currentTarget.style.boxShadow = 'none';
  };

  if (state === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 0' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#ffffff', marginBottom: 8 }}>Köszönjük megkeresését!</h3>
        <p style={{ fontSize: 14, color: '#8899aa' }}>1 munkanapon belül felvesszük Önnel a kapcsolatot.</p>
      </div>
    );
  }

  return (
    <>
      <div style={{ maxWidth: 480, margin: '0 auto', overflow: 'hidden' }}>
        <div className="form-row-grid">
          <div>
            <label htmlFor="cf-name" style={labelStyle}>Neve *</label>
            <input
              id="cf-name"
              style={inputStyle}
              placeholder="Kovács János"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              onFocus={onFocus}
              onBlur={onBlur}
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="cf-phone" style={labelStyle}>Telefon *</label>
            <input
              id="cf-phone"
              type="tel"
              style={inputStyle}
              placeholder="+36 30 ..."
              value={form.phone}
              onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              onFocus={onFocus}
              onBlur={onBlur}
              autoComplete="tel"
            />
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="cf-email" style={labelStyle}>E-mail cím</label>
          <input
            id="cf-email"
            type="email"
            style={inputStyle}
            placeholder="pelda@email.hu"
            value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            onFocus={onFocus}
            onBlur={onBlur}
            autoComplete="email"
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="cf-subject" style={labelStyle}>Mire van szüksége?</label>
          <select
            id="cf-subject"
            style={{ ...inputStyle, cursor: 'pointer' }}
            value={form.subject}
            onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
            onFocus={onFocus}
            onBlur={onBlur}>
            <option value="">Válasszon témát...</option>
            <option>Kábel / vezeték</option>
            <option>Kapcsoló / dugalj</option>
            <option>Elosztó / szekrény</option>
            <option>Világítástechnika</option>
            <option>Villanyszerelő ajánlás</option>
            <option>Egyéb</option>
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="cf-message" style={labelStyle}>Üzenet (opcionális)</label>
          <textarea
            id="cf-message"
            style={{ ...inputStyle, resize: 'vertical', minHeight: 88 }}
            placeholder="Pl. mire keresnek megoldást..."
            value={form.message}
            onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={state === 'loading'}
          aria-label="Ajánlatkérő űrlap elküldése"
          style={{
            width: '100%',
            background: state === 'loading' ? 'rgba(0,255,239,0.5)' : '#00FFEF',
            color: '#000', fontSize: 15, fontWeight: 700,
            padding: '13px 24px', borderRadius: 50, border: 'none',
            cursor: state === 'loading' ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
          {state === 'loading' ? 'Küldés...' : '→ Ajánlatot kérek'}
        </button>
        <p style={{ fontSize: 12, color: '#8899aa', textAlign: 'center', marginTop: 12 }}>
          Adatait bizalmasan kezeljük.
        </p>
      </div>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </>
  );
}
