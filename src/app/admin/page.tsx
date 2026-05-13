'use client';
import { useState, useEffect } from 'react';

interface ChatMessage { role: 'user' | 'admin'; text: string; timestamp: number }
interface ChatSession { id: string; nev: string; telefon: string; messages: ChatMessage[]; createdAt: number; read: boolean }

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

type Tab = 'chatok' | 'analitika' | 'leadek' | 'kerdoiv';

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
  const [active, setActive] = useState<ChatSession | null>(null);
  const [reply, setReply] = useState('');

  useEffect(() => {
    const ids: string[] = JSON.parse(localStorage.getItem('velencevill_chat_sessions') ?? '[]');
    const loaded = ids.map(id => {
      try { return JSON.parse(localStorage.getItem(`velencevill_chat_${id}`) ?? '') as ChatSession; }
      catch { return null; }
    }).filter(Boolean) as ChatSession[];
    setSessions(loaded.sort((a, b) => b.createdAt - a.createdAt));
  }, []);

  const sendReply = () => {
    if (!reply.trim() || !active) return;
    const msg: ChatMessage = { role: 'admin', text: reply.trim(), timestamp: Date.now() };
    const updated = { ...active, messages: [...active.messages, msg], read: true };
    localStorage.setItem(`velencevill_chat_${active.id}`, JSON.stringify(updated));
    setActive(updated);
    setSessions(prev => prev.map(s => s.id === updated.id ? updated : s));
    setReply('');
  };

  const fmt = (ts: number) => new Date(ts).toLocaleString('hu-HU', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (sessions.length === 0) return <p style={{ color: '#8899aa', fontSize: 14 }}>Még nincs chat üzenet.</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: active ? '280px 1fr' : '1fr', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sessions.map(s => (
          <div key={s.id} onClick={() => setActive(s)} className="glass-card"
            style={{ padding: '12px 14px', cursor: 'pointer', borderColor: active?.id === s.id ? 'rgba(0,255,239,0.5)' : 'rgba(0,255,239,0.15)', transition: 'border-color 0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{s.nev}</span>
              {!s.read && <span style={{ fontSize: 10, background: '#00FFEF', color: '#000', fontWeight: 700, padding: '1px 6px', borderRadius: 20 }}>ÚJ</span>}
            </div>
            <div style={{ fontSize: 12, color: '#8899aa' }}>{s.telefon}</div>
            <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>{s.messages.at(-1)?.text.slice(0, 50)}...</div>
          </div>
        ))}
      </div>

      {active && (
        <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 400 }}>
          <div style={{ borderBottom: '0.5px solid rgba(0,255,239,0.1)', paddingBottom: 10 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: 0 }}>{active.nev} · <span style={{ color: '#00FFEF' }}>{active.telefon}</span></p>
            <p style={{ fontSize: 11, color: '#8899aa', margin: 0 }}>{fmt(active.createdAt)}</p>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300 }}>
            {active.messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-start' : 'flex-end' }}>
                <div style={{ maxWidth: '80%', padding: '7px 12px', borderRadius: 10, background: m.role === 'user' ? 'rgba(13,31,60,0.9)' : 'rgba(0,255,239,0.12)', fontSize: 13, color: '#fff' }}>
                  {m.text}
                </div>
                <span style={{ fontSize: 10, color: '#8899aa', marginTop: 2 }}>{fmt(m.timestamp)}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendReply()}
              placeholder="Válasz..."
              style={{ flex: 1, background: '#060d18', border: '1px solid rgba(0,255,239,0.2)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 13, outline: 'none' }} />
            <button onClick={sendReply} className="btn-primary" style={{ padding: '9px 16px', fontSize: 13 }}>Küld</button>
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
      </div>
    </div>
  );
}
