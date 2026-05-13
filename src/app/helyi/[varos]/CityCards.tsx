'use client';
import Link from 'next/link';

const PRODUCT_CATEGORIES = [
  { icon: '🔌', label: 'Kábelek és vezetékek' },
  { icon: '⚡', label: 'Kismegszakítók, FI relék' },
  { icon: '💡', label: 'LED világítás' },
  { icon: '🔧', label: 'Kapcsolók és dugaljak' },
  { icon: '📦', label: 'Elosztószekrények' },
  { icon: '🛠️', label: 'Szerelési anyagok' },
];

export default function CityCards() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
      {PRODUCT_CATEGORIES.map(cat => (
        <Link key={cat.label} href="/termekek" style={{ textDecoration: 'none' }}>
          <div
            className="glass-card"
            style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s, transform 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,255,239,0.4)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,255,239,0.15)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{cat.icon}</div>
            <div style={{ fontSize: 12, color: '#8899aa', lineHeight: 1.4 }}>{cat.label}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
