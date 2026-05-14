'use client';
import { useReveal } from '@/hooks/useReveal';
import { trackEvent } from '@/utils/analytics';

const HOURS = [
  { label: 'Hétfő – Péntek', time: '8:00 – 16:00', highlight: true },
  { label: 'Szombat',         time: '8:00 – 12:00', highlight: false },
  { label: 'Vasárnap',        time: 'Zárva',         highlight: false },
];

export default function InfoSection() {
  const ref = useReveal<HTMLElement>(true);

  return (
    <section ref={ref} style={{ background: '#060d18', padding: '3.5rem 2rem', borderTop: '0.5px solid rgba(0,255,239,0.08)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>

        {/* Left: Hours + address */}
        <div className="glass-card reveal" style={{ padding: '1.5rem' }}>
          <p className="section-label" style={{ marginBottom: 12 }}>Nyitvatartás</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {HOURS.map(h => (
              <div key={h.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, color: h.highlight ? '#ffffff' : '#8899aa' }}>{h.label}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: h.highlight ? '#00FFEF' : h.time === 'Zárva' ? '#4a5568' : '#8899aa' }}>{h.time}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '0.5px solid rgba(0,255,239,0.1)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00FFEF" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span style={{ fontSize: 13, color: '#8899aa' }}>Fecske utca 12., 2481 Velence</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00FFEF" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.01 2.22a2 2 0 011.98-2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
              <a href="tel:+36306182165" style={{ fontSize: 13, color: '#00FFEF', textDecoration: 'none' }}>+36 30 618 2165</a>
            </div>
          </div>
        </div>

        {/* Right: Map */}
        <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ borderRadius: 12, overflow: 'hidden', height: 250, border: '1px solid rgba(0,255,239,0.15)' }}>
            <iframe
              src="https://maps.google.com/maps?q=Fecske+utca+12,+2481+Velence&hl=hu&z=16&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)', display: 'block' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Fecske+utca+12,+2481+Velence"
              target="_blank" rel="noopener noreferrer"
              className="btn-secondary"
              onClick={() => trackEvent('map_click')}
              style={{ flex: 1, justifyContent: 'center', fontSize: 13, padding: '10px 12px', textDecoration: 'none' }}>
              📍 Google Maps
            </a>
            <a
              href="https://waze.com/ul?q=Fecske+utca+12+Velence&navigate=yes"
              target="_blank" rel="noopener noreferrer"
              className="btn-secondary"
              onClick={() => trackEvent('waze_click')}
              style={{ flex: 1, justifyContent: 'center', fontSize: 13, padding: '10px 12px', textDecoration: 'none' }}>
              🚗 Waze
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
