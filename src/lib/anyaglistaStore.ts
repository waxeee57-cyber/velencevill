'use client';

// Kliensoldali "anyaglista" tár — kosár helyett: darabszámmal, ár nélkül.
// localStorage-ban perzisztál, egyszerű pub/sub-bal szinkronban tartva a
// komponenseket (Navbar badge, floating widget, /anyaglista oldal, termékkártyák).

export interface AnyaglistaTetel {
  id: string;
  nev: string;
  kategoria: string;
  marka?: string;
  mennyiseg: number;
}

const STORAGE_KEY = 'velencevill_anyaglista_v1';
type Listener = () => void;

let items: AnyaglistaTetel[] = [];
let hydrated = false;
const listeners = new Set<Listener>();

function load(): AnyaglistaTetel[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (t): t is AnyaglistaTetel =>
        t && typeof t.id === 'string' && typeof t.nev === 'string' && typeof t.mennyiseg === 'number',
    );
  } catch {
    return [];
  }
}

function persist() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* tele a storage vagy tiltva — csendben elnyeljük, a memóriabeli állapot így is működik */
  }
}

function ensureHydrated() {
  if (hydrated) return;
  items = load();
  hydrated = true;
}

function emit() {
  listeners.forEach(l => l());
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getItems(): AnyaglistaTetel[] {
  ensureHydrated();
  return items;
}

export function getServerSnapshot(): AnyaglistaTetel[] {
  return [];
}

export function addItem(entry: Omit<AnyaglistaTetel, 'mennyiseg'>, qty = 1) {
  ensureHydrated();
  const existing = items.find(i => i.id === entry.id);
  if (existing) {
    items = items.map(i => (i.id === entry.id ? { ...i, mennyiseg: i.mennyiseg + qty } : i));
  } else {
    items = [...items, { ...entry, mennyiseg: qty }];
  }
  persist();
  emit();
}

export function setQty(id: string, qty: number) {
  ensureHydrated();
  if (qty <= 0) {
    items = items.filter(i => i.id !== id);
  } else {
    items = items.map(i => (i.id === id ? { ...i, mennyiseg: qty } : i));
  }
  persist();
  emit();
}

export function removeItem(id: string) {
  ensureHydrated();
  items = items.filter(i => i.id !== id);
  persist();
  emit();
}

export function clearAll() {
  ensureHydrated();
  items = [];
  persist();
  emit();
}

export function totalCount(): number {
  return getItems().reduce((sum, i) => sum + i.mennyiseg, 0);
}
