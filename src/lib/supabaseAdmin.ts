import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Szerver-oldali service_role kliens. Megkerüli az RLS-t, ezért SOHA nem
// kerülhet kliens bundle-be. Csak API route-okból hívd.
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  try {
    return createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  } catch {
    return null;
  }
}
