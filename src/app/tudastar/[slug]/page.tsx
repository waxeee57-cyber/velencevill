import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ARTICLES, CATEGORY_LABELS } from '../articles';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return ARTICLES.map(a => ({ slug: a.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const article = ARTICLES.find(a => a.slug === params.slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
  };
}

export default function ArticlePage({ params }: Props) {
  const article = ARTICLES.find(a => a.slug === params.slug);
  if (!article) notFound();

  return (
    <>
      <Navbar />
      <main style={{ background: '#060d18', minHeight: '100vh' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '4rem 2rem' }}>
          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#475569', marginBottom: 32 }}>
            <Link href="/" style={{ color: '#475569', textDecoration: 'none' }}>Főoldal</Link>
            <span>›</span>
            <Link href="/tudastar" style={{ color: '#475569', textDecoration: 'none' }}>Tudástár</Link>
            <span>›</span>
            <span style={{ color: '#8899aa' }}>{article.title}</span>
          </nav>

          {/* Meta */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 10, background: 'rgba(0,255,239,0.08)', color: '#00FFEF', border: '0.5px solid rgba(0,255,239,0.2)' }}>
              {CATEGORY_LABELS[article.category]}
            </span>
            <span style={{ fontSize: 12, color: '#475569' }}>{article.publishDate}</span>
            <span style={{ fontSize: 12, color: '#475569' }}>{article.readTime} perces olvasás</span>
          </div>

          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#ffffff', marginBottom: 40, lineHeight: 1.3 }}>
            {article.title}
          </h1>

          {/* Placeholder content */}
          <div style={{ background: 'rgba(13,31,60,0.8)', border: '1px solid rgba(0,255,239,0.15)', borderRadius: 16, padding: '2.5rem', textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📝</div>
            <p style={{ fontSize: 16, color: '#8899aa', lineHeight: 1.7, marginBottom: 20 }}>
              Ez a cikk hamarosan elkészül.<br />
              Addig hívjon minket személyesen!
            </p>
            <a
              href="tel:+36306182165"
              className="btn-primary"
              style={{ textDecoration: 'none', fontSize: 15 }}>
              📞 +36 30 618 2165
            </a>
          </div>

          {/* Sidebar — related product categories */}
          <div style={{ background: 'rgba(13,31,60,0.5)', border: '1px solid rgba(0,255,239,0.1)', borderRadius: 12, padding: '1.5rem' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#00FFEF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Kapcsolódó termékek</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Kábelek és vezékkék', href: '/termekek' },
                { label: 'Kismegszakítók, FI relék', href: '/termekek' },
                { label: 'Kapcsolók és dugaljak', href: '/markak' },
                { label: 'LED világítás', href: '/termekek' },
              ].map(l => (
                <Link key={l.label} href={l.href}
                  style={{ fontSize: 14, color: '#8899aa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#00FFEF', fontSize: 12 }}>→</span>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
