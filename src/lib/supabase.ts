import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
