'use client';
import { useState } from 'react';
import { trackEvent } from '@/utils/analytics';

type FormState = 'idle' | 'loading' | 'success' | 'error';

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
  const [form, setForm] = useState({ nev: '', telefon: '', email: '', tema: '', uzenet: '' });

  const handleSubmit = async () => {
    if (!form.nev || !form.telefon) return alert('Név és telefonszám kötelező.');
    setState('loading');
    trackEvent('form_submit');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tipus: 'szakuzlet' }),
      });
      if (!res.ok) throw new Error();
      setState('success');
    } catch {
      setState('error');
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
    <div style={{ maxWidth: 480, margin: '0 auto', overflow: 'hidden' }}>
      <div className="form-row-grid">
        <div>
          <label style={labelStyle}>Neve *</label>
          <input style={inputStyle} placeholder="Kovács János" value={form.nev}
            onChange={e => setForm(p => ({ ...p, nev: e.target.value }))}
            onFocus={onFocus} onBlur={onBlur} />
        </div>
        <div>
          <label style={labelStyle}>Telefon *</label>
          <input style={inputStyle} placeholder="+36 30 ..." value={form.telefon}
            onChange={e => setForm(p => ({ ...p, telefon: e.target.value }))}
            onFocus={onFocus} onBlur={onBlur} />
        </div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>E-mail cím</label>
        <input style={inputStyle} placeholder="pelda@email.hu" value={form.email}
          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          onFocus={onFocus} onBlur={onBlur} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Mire van szüksége?</label>
        <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.tema}
          onChange={e => setForm(p => ({ ...p, tema: e.target.value }))}
          onFocus={onFocus} onBlur={onBlur}>
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
        <label style={labelStyle}>Üzenet (opcionális)</label>
        <textarea
          style={{ ...inputStyle, resize: 'vertical', minHeight: 88 }}
          placeholder="Pl. mire keresnek megoldást..."
          value={form.uzenet}
          onChange={e => setForm(p => ({ ...p, uzenet: e.target.value }))}
          onFocus={onFocus} onBlur={onBlur} />
      </div>
      {state === 'error' && (
        <p style={{ fontSize: 13, color: '#f87171', marginBottom: 12 }}>Hiba történt. Kérjük, próbálja újra.</p>
      )}
      <button
        onClick={handleSubmit}
        disabled={state === 'loading'}
        style={{ width: '100%', background: state === 'loading' ? 'rgba(0,255,239,0.5)' : '#00FFEF', color: '#000', fontSize: 15, fontWeight: 700, padding: '13px 24px', borderRadius: 50, border: 'none', cursor: state === 'loading' ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {state === 'loading' ? 'Küldés...' : '→ Ajánlatot kérek'}
      </button>
      <p style={{ fontSize: 12, color: '#8899aa', textAlign: 'center', marginTop: 12 }}>Adatait bizalmasan kezeljük.</p>
    </div>
  );
}
