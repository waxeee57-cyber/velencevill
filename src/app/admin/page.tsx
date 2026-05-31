'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Toast from '@/components/ui/Toast';

interface ChatMessage { id: string; sender: 'user' | 'admin'; content: string; created_at: string }
interface ChatSession {
  id: string;
  nev: string | null;
  telefon: string | null;
  status: string;
  created_at: string;
  last_message_at: string;
  chat_messages: ChatMessage[];
}

interface AnalyticsData {
  total: number;
  uniqueSessions: number;
  topEvent: string | null;
  passivePercent: number;
  days: { label: string; count: number }[];
  eventStats: { name: string; count: number }[];
  referrers: { source: string; count: number }[];
  recentPassive: { sessionId: string; lastSeen: number; pathname: string }[];
  surveyResults: { found?: string; missing?: string; timestamp: number }[];
}

type Tab = 'chatok' | 'analitika' | 'leadek' | 'kerdoiv' | 'vip';

// ── Login ──────────────────────────────────────────────────────────────────────
function LoginForm({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true); setError('');
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    });
    if (res.ok) {
      const { token } = await res.json();
      localStorage.setItem('velencevill_admin_token', token);
      onAuth();
    } else {
      setError('Hibás jelszó');
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#060d18', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-card" style={{ padding: '2rem', width: 320 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00FFEF" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>Admin belépés</span>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, color: '#8899aa', display: 'block', marginBottom: 4 }}>Jelszó</label>
          <input
            type="password" value={pw} onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            style={{ width: '100%', boxSizing: 'border-box', background: '#060d18', border: '1px solid rgba(0,255,239,0.2)', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14, outline: 'none' }}
          />
        </div>
        {error && <p style={{ fontSize: 13, color: '#f87171', marginBottom: 10 }}>{error}</p>}
        <button onClick={submit} disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '11px 20px' }}>
          {loading ? 'Belépés...' : 'Belépés'}
        </button>
      </div>
    </div>
  );
}

// ── Chatok tab ─────────────────────────────────────────────────────────────────
function ChatTab() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [sending, setSending] = useState(false);

  const fetchThreads = useCallback(async () => {
    const token = localStorage.getItem('velencevill_admin_token') ?? '';
    try {
      const res = await fetch('/api/chat/threads', { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) { setError('A munkamenet lejárt — jelentkezz be újra.'); return; }
      if (res.status === 503) { const j = await res.json(); setError(j.error ?? 'Supabase szerver kulcs nincs beállítva.'); return; }
      if (!res.ok) { setError('Nem sikerült betölteni a beszélgetéseket.'); return; }
      const { threads } = await res.json();
      setError(null);
      setSessions(threads as ChatSession[]);
    } catch {
      setError('Hálózati hiba a beszélgetések betöltésekor.');
    } finally {
      setLoaded(true);
    }
  }, []);

  // Kezdeti betöltés + polling (5 mp) az új user-üzenetekért / válaszokért
  useEffect(() => {
    fetchThreads();
    const t = setInterval(fetchThreads, 5000);
    return () => clearInterval(t);
  }, [fetchThreads]);

  const active = sessions.find(s => s.id === activeId) ?? null;

  const sendReply = async () => {
    const content = reply.trim();
    if (!content || !active || sending) return;
    setSending(true);
    const token = localStorage.getItem('velencevill_admin_token') ?? '';
    try {
      const res = await fetch('/api/chat/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ chatId: active.id, content }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error ?? 'A válasz küldése nem sikerült.');
        return;
      }
      const { message } = await res.json();
      setReply('');
      setError(null);
      // Optimista frissítés + háttér-szinkron
      setSessions(prev => prev.map(s => s.id === active.id
        ? { ...s, chat_messages: [...s.chat_messages, message as ChatMessage], last_message_at: (message as ChatMessage).created_at }
        : s));
      fetchThreads();
    } catch {
      setError('Hálózati hiba a válasz küldésekor.');
    } finally {
      setSending(false);
    }
  };

  const fmt = (iso: string) => new Date(iso).toLocaleString('hu-HU', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (error) return <p style={{ color: '#f87171', fontSize: 14 }}>{error}</p>;
  if (!loaded) return <p style={{ color: '#8899aa', fontSize: 14 }}>Beszélgetések betöltése...</p>;
  if (sessions.length === 0) return <p style={{ color: '#8899aa', fontSize: 14 }}>Még nincs chat üzenet.</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: active ? '280px 1fr' : '1fr', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sessions.map(s => {
          const last = s.chat_messages.at(-1);
          const needsReply = last?.sender === 'user';
          return (
            <div key={s.id} onClick={() => setActiveId(s.id)} className="glass-card"
              style={{ padding: '12px 14px', cursor: 'pointer', borderColor: activeId === s.id ? 'rgba(0,255,239,0.5)' : 'rgba(0,255,239,0.15)', transition: 'border-color 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{s.nev ?? 'Névtelen'}</span>
                {needsReply && <span style={{ fontSize: 10, background: '#00FFEF', color: '#000', fontWeight: 700, padding: '1px 6px', borderRadius: 20 }}>ÚJ</span>}
              </div>
              <div style={{ fontSize: 12, color: '#8899aa' }}>{s.telefon ?? '—'}</div>
              <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>{last ? `${last.content.slice(0, 50)}${last.content.length > 50 ? '…' : ''}` : 'Nincs üzenet'}</div>
            </div>
          );
        })}
      </div>

      {active && (
        <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 400 }}>
          <div style={{ borderBottom: '0.5px solid rgba(0,255,239,0.1)', paddingBottom: 10 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: 0 }}>{active.nev ?? 'Névtelen'} · <span style={{ color: '#00FFEF' }}>{active.telefon ?? '—'}</span></p>
            <p style={{ fontSize: 11, color: '#8899aa', margin: 0 }}>{fmt(active.created_at)}</p>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300 }}>
            {active.chat_messages.map((m) => (
              <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: m.sender === 'user' ? 'flex-start' : 'flex-end' }}>
                <div style={{ maxWidth: '80%', padding: '7px 12px', borderRadius: 10, background: m.sender === 'user' ? 'rgba(13,31,60,0.9)' : 'rgba(0,255,239,0.12)', fontSize: 13, color: '#fff' }}>
                  {m.content}
                </div>
                <span style={{ fontSize: 10, color: '#8899aa', marginTop: 2 }}>{fmt(m.created_at)}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendReply()}
              placeholder="Válasz..." disabled={sending}
              style={{ flex: 1, background: '#060d18', border: '1px solid rgba(0,255,239,0.2)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 13, outline: 'none' }} />
            <button onClick={sendReply} disabled={sending} className="btn-primary" style={{ padding: '9px 16px', fontSize: 13, opacity: sending ? 0.6 : 1 }}>Küld</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Analytics tab ──────────────────────────────────────────────────────────────
function AnalyticsTab() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetch('/api/analytics').then(r => r.json()).then(setData).catch(() => {});
  }, []);

  if (!data) return <p style={{ color: '#8899aa', fontSize: 14 }}>Betöltés...</p>;

  const maxDay = Math.max(...data.days.map(d => d.count), 1);
  const maxRef = Math.max(...data.referrers.map(r => r.count), 1);

  return (
    <div>
      {/* 4 metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Oldalmegtekintés', value: data.total },
          { label: 'Egyedi látogatók', value: data.uniqueSessions },
          { label: 'Passzív látogatók', value: `${data.passivePercent}%` },
          { label: 'Top esemény', value: data.topEvent ?? '—' },
        ].map(card => (
          <div key={card.label} className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#00FFEF', marginBottom: 4 }}>{card.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* 14-day chart */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: 16 }}>
        <p style={{ fontSize: 12, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Utolsó 14 nap</p>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 110 }}>
          {data.days.map(d => (
            <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <span style={{ fontSize: 9, color: '#8899aa' }}>{d.count || ''}</span>
              <div style={{ width: '100%', background: 'rgba(0,255,239,0.2)', borderRadius: '3px 3px 0 0', height: `${Math.max((d.count / maxDay) * 76, 2)}px`, border: '1px solid rgba(0,255,239,0.3)' }} />
              <span style={{ fontSize: 8, color: '#475569', textAlign: 'center', writingMode: 'vertical-rl', transform: 'rotate(180deg)', height: 30 }}>{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 16 }}>
        {/* Event breakdown */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: 12, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Esemény bontás</p>
          {data.eventStats.length === 0 ? (
            <p style={{ fontSize: 13, color: '#475569' }}>Még nincs esemény.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {data.eventStats.slice(0, 8).map(ev => (
                <div key={ev.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: '0.5px solid rgba(0,255,239,0.06)' }}>
                  <span style={{ fontSize: 13, color: '#8899aa' }}>{ev.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#00FFEF' }}>{ev.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Referrers */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: 12, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Forgalomforrások</p>
          {data.referrers.length === 0 ? (
            <p style={{ fontSize: 13, color: '#475569' }}>Még nincs adat.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.referrers.slice(0, 6).map(r => (
                <div key={r.source}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 12, color: '#8899aa' }}>{r.source}</span>
                    <span style={{ fontSize: 12, color: '#fff' }}>{r.count}</span>
                  </div>
                  <div style={{ height: 3, background: 'rgba(0,255,239,0.1)', borderRadius: 2 }}>
                    <div style={{ width: `${(r.count / maxRef) * 100}%`, height: '100%', background: '#00FFEF', borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Passive visitors */}
      {data.recentPassive.length > 0 && (
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: 12, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Passzív látogatók (legutóbbi)</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {data.recentPassive.slice(0, 5).map(p => (
              <div key={p.sessionId} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '0.5px solid rgba(0,255,239,0.06)', gap: 8 }}>
                <span style={{ fontSize: 12, color: '#8899aa', fontFamily: 'monospace', flexShrink: 0 }}>{p.sessionId.slice(0, 12)}…</span>
                <span style={{ fontSize: 12, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.pathname}</span>
                <span style={{ fontSize: 11, color: '#475569', flexShrink: 0 }}>{new Date(p.lastSeen).toLocaleDateString('hu-HU')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Kérdőív tab ────────────────────────────────────────────────────────────────
function KerdoivTab() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetch('/api/analytics').then(r => r.json()).then(setData).catch(() => {});
  }, []);

  if (!data) return <p style={{ color: '#8899aa', fontSize: 14 }}>Betöltés...</p>;

  const results = data.surveyResults ?? [];

  if (results.length === 0) {
    return <p style={{ color: '#8899aa', fontSize: 14 }}>Még nincs kitöltött kérdőív.</p>;
  }

  const tally = (key: 'found' | 'missing') =>
    results.reduce((acc, r) => {
      const val = r[key];
      if (val) acc[val] = (acc[val] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const foundCounts = tally('found');
  const missingCounts = tally('missing');

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: 12, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Megtalálta amit keresett?</p>
          {Object.entries(foundCounts).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '0.5px solid rgba(0,255,239,0.06)' }}>
              <span style={{ fontSize: 13, color: '#8899aa' }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#00FFEF' }}>{v}</span>
            </div>
          ))}
        </div>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: 12, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Mi hiányzott?</p>
          {Object.entries(missingCounts).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '0.5px solid rgba(0,255,239,0.06)' }}>
              <span style={{ fontSize: 13, color: '#8899aa' }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#00FFEF' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <p style={{ fontSize: 12, color: '#475569', marginTop: 12 }}>Összes kitöltés: {results.length}</p>
    </div>
  );
}

// ── Leads tab ──────────────────────────────────────────────────────────────────
function LeadsTab() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl === 'your_supabase_url') {
    return <p style={{ fontSize: 14, color: '#8899aa' }}>Supabase nincs konfigurálva. Állítsa be a <code style={{ color: '#00FFEF' }}>NEXT_PUBLIC_SUPABASE_URL</code> és <code style={{ color: '#00FFEF' }}>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> változókat.</p>;
  }
  return <p style={{ fontSize: 14, color: '#8899aa' }}>Leadek betöltése...</p>;
}

// ── VIP Offers tab ─────────────────────────────────────────────────────────────
interface VipOffer {
  id: string;
  title: string;
  description?: string;
  file_url?: string;
  valid_until?: string;
  active: boolean;
  created_at: string;
}

function VipOffersTab() {
  const [offers, setOffers] = useState<VipOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const sbRef = useRef<SupabaseClient | null>(null);

  const [form, setForm] = useState({ title: '', description: '', valid_until: '' });

  function getSb(): SupabaseClient {
    if (!sbRef.current) {
      sbRef.current = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
    }
    return sbRef.current;
  }

  useEffect(() => { fetchOffers(); }, []);

  async function fetchOffers() {
    setLoading(true);
    const { data } = await getSb()
      .from('vip_offers')
      .select('*')
      .order('created_at', { ascending: false });
    setOffers((data as VipOffer[]) || []);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { setToast({ message: 'Cím kötelező', type: 'error' }); return; }
    setSubmitting(true);
    try {
      let file_url: string | null = null;
      const file = fileRef.current?.files?.[0];
      if (file) {
        const ext = file.name.split('.').pop();
        const fileName = `vip-offers/${Date.now()}.${ext}`;
        const { error: uploadError } = await getSb().storage
          .from('vip-files')
          .upload(fileName, file, { cacheControl: '3600', upsert: false });
        if (uploadError) throw uploadError;
        const { data: urlData } = getSb().storage.from('vip-files').getPublicUrl(fileName);
        file_url = urlData.publicUrl;
      }
      const { error } = await getSb().from('vip_offers').insert({
        title: form.title.trim(),
        description: form.description.trim() || null,
        valid_until: form.valid_until || null,
        file_url,
        active: true,
      });
      if (error) throw error;
      setToast({ message: 'Ajánlat sikeresen feltöltve!', type: 'success' });
      setForm({ title: '', description: '', valid_until: '' });
      if (fileRef.current) fileRef.current.value = '';
      fetchOffers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ismeretlen hiba';
      setToast({ message: `Hiba: ${msg}`, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(id: string, current: boolean) {
    await getSb().from('vip_offers').update({ active: !current }).eq('id', id);
    fetchOffers();
  }

  async function deleteOffer(id: string) {
    await getSb().from('vip_offers').delete().eq('id', id);
    fetchOffers();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Új ajánlat feltöltés */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: '#00FFEF', marginBottom: 20 }}>Új VIP ajánlat feltöltése</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label htmlFor="vip-title" style={{ display: 'block', fontSize: 12, color: '#8899aa', marginBottom: 4 }}>Cím *</label>
            <input
              id="vip-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="pl. Schneider kapcsolók -20% — csak VIP partnereknek"
              disabled={submitting}
              style={{ width: '100%', boxSizing: 'border-box', background: '#060d18', border: '1px solid rgba(0,255,239,0.2)', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14, outline: 'none' }}
            />
          </div>
          <div>
            <label htmlFor="vip-desc" style={{ display: 'block', fontSize: 12, color: '#8899aa', marginBottom: 4 }}>Leírás</label>
            <textarea
              id="vip-desc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Részletek, feltételek, megjegyzés..."
              disabled={submitting}
              style={{ width: '100%', boxSizing: 'border-box', background: '#060d18', border: '1px solid rgba(0,255,239,0.2)', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14, outline: 'none', resize: 'none' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label htmlFor="vip-date" style={{ display: 'block', fontSize: 12, color: '#8899aa', marginBottom: 4 }}>Érvényes (opcionális)</label>
              <input
                id="vip-date"
                type="date"
                value={form.valid_until}
                onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
                disabled={submitting}
                style={{ width: '100%', boxSizing: 'border-box', background: '#060d18', border: '1px solid rgba(0,255,239,0.2)', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14, outline: 'none' }}
              />
            </div>
            <div>
              <label htmlFor="vip-file" style={{ display: 'block', fontSize: 12, color: '#8899aa', marginBottom: 4 }}>Fájl (PDF, kép — opcionális)</label>
              <input
                id="vip-file"
                type="file"
                ref={fileRef}
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                disabled={submitting}
                style={{ width: '100%', boxSizing: 'border-box', background: '#060d18', border: '1px solid rgba(0,255,239,0.2)', borderRadius: 8, padding: '8px 10px', color: '#8899aa', fontSize: 13, outline: 'none', cursor: 'pointer' }}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{ justifyContent: 'center', padding: '12px 20px', opacity: submitting ? 0.5 : 1 }}
          >
            {submitting ? 'Feltöltés...' : 'Ajánlat közzététele'}
          </button>
        </form>
      </div>

      {/* Meglévő ajánlatok */}
      <div>
        <p style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Ajánlatok</p>
        {loading ? (
          <p style={{ color: '#8899aa', fontSize: 14 }}>Betöltés...</p>
        ) : offers.length === 0 ? (
          <p style={{ color: '#8899aa', fontSize: 14 }}>Még nincs feltöltve ajánlat.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="glass-card"
                style={{ padding: '1rem', opacity: offer.active ? 1 : 0.5, borderColor: offer.active ? 'rgba(0,255,239,0.2)' : 'rgba(100,100,100,0.2)' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{offer.title}</span>
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: offer.active ? 'rgba(34,197,94,0.15)' : 'rgba(100,100,100,0.15)', color: offer.active ? '#22c55e' : '#8899aa' }}>
                        {offer.active ? 'Aktív' : 'Inaktív'}
                      </span>
                    </div>
                    {offer.description && (
                      <p style={{ fontSize: 12, color: '#8899aa', marginBottom: 4 }}>{offer.description}</p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: '#475569' }}>
                      <span>{new Date(offer.created_at).toLocaleDateString('hu-HU')}</span>
                      {offer.valid_until && (
                        <span>Érvényes: {new Date(offer.valid_until).toLocaleDateString('hu-HU')}</span>
                      )}
                      {offer.file_url && (
                        <a href={offer.file_url} target="_blank" rel="noopener noreferrer" style={{ color: '#00FFEF', opacity: 0.7 }}>
                          Fájl megtekintése
                        </a>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button
                      onClick={() => toggleActive(offer.id, offer.active)}
                      style={{ fontSize: 12, padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(0,255,239,0.2)', background: 'transparent', color: '#8899aa', cursor: 'pointer' }}
                    >
                      {offer.active ? 'Elrejt' : 'Aktivál'}
                    </button>
                    <button
                      onClick={() => deleteOffer(offer.id)}
                      style={{ fontSize: 12, padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.3)', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}
                    >
                      Töröl
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}

// ── Main admin page ────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>('chatok');
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('velencevill_admin_token');
    if (token) setAuthed(true);
    setChecked(true);
  }, []);

  if (!checked) return null;
  if (!authed) return <LoginForm onAuth={() => setAuthed(true)} />;

  const TABS: { id: Tab; label: string }[] = [
    { id: 'chatok',    label: '💬 Chatok' },
    { id: 'analitika', label: '📊 Analitika' },
    { id: 'leadek',    label: '📋 Leadek' },
    { id: 'kerdoiv',   label: '📝 Kérdőív' },
    { id: 'vip',       label: '⭐ VIP Ajánlatok' },
  ];

  return (
    <div style={{ background: '#060d18', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00FFEF" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Velence Vill Admin</span>
          </div>
          <button onClick={() => { localStorage.removeItem('velencevill_admin_token'); setAuthed(false); }}
            style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#8899aa', fontSize: 13, padding: '6px 14px', borderRadius: 8, cursor: 'pointer' }}>
            Kilépés
          </button>
        </div>

        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(13,31,60,0.5)', padding: 4, borderRadius: 10, width: 'fit-content' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', background: tab === t.id ? 'rgba(0,255,239,0.1)' : 'transparent', color: tab === t.id ? '#00FFEF' : '#8899aa', border: tab === t.id ? '1px solid rgba(0,255,239,0.25)' : '1px solid transparent', transition: 'all 0.2s' }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'chatok'    && <ChatTab />}
        {tab === 'analitika' && <AnalyticsTab />}
        {tab === 'leadek'    && <LeadsTab />}
        {tab === 'kerdoiv'   && <KerdoivTab />}
        {tab === 'vip'       && <VipOffersTab />}
      </div>
    </div>
  );
}
