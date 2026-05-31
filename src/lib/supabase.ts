import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Null, ha az env hiányzik — így az import sosem dob "Invalid supabaseUrl" hibát.
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function isSupabaseConfigured() {
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
