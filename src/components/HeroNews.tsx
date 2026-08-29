'use client';
import { useEffect, useState, type CSSProperties } from 'react';
import { useNotices } from '@/hooks/useNotices';

function Bolt({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#00FFEF" aria-hidden="true">
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

/**
 * A hero-ban megjelenő kiemelt hírdoboz. Álló plakátnál a kép a saját
 * arányában, középen — nem feszül ki fekvő fehér sávvá.
 */
export default function HeroNews() {
  const notices = useNotices();
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightbox(null);
    }
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox]);

  if (notices.length === 0) return null;

  return (
    <div className="mb-8" style={{ width: '100%' }}>
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
            margin: '10px 0 0',
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {notices.slice(0, 4).map((n) => {
            const textStyle: CSSProperties = {
              fontSize: 15,
              lineHeight: 1.55,
              fontWeight: 500,
              color: '#F1F5F9',
            };
            const text = n.href ? (
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
            );

            if (n.image_url) {
              return (
                <li key={n.id} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button
                    type="button"
                    aria-label="Plakát nagyítása"
                    onClick={() => setLightbox({ src: n.image_url as string, alt: n.body })}
                    style={{
                      display: 'block',
                      width: '100%',
                      margin: 0,
                      padding: 0,
                      border: 'none',
                      background: 'transparent',
                      cursor: 'zoom-in',
                      minHeight: 44,
                    }}
                  >
                    <img
                      src={n.image_url}
                      alt={n.body}
                      style={{
                        display: 'block',
                        width: 'auto',
                        height: 'auto',
                        maxWidth: '100%',
                        maxHeight: 'min(70vh, 640px)',
                        objectFit: 'contain',
                        margin: '0 auto',
                        borderRadius: 10,
                        border: '1px solid rgba(0,255,239,0.22)',
                        background: '#fff',
                      }}
                    />
                  </button>
                  {text}
                </li>
              );
            }

            return (
              <li key={n.id} style={{ display: 'flex', gap: 9, alignItems: 'baseline' }}>
                <span aria-hidden="true" style={{ flexShrink: 0, transform: 'translateY(2px)' }}>
                  <Bolt size={11} />
                </span>
                {text}
              </li>
            );
          })}
        </ul>
      </aside>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Hírkép nagyban"
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 220,
            background: 'rgba(6,13,24,0.88)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            cursor: 'zoom-out',
          }}
        >
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            style={{
              maxWidth: 'min(96vw, 720px)',
              maxHeight: '92vh',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: 8,
              background: '#fff',
              pointerEvents: 'none',
            }}
          />
        </div>
      )}
    </div>
  );
}
