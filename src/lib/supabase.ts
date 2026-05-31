import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function isValidUrl(str: string | undefined): str is string {
  if (!str) return false;
  try {
    const parsed = new URL(str);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// Null, ha az env hiányzik VAGY érvénytelen URL (pl. 'your_supabase_url')
// — így az import sosem dob "Invalid supabaseUrl" runtime hibát.
export const supabase: SupabaseClient | null = isValidUrl(url) && !!key
  ? createClient(url, key)
  : null;

export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}

export type Lead = {
  id?: string;
  created_at?: string;
  nev: string;
  telefon: string;
  email?: string;
  tema?: string;
  uzenet?: string;
  tipus: 'szakuzlet' | 'szerelo';
  statusz?: string;
};
