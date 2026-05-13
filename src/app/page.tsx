import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Products from '@/components/sections/Products';
import Brands from '@/components/sections/Brands';
import Partner from '@/components/sections/Partner';
import Social from '@/components/sections/Social';
import ContactForm from '@/components/sections/ContactForm';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        {/* Trust bar */}
        <div className="bg-slate-100 border-y border-slate-200 py-3 px-6 overflow-x-auto">
          <div className="flex items-center gap-6 justify-center min-w-max mx-auto">
            {['Legrand', 'Schneider Electric', 'Tracon Electric', 'EGLO · Rábalux', 'Csatári Plast', 'OBO · Kanlux'].map(b => (
              <div key={b} className="flex items-center gap-1.5 text-[13px] text-slate-500 whitespace-nowrap">
                <svg className="text-green-500 flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                {b}
              </div>
            ))}
          </div>
        </div>

        <Products />

        <Brands />

        <Partner />

        {/* Contact */}
        <section id="ajanlat" className="py-14 px-6 bg-slate-50 border-t border-slate-100">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-xs font-medium text-blue-600 uppercase tracking-widest mb-1">Kapcsolat</p>
              <h2 className="text-2xl font-medium text-slate-900 mb-1">Kérjen ajánlatot</h2>
              <p className="text-sm text-slate-500">1 munkanapon belül visszahívjuk</p>
            </div>
            <ContactForm />
          </div>
        </section>

        <Social />
      </main>
      <Footer />
    </>
  );
}
