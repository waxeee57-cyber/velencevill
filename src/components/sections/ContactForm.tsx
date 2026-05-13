'use client';
import { useState } from 'react';

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function ContactForm() {
  const [state, setState] = useState<FormState>('idle');
  const [form, setForm] = useState({ nev: '', telefon: '', email: '', tema: '', uzenet: '' });

  const handleSubmit = async () => {
    if (!form.nev || !form.telefon) return alert('Név és telefonszám kötelező.');
    setState('loading');
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

  if (state === 'success') {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">Köszönjük megkeresését!</h3>
        <p className="text-sm text-slate-500">1 munkanapon belül felvesszük Önnel a kapcsolatot.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex flex-col gap-1">
          <label className="text-[13px] text-slate-500">Neve *</label>
          <input className="text-[14px] px-3 py-2.5 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-blue-400" placeholder="Kovács János" value={form.nev} onChange={e => setForm(p => ({ ...p, nev: e.target.value }))} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[13px] text-slate-500">Telefon *</label>
          <input className="text-[14px] px-3 py-2.5 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-blue-400" placeholder="+36 30 ..." value={form.telefon} onChange={e => setForm(p => ({ ...p, telefon: e.target.value }))} />
        </div>
      </div>
      <div className="flex flex-col gap-1 mb-3">
        <label className="text-[13px] text-slate-500">E-mail cím</label>
        <input className="text-[14px] px-3 py-2.5 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-blue-400" placeholder="pelda@email.hu" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
      </div>
      <div className="flex flex-col gap-1 mb-3">
        <label className="text-[13px] text-slate-500">Mire van szüksége?</label>
        <select className="text-[14px] px-3 py-2.5 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-blue-400" value={form.tema} onChange={e => setForm(p => ({ ...p, tema: e.target.value }))}>
          <option value="">Válasszon témát...</option>
          <option>Kábel / vezeték</option>
          <option>Kapcsoló / dugalj</option>
          <option>Elosztó / szekrény</option>
          <option>Világítástechnika</option>
          <option>Villanyszerelő ajánlás</option>
          <option>Egyéb</option>
        </select>
      </div>
      <div className="flex flex-col gap-1 mb-4">
        <label className="text-[13px] text-slate-500">Üzenet (opcionális)</label>
        <textarea className="text-[14px] px-3 py-2.5 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-blue-400 resize-y min-h-[88px]" placeholder="Pl. mire keresnek megoldást..." value={form.uzenet} onChange={e => setForm(p => ({ ...p, uzenet: e.target.value }))} />
      </div>
      {state === 'error' && <p className="text-red-500 text-[13px] mb-3">Hiba történt. Kérjük, próbálja újra.</p>}
      <button onClick={handleSubmit} disabled={state === 'loading'} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium text-[15px] py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
        {state === 'loading' ? 'Küldés...' : '→ Ajánlatot kérek'}
      </button>
      <p className="text-[12px] text-slate-400 text-center mt-3">Adatait bizalmasan kezeljük.</p>
    </div>
  );
}
