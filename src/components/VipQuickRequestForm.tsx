'use client';
import { useRef, useState } from 'react';
import Toast from '@/components/ui/Toast';
import { trackEvent } from '@/utils/analytics';

export default function VipQuickRequestForm() {
  const [form, setForm] = useState({ nev: '', telefon: '', uzenet: '' });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [sent, setSent] = useState(false);
  const kepRef = useRef<HTMLInputElement>(null);
  const hangRef = useRef<HTMLInputElement>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nev.trim() || !form.telefon.trim()) {
      setToast({ message: 'Név és telefonszám megadása kötelező.', type: 'error' });
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('nev', form.nev.trim());
      fd.append('telefon', form.telefon.trim());
      fd.append('uzenet', form.uzenet.trim());
      const kep = kepRef.current?.files?.[0];
      const hang = hangRef.current?.files?.[0];
      if (kep) fd.append('kep', kep);
      if (hang) fd.append('hang', hang);

      const res = await fetch('/api/vip/quick-request', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Küldés sikertelen.');

      trackEvent('vip_quick_request_submit', { hasPhoto: !!kep, hasAudio: !!hang });
      setSent(true);
      setForm({ nev: '', telefon: '', uzenet: '' });
      if (kepRef.current) kepRef.current.value = '';
      if (hangRef.current) hangRef.current.value = '';
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ismeretlen hiba';
      setToast({ message: msg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="p-6 rounded-xl bg-[#0d1f3c] border border-[#00FFEF]/30 text-center">
        <p className="text-2xl mb-2">✅</p>
        <p className="text-white font-semibold mb-1">Megkaptuk!</p>
        <p className="text-sm text-gray-400 mb-4">Mike Patrik hamarosan visszahívja az összeállított anyaggal.</p>
        <button type="button" onClick={() => setSent(false)} className="text-sm text-[#00FFEF] underline">
          Új gyorskérés küldése
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-[#0d1f3c] border border-[#00FFEF]/20">
      <p className="text-gray-300 font-semibold mb-1">Gyors anyaglista küldés</p>
      <p className="text-sm text-gray-500 mb-5">
        Fényképezze le a kézzel írt listáját, vagy küldjön hangüzenetet — éjszaka, hajnalban is.
        Reggel nyitáskor ez lesz az első a pulton.
      </p>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="vipq-nev" className="block text-xs text-gray-500 mb-1">Név *</label>
            <input
              id="vipq-nev" type="text" value={form.nev} disabled={submitting}
              onChange={e => setForm({ ...form, nev: e.target.value })}
              className="w-full bg-[#060d18] border border-[#00FFEF]/20 rounded-lg px-3 py-2.5 text-white text-sm outline-none"
            />
          </div>
          <div>
            <label htmlFor="vipq-tel" className="block text-xs text-gray-500 mb-1">Telefonszám *</label>
            <input
              id="vipq-tel" type="tel" value={form.telefon} disabled={submitting}
              onChange={e => setForm({ ...form, telefon: e.target.value })}
              className="w-full bg-[#060d18] border border-[#00FFEF]/20 rounded-lg px-3 py-2.5 text-white text-sm outline-none"
            />
          </div>
        </div>
        <div>
          <label htmlFor="vipq-uzenet" className="block text-xs text-gray-500 mb-1">Üzenet (opcionális)</label>
          <textarea
            id="vipq-uzenet" rows={3} value={form.uzenet} disabled={submitting}
            onChange={e => setForm({ ...form, uzenet: e.target.value })}
            placeholder="pl. mikorra kellene, vagy bármi kiegészítés a fotóhoz"
            className="w-full bg-[#060d18] border border-[#00FFEF]/20 rounded-lg px-3 py-2.5 text-white text-sm outline-none resize-none"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="vipq-kep" className="block text-xs text-gray-500 mb-1">Fotó a listáról (opcionális)</label>
            <input
              id="vipq-kep" type="file" ref={kepRef} accept="image/*" capture="environment" disabled={submitting}
              className="w-full bg-[#060d18] border border-[#00FFEF]/20 rounded-lg px-2.5 py-2 text-gray-400 text-xs outline-none cursor-pointer"
            />
          </div>
          <div>
            <label htmlFor="vipq-hang" className="block text-xs text-gray-500 mb-1">Hangüzenet (opcionális)</label>
            <input
              id="vipq-hang" type="file" ref={hangRef} accept="audio/*" disabled={submitting}
              className="w-full bg-[#060d18] border border-[#00FFEF]/20 rounded-lg px-2.5 py-2 text-gray-400 text-xs outline-none cursor-pointer"
            />
          </div>
        </div>
        <button
          type="submit" disabled={submitting}
          className="bg-[#00FFEF] text-[#060d18] font-bold rounded-full py-3 mt-1 disabled:opacity-50"
        >
          {submitting ? 'Küldés...' : 'Elküldöm a boltnak'}
        </button>
      </form>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
