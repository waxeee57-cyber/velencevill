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

-- Lead workflow oszlopok (admin: státuszkezelés, jegyzet)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source       TEXT DEFAULT 'contact_form';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS contacted_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes        TEXT;

-- Index a státuszra (admin szűréshez)
CREATE INDEX IF NOT EXISTS leads_statusz_idx ON leads (statusz);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);

-- ============================================================================
-- CALLBACK_REQUESTS (visszahívás widget)
--   anon csak INSERT; az admin olvasás/módosítás service_role-os API route-on.
-- ============================================================================
CREATE TABLE IF NOT EXISTS callback_requests (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  telefon        TEXT NOT NULL,
  nev            TEXT,
  preferred_time TEXT,
  uzenet         TEXT,
  statusz        TEXT DEFAULT 'uj',
  called_at      TIMESTAMPTZ,
  notes          TEXT
);
ALTER TABLE callback_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "callback_anon_insert" ON callback_requests FOR INSERT TO anon WITH CHECK (true);
CREATE INDEX IF NOT EXISTS callback_created_idx ON callback_requests (created_at DESC);

-- ============================================================================
-- CHAT (valós idejű ügyfél-chat)
--   chats          : beszélgetés fej (PII: név/telefon) — anon NEM olvashatja
--   chat_messages  : üzenetek — anon csak 'user'-t szúrhat, olvasni tud (realtime)
--   Az admin oldal a service_role kulccsal olvas/válaszol (lásd /api/chat/*).
-- ============================================================================
CREATE TABLE IF NOT EXISTS chats (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  nev             TEXT,
  telefon         TEXT,
  status          TEXT DEFAULT 'open'
);
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chats_anon_insert" ON chats FOR INSERT TO anon WITH CHECK (true);
CREATE INDEX IF NOT EXISTS chats_last_message_idx ON chats (last_message_at DESC);

CREATE TABLE IF NOT EXISTS chat_messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  chat_id    UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender     TEXT NOT NULL CHECK (sender IN ('user', 'admin')),
  content    TEXT NOT NULL
);
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "msgs_anon_insert_user" ON chat_messages FOR INSERT TO anon WITH CHECK (sender = 'user');
CREATE POLICY "msgs_anon_select"      ON chat_messages FOR SELECT TO anon USING (true);
CREATE INDEX IF NOT EXISTS chat_messages_chat_idx ON chat_messages (chat_id, created_at);

-- Realtime engedélyezés (e nélkül a kliens nem kap értesítést az admin válaszról!)
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

-- ============================================================================
-- VIP AJÁNLATOK
--   FIGYELEM: az admin VIP felület az anon kulccsal ír (meglévő dizájn).
--   Biztonsági adósság: érdemes később service_role útvonalra terelni.
-- ============================================================================
CREATE TABLE IF NOT EXISTS vip_offers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  title       TEXT NOT NULL,
  description TEXT,
  file_url    TEXT,
  valid_until DATE,
  active      BOOLEAN DEFAULT TRUE
);
ALTER TABLE vip_offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vip_anon_all" ON vip_offers FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS vip_offers_active_idx ON vip_offers (active, created_at DESC);
