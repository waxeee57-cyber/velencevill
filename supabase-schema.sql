-- Velence Vill Kft. — Supabase séma [DEPRECATED, 2026-08-18]
-- A projekt teljes egészében Vercel Blob-alapú JSON-tárolásra állt át
-- (lásd src/lib/blobStore.ts, CLAUDE.md). Ez a fájl NEM fut többé éles
-- adatbázison — csak dokumentációként/referenciaként maradt meg, hogy a
-- korábbi tábla-/mezőnevek visszakereshetők legyenek.

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
--   anon CSAK az aktív ajánlatokat olvashatja (publikus /vip oldal).
--   Írás (insert/update/delete) + fájlfeltöltés kizárólag service_role-on át,
--   a token-védett /api/admin/vip-offers route-on (nincs anon spam).
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
CREATE POLICY "vip_anon_select_active" ON vip_offers FOR SELECT TO anon USING (active = true);
CREATE INDEX IF NOT EXISTS vip_offers_active_idx ON vip_offers (active, created_at DESC);

-- vip-files bucket: publikus olvasás; feltöltés CSAK service_role (anon nem).
-- (A vip_files_anon_upload policy eltávolítva.)

-- ============================================================================
-- SITE_NOTICES (napi hírek a fejlécben)
--   anon CSAK az aktív híreket olvashatja (publikus sáv).
--   Írás kizárólag service_role-on át, a token-védett /api/admin/notices route-on.
-- ============================================================================
CREATE TABLE IF NOT EXISTS site_notices (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  body        TEXT NOT NULL,
  href        TEXT,
  active      BOOLEAN DEFAULT TRUE
);
ALTER TABLE site_notices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notices_anon_select_active" ON site_notices FOR SELECT TO anon USING (active = true);
CREATE INDEX IF NOT EXISTS site_notices_active_idx ON site_notices (active, created_at DESC);

-- ============================================================================
-- MATERIAL_LISTS (anyaglista — "kosár" helyett: darabszám, ár nélkül)
--   anon csak INSERT; az admin olvasás/módosítás service_role-os API route-on
--   (/api/admin/material-lists), ugyanaz a minta mint a leads/callback_requests.
-- ============================================================================
CREATE TABLE IF NOT EXISTS material_lists (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  nev         TEXT NOT NULL,
  telefon     TEXT NOT NULL,
  megjegyzes  TEXT,
  tetelek     JSONB NOT NULL,
  statusz     TEXT DEFAULT 'uj',
  forras      TEXT DEFAULT 'anyaglista_oldal',
  kesz_at     TIMESTAMPTZ
);
ALTER TABLE material_lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "material_lists_anon_insert" ON material_lists FOR INSERT TO anon WITH CHECK (true);
CREATE INDEX IF NOT EXISTS material_lists_statusz_idx ON material_lists (statusz);
CREATE INDEX IF NOT EXISTS material_lists_created_idx ON material_lists (created_at DESC);

-- ============================================================================
-- VIP_REQUESTS (VIP gyorskapu — fotózott/kézzel írt anyaglista, opcionális
--   hangüzenettel). Kizárólag a service_role-os /api/vip/quick-request route
--   ír bele (a fájlfeltöltés miatt is szükséges az emelt jogosultság) —
--   nincs anon insert policy, ugyanaz a védelmi minta mint a vip_offers-nél.
-- ============================================================================
CREATE TABLE IF NOT EXISTS vip_requests (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  nev         TEXT NOT NULL,
  telefon     TEXT NOT NULL,
  uzenet      TEXT,
  kep_url     TEXT,
  hang_url    TEXT,
  statusz     TEXT DEFAULT 'uj'
);
ALTER TABLE vip_requests ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS vip_requests_statusz_idx ON vip_requests (statusz);
CREATE INDEX IF NOT EXISTS vip_requests_created_idx ON vip_requests (created_at DESC);
-- (Szándékosan nincs anon policy: RLS engedélyezve, de policy nélkül minden
-- anon hozzáférés tiltott — csak a service_role-os route írhat/olvashat.)
