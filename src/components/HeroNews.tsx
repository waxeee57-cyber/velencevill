'use client';
import { useNotices } from '@/hooks/useNotices';

function Bolt({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#00FFEF" aria-hidden="true">
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

/**
 * A hero-ban megjelenő kiemelt hírdoboz — ugyanazt az aktív admin-hírt mutatja,
 * mint a fejléc hírsáv. A térkép-sor szélességét veszi fel (max-w-5xl + px-4/6).
 * Ha nincs aktív hír, nem renderel semmit (a hero elrendezése változatlan marad).
 */
export default function HeroNews() {
  const notices = useNotices();
  if (notices.length === 0) return null;

  return (
    <div className="mb-8 max-w-5xl mx-auto px-4 sm:px-6">
      <aside
        aria-label="Aktuális hírek"
        style={{
          textAlign: 'left',
          background: 'rgba(13,31,60,0.6)',
          border: '1px solid rgba(0,255,239,0.28)',
          borderRadius: 12,
          padding: '14px 16px',
          boxShadow:
            '0 0 0 1px rgba(0,255,239,0.05), 0 8px 30px -12px rgba(0,255,239,0.35)',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            color: '#00FFEF',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          <Bolt size={12} />
          Friss hír
        </span>

        <ul
          style={{
            listStyle: 'none',
            margin: '8px 0 0',
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 7,
          }}
        >
          {notices.slice(0, 4).map((n) => {
            const textStyle: React.CSSProperties = {
              fontSize: 14,
              lineHeight: 1.55,
              fontWeight: 500,
              color: '#F1F5F9',
            };
            return (
              <li key={n.id} style={{ display: 'flex', gap: 9, alignItems: 'baseline' }}>
                <span aria-hidden="true" style={{ flexShrink: 0, transform: 'translateY(2px)' }}>
                  <Bolt size={11} />
                </span>
                {n.href ? (
                  <a
                    href={n.href}
                    {...(n.href.startsWith('http')
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    style={{
                      ...textStyle,
                      textDecoration: 'underline',
                      textDecorationColor: 'rgba(0,255,239,0.5)',
                      textUnderlineOffset: 3,
                    }}
                  >
                    {n.body}
                  </a>
                ) : (
                  <span style={textStyle}>{n.body}</span>
                )}
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}
