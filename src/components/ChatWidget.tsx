'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { getSupabaseBrowser } from '@/lib/supabaseBrowser';
import { trackEvent } from '@/utils/analytics';

interface Message {
  id: string;
  chat_id: string;
  sender: 'user' | 'admin';
  content: string;
  created_at: string;
}

type Step = 'closed' | 'choice' | 'form' | 'chat';

const GREETING =
  'Köszönjük! Üzenetét megkaptuk, hamarosan visszajelzünk. Nyitvatartás: H-P 8-16h, Szo 8-12h';

const LS_ID = 'velencevill_chat_id';
const LS_NEV = 'velencevill_chat_nev';
const LS_TEL = 'velencevill_chat_telefon';

export default function ChatWidget() {
  const [step, setStep] = useState<Step>('closed');
  const [session, setSession] = useState<{ id: string; nev: string; telefon: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [form, setForm] = useState({ nev: '', telefon: '' });
  const [input, setInput] = useState('');
  const [pulse, setPulse] = useState(true);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, step]);

  const loadMessages = useCallback(async (chatId: string) => {
    const sb = getSupabaseBrowser();
    if (!sb) return;
    const { data } = await sb
      .from('chat_messages')
      .select('id, chat_id, sender, content, created_at')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });
    if (data) setMessages(data as Message[]);
  }, []);

  // Visszatérő látogató: korábbi chat betöltése localStorage-ból
  useEffect(() => {
    const id = localStorage.getItem(LS_ID);
    const nev = localStorage.getItem(LS_NEV);
    const telefon = localStorage.getItem(LS_TEL);
    if (id && nev && telefon) {
      setSession({ id, nev, telefon });
      loadMessages(id);
    }
  }, [loadMessages]);

  // ── Realtime feliratkozás az admin (és saját) üzenetekre ──────────────────
  useEffect(() => {
    if (!session?.id) return;
    const sb = getSupabaseBrowser();
    if (!sb) return;

    const channel: RealtimeChannel = sb
      .channel(`chat_messages:${session.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${session.id}`,
        },
        (payload) => {
          const m = payload.new as Message;
          setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
        },
      )
      .subscribe();

    return () => {
      sb.removeChannel(channel);
    };
  }, [session?.id]);

  const openWidget = () => {
    setPulse(false);
    setStep(session ? 'chat' : 'choice');
    trackEvent('chat_open');
  };

  const startChat = async () => {
    if (!form.nev || !form.telefon) return;
    const sb = getSupabaseBrowser();
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    if (sb) {
      // A kliens generálja az id-t, így nincs szükség RETURNING-re (chats nem anon-olvasható).
      await sb.from('chats').insert({ id, nev: form.nev, telefon: form.telefon, status: 'open' });
    }

    localStorage.setItem(LS_ID, id);
    localStorage.setItem(LS_NEV, form.nev);
    localStorage.setItem(LS_TEL, form.telefon);
    setSession({ id, nev: form.nev, telefon: form.telefon });
    setMessages([]);
    setStep('chat');
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || !session) return;
    setInput('');
    trackEvent('chat_message');

    const sb = getSupabaseBrowser();
    if (sb) {
      const { data } = await sb
        .from('chat_messages')
        .insert({ chat_id: session.id, sender: 'user', content: text })
        .select()
        .single();
      if (data) {
        const m = data as Message;
        setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
      }
      // last_message_at frissítés (best-effort; anon update tiltott -> elnyeljük)
      sb.from('chats').update({ last_message_at: new Date().toISOString() }).eq('id', session.id).then(() => {});
    }

    // Email értesítés a csapatnak (változatlan)
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nev: session.nev, telefon: session.telefon, message: text, sessionId: session.id }),
      });
    } catch {
      /* graceful skip */
    }
  };

  const close = () => setStep('closed');

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={step === 'closed' ? openWidget : close}
        className="chat-btn-wrap"
        aria-label={step !== 'closed' ? 'Chat bezárása' : 'Chat megnyitása – Írjon nekünk'}
        aria-expanded={step !== 'closed'}
        style={{ width: 56, height: 56, borderRadius: '50%', background: '#00FFEF', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 20px rgba(0,255,239,${pulse ? '0.6' : '0.3'})`, transition: 'all 0.3s ease', animation: pulse ? 'pulse-dot 2s infinite' : 'none' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
        {step !== 'closed' ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        )}
      </button>

      {/* Panel */}
      {step !== 'closed' && (
        <div className="chat-panel-wrap" style={{ width: 320, background: 'rgba(6,13,24,0.97)', border: '1px solid rgba(0,255,239,0.15)', borderRadius: 16, backdropFilter: 'blur(20px)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ background: 'rgba(0,255,239,0.06)', borderBottom: '1px solid rgba(0,255,239,0.1)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,255,239,0.1)', border: '1.5px solid rgba(0,255,239,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00FFEF" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Velence Vill Kft.</div>
              <div style={{ fontSize: 11, color: '#00FFEF', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00FFEF', display: 'inline-block', animation: 'pulse-dot 2s infinite' }} />
                Általában 1 munkanapon belül válaszolunk
              </div>
            </div>
          </div>

          <div style={{ padding: '16px' }}>
            {/* Step 1: Choice */}
            {step === 'choice' && (
              <div>
                <p style={{ fontSize: 14, color: '#8899aa', marginBottom: 14 }}>Hogyan lépjen velünk kapcsolatba?</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { icon: '💬', label: 'Chat', action: () => setStep('form') },
                    { icon: '📞', label: 'Visszahívást kérek', action: () => { close(); document.getElementById('ajanlat')?.scrollIntoView({ behavior: 'smooth' }); } },
                    { icon: '✉️', label: 'Személyes üzenet', action: () => setStep('form') },
                  ].map(opt => (
                    <button key={opt.label} onClick={opt.action}
                      style={{ background: 'rgba(13,31,60,0.8)', border: '1px solid rgba(0,255,239,0.15)', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.2s, background 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,255,239,0.4)'; e.currentTarget.style.background = 'rgba(13,31,60,1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,255,239,0.15)'; e.currentTarget.style.background = 'rgba(13,31,60,0.8)'; }}>
                      {opt.icon} {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Form */}
            {step === 'form' && (
              <div>
                <p style={{ fontSize: 14, color: '#8899aa', marginBottom: 14 }}>Kérjük, adja meg adatait:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                  <input value={form.nev} onChange={e => setForm(p => ({ ...p, nev: e.target.value }))}
                    placeholder="Neve *"
                    style={{ background: '#060d18', border: '1px solid rgba(0,255,239,0.2)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 14, outline: 'none' }} />
                  <input value={form.telefon} onChange={e => setForm(p => ({ ...p, telefon: e.target.value }))}
                    placeholder="Telefonszám *"
                    style={{ background: '#060d18', border: '1px solid rgba(0,255,239,0.2)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 14, outline: 'none' }}
                    onKeyDown={e => e.key === 'Enter' && startChat()} />
                </div>
                <button onClick={startChat} disabled={!form.nev || !form.telefon} className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '11px 20px', fontSize: 14, opacity: (!form.nev || !form.telefon) ? 0.5 : 1 }}>
                  Tovább →
                </button>
              </div>
            )}

            {/* Step 3: Chat */}
            {step === 'chat' && session && (
              <div>
                <div ref={messagesRef} style={{ maxHeight: 220, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                  {/* Üdvözlő üzenet (statikus, nem DB-ből) */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ maxWidth: '80%', padding: '8px 12px', borderRadius: '12px 12px 12px 2px', background: 'rgba(13,31,60,0.9)', border: '1px solid rgba(0,255,239,0.1)', fontSize: 13, color: '#fff', lineHeight: 1.5 }}>
                      {GREETING}
                    </div>
                  </div>
                  {messages.map((msg) => (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                      <div style={{ maxWidth: '80%', padding: '8px 12px', borderRadius: msg.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px', background: msg.sender === 'user' ? 'rgba(0,255,239,0.15)' : 'rgba(13,31,60,0.9)', border: `1px solid ${msg.sender === 'user' ? 'rgba(0,255,239,0.3)' : 'rgba(0,255,239,0.1)'}`, fontSize: 13, color: '#fff', lineHeight: 1.5 }}>
                        {msg.content}
                      </div>
                      <span style={{ fontSize: 10, color: '#8899aa', marginTop: 2 }}>{formatTime(msg.created_at)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Üzenet..."
                    style={{ flex: 1, background: '#060d18', border: '1px solid rgba(0,255,239,0.2)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 13, outline: 'none' }} />
                  <button onClick={sendMessage} style={{ background: '#00FFEF', border: 'none', borderRadius: 8, width: 38, height: 38, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
