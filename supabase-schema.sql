-- Velence Vill Kft. — Supabase séma
-- Futtatás: Supabase Dashboard > SQL Editor

CREATE TABLE IF NOT EXISTS leads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  nev         TEXT NOT NULL,
  telefon     TEXT NOT NULL,
  email       TEXT,
  tema        TEXT,
  uzenet      TEXT,
  tipus       TEXT CHECK (tipus IN ('szakuzlet', 'szerelo')) DEFAULT 'szakuzlet',
  statusz     TEXT DEFAULT 'uj'
);

-- Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Csak szerver oldali (service_role) tud olvasni
CREATE POLICY "Service role only" ON leads
  FOR ALL USING (auth.role() = 'service_role');

-- Anon insert engedélyezve (form beküldés)
CREATE POLICY "Allow anon insert" ON leads
  FOR INSERT WITH CHECK (true);

-- Index a státuszra (admin szűréshez)
CREATE INDEX IF NOT EXISTS leads_statusz_idx ON leads (statusz);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
