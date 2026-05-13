'use client';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// ── Cable sizing ────────────────────────────────────────────────────────────
const CABLE_SIZES = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50];
const RHO = { rez: 0.0175, aluminium: 0.028 };

function calcCable(current: number, length: number, material: 'rez' | 'aluminium') {
  if (!current || !length) return null;
  const rho = RHO[material];
  const minArea = (2 * current * length * rho) / (0.05 * 230);
  const selected = CABLE_SIZES.find(s => s >= minArea) ?? CABLE_SIZES[CABLE_SIZES.length - 1];
  const dropV = (2 * current * length * rho) / selected;
  const dropPct = (dropV / 230) * 100;
  return { minArea: minArea.toFixed(2), selected, dropPct: dropPct.toFixed(1) };
}

function CableCalc() {
  const [current, setCurrent] = useState('');
  const [length, setLength] = useState('');
  const [material, setMaterial] = useState<'rez' | 'aluminium'>('rez');
  const result = calcCable(parseFloat(current), parseFloat(length), material);

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>⚡ Kábelméretező</h2>
      <p style={{ fontSize: 13, color: '#8899aa', marginBottom: 20 }}>Meghatározza a szükséges minimális keresztmetszetet és a feszültségesést.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: 12, color: '#8899aa', display: 'block', marginBottom: 4 }}>Áram (A)</label>
          <input type="number" value={current} onChange={e => setCurrent(e.target.value)} placeholder="pl. 16"
            style={{ width: '100%', boxSizing: 'border-box', background: '#060d18', border: '1px solid rgba(0,255,239,0.2)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 14, outline: 'none' }} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#8899aa', display: 'block', marginBottom: 4 }}>Kábel hossza (m)</label>
          <input type="number" value={length} onChange={e => setLength(e.target.value)} placeholder="pl. 25"
            style={{ width: '100%', boxSizing: 'border-box', background: '#060d18', border: '1px solid rgba(0,255,239,0.2)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 14, outline: 'none' }} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#8899aa', display: 'block', marginBottom: 4 }}>Anyag</label>
          <select value={material} onChange={e => setMaterial(e.target.value as 'rez' | 'aluminium')}
            style={{ width: '100%', boxSizing: 'border-box', background: '#060d18', border: '1px solid rgba(0,255,239,0.2)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 14, outline: 'none' }}>
            <option value="rez">Réz</option>
            <option value="aluminium">Alumínium</option>
          </select>
        </div>
      </div>

      {result && (
        <div style={{ background: 'rgba(0,255,239,0.06)', border: '1px solid rgba(0,255,239,0.2)', borderRadius: 10, padding: '1rem', marginBottom: 16 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#00FFEF', marginBottom: 4 }}>Ajánlott: {result.selected} mm² kábel</div>
          <div style={{ fontSize: 13, color: '#8899aa' }}>Minimum számított: {result.minArea} mm² · Feszültségesés: {result.dropPct}%</div>
        </div>
      )}
      <CtaHint />
    </div>
  );
}

// ── Lighting calc ────────────────────────────────────────────────────────────
const LIGHT_MULTIPLIERS = { nappali: 150, iroda: 300, muhely: 500, furdo: 250 };
type RoomType = keyof typeof LIGHT_MULTIPLIERS;
const ROOM_LABELS: Record<RoomType, string> = { nappali: 'Nappali', iroda: 'Iroda', muhely: 'Műhely', furdo: 'Fürdő' };

function LightingCalc() {
  const [area, setArea] = useState('');
  const [type, setType] = useState<RoomType>('nappali');
  const a = parseFloat(area);
  const lumen = a ? a * LIGHT_MULTIPLIERS[type] : null;
  const watt = lumen ? Math.ceil(lumen / 100) : null;

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>💡 Világítás teljesítmény</h2>
      <p style={{ fontSize: 13, color: '#8899aa', marginBottom: 20 }}>Meghatározza a szükséges lument és a javasolt LED teljesítményt.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: 12, color: '#8899aa', display: 'block', marginBottom: 4 }}>Terület (m²)</label>
          <input type="number" value={area} onChange={e => setArea(e.target.value)} placeholder="pl. 20"
            style={{ width: '100%', boxSizing: 'border-box', background: '#060d18', border: '1px solid rgba(0,255,239,0.2)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 14, outline: 'none' }} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#8899aa', display: 'block', marginBottom: 4 }}>Helyiség típusa</label>
          <select value={type} onChange={e => setType(e.target.value as RoomType)}
            style={{ width: '100%', boxSizing: 'border-box', background: '#060d18', border: '1px solid rgba(0,255,239,0.2)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 14, outline: 'none' }}>
            {(Object.keys(ROOM_LABELS) as RoomType[]).map(k => (
              <option key={k} value={k}>{ROOM_LABELS[k]}</option>
            ))}
          </select>
        </div>
      </div>

      {lumen && watt && (
        <div style={{ background: 'rgba(0,255,239,0.06)', border: '1px solid rgba(0,255,239,0.2)', borderRadius: 10, padding: '1rem', marginBottom: 16 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#00FFEF', marginBottom: 4 }}>Ajánlott: ~{watt} W LED</div>
          <div style={{ fontSize: 13, color: '#8899aa' }}>Szükséges fény: {lumen.toLocaleString('hu-HU')} lumen · Szorzó: {LIGHT_MULTIPLIERS[type]} lm/m²</div>
        </div>
      )}
      <CtaHint />
    </div>
  );
}

// ── MCB sizing ────────────────────────────────────────────────────────────────
const MCB_SIZES = [6, 10, 16, 20, 25, 32, 40, 50, 63];

function McbCalc() {
  const [power, setPower] = useState('');
  const [voltage, setVoltage] = useState<'230' | '400'>('230');
  const [cosfi, setCosfi] = useState('0.8');

  let result: { current: number; mcb: number } | null = null;
  const p = parseFloat(power);
  const cf = parseFloat(cosfi) || 0.8;
  if (p && cf) {
    const current = voltage === '230'
      ? (p * 1000) / (230 * cf)
      : (p * 1000) / (Math.sqrt(3) * 400 * cf);
    const mcb = MCB_SIZES.find(s => s >= current) ?? MCB_SIZES[MCB_SIZES.length - 1];
    result = { current: Math.round(current * 10) / 10, mcb };
  }

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>🔒 Biztosíték méretező</h2>
      <p style={{ fontSize: 13, color: '#8899aa', marginBottom: 20 }}>Meghatározza a szükséges névleges áramot és a javasolt kismegszakító méretet.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: 12, color: '#8899aa', display: 'block', marginBottom: 4 }}>Teljesítmény (kW)</label>
          <input type="number" value={power} onChange={e => setPower(e.target.value)} placeholder="pl. 3.5"
            style={{ width: '100%', boxSizing: 'border-box', background: '#060d18', border: '1px solid rgba(0,255,239,0.2)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 14, outline: 'none' }} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#8899aa', display: 'block', marginBottom: 4 }}>Feszültség (V)</label>
          <select value={voltage} onChange={e => setVoltage(e.target.value as '230' | '400')}
            style={{ width: '100%', boxSizing: 'border-box', background: '#060d18', border: '1px solid rgba(0,255,239,0.2)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 14, outline: 'none' }}>
            <option value="230">230 V (1 fázis)</option>
            <option value="400">400 V (3 fázis)</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#8899aa', display: 'block', marginBottom: 4 }}>cos φ</label>
          <input type="number" value={cosfi} onChange={e => setCosfi(e.target.value)} step="0.01" min="0.1" max="1" placeholder="0.8"
            style={{ width: '100%', boxSizing: 'border-box', background: '#060d18', border: '1px solid rgba(0,255,239,0.2)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 14, outline: 'none' }} />
        </div>
      </div>

      {result && (
        <div style={{ background: 'rgba(0,255,239,0.06)', border: '1px solid rgba(0,255,239,0.2)', borderRadius: 10, padding: '1rem', marginBottom: 16 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#00FFEF', marginBottom: 4 }}>Ajánlott: {result.mcb} A kismegszakító</div>
          <div style={{ fontSize: 13, color: '#8899aa' }}>Számított névleges áram: {result.current} A</div>
        </div>
      )}
      <CtaHint />
    </div>
  );
}

function CtaHint() {
  return (
    <p style={{ fontSize: 12, color: '#475569' }}>
      Segítségre van szüksége?{' '}
      <a href="tel:+36306182165" style={{ color: '#00FFEF', textDecoration: 'none' }}>Hívjon minket: +36 30 618 2165</a>
    </p>
  );
}

export default function KalkulatorPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: '#060d18', minHeight: '100vh' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '4rem 2rem' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#00FFEF', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>Eszközök</p>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: '#ffffff', marginBottom: 12, lineHeight: 1.2 }}>Villanyszerelési kalkulátorok</h1>
          <p style={{ fontSize: 15, color: '#8899aa', marginBottom: 48, maxWidth: 560 }}>
            Gyors, ingyenes számítások villanyszerelőknek és barkácsolóknak. Real-time eredmény, minden lépésnél.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            <CableCalc />
            <LightingCalc />
            <McbCalc />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
