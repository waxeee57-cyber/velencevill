import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Guarded böngésző-oldali singleton. Ha az env hiányzik/érvénytelen, null-t ad
// vissza (nem dob "Invalid supabaseUrl" hibát, ami összedöntené az oldalt).
let client: SupabaseClient | null = null;

function isValidHttpUrl(value?: string) {
  if (!value) return false;
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export function getSupabaseBrowser(): SupabaseClient | null {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!isValidHttpUrl(url) || !key) return null;
  try {
    client = createClient(url!, key, {
      realtime: { params: { eventsPerSecond: 5 } },
    });
    return client;
  } catch {
    return null;
  }
}
