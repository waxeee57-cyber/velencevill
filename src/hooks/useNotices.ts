'use client';
import { useEffect, useState } from 'react';

export type Notice = { id: string; body: string; href?: string | null; image_url?: string | null };

/**
 * Az aktív admin-hírek (`site_notices`) lekérése a `/api/notices` végpontról,
 * `pollMs` időnként frissítve. Hiba / üres tároló esetén üres tömb — a hívó
 * komponens ilyenkor ne rendereljen semmit.
 */
export function useNotices(pollMs = 60000): Notice[] {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    let stop = false;
    async function load() {
      try {
        const res = await fetch('/api/notices');
        if (!res.ok) return;
        const data = await res.json();
        if (!stop) setNotices(Array.isArray(data.notices) ? data.notices : []);
      } catch {
        /* üres marad, ha nincs hír / tároló */
      }
    }
    load();
    const t = setInterval(load, pollMs);
    return () => {
      stop = true;
      clearInterval(t);
    };
  }, [pollMs]);

  return notices;
}
