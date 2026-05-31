'use client';
import { useEffect, useRef } from 'react';

const SCHEDULE = [
  { day: 'Hétfő',     from: 8, to: 16 },
  { day: 'Kedd',      from: 8, to: 16 },
  { day: 'Szerda',    from: 8, to: 16 },
  { day: 'Csütörtök', from: 8, to: 16 },
  { day: 'Péntek',    from: 8, to: 16 },
  { day: 'Szombat',   from: 8, to: 12 },
  { day: 'Vasárnap',  from: 0, to: 0  },
];

function getStatus() {
  const now = new Date();
  const jsDay = now.getDay();
  const todayIdx = jsDay === 0 ? 6 : jsDay - 1;
  const currentH = now.getHours() + now.getMinutes() / 60;
  const today = SCHEDULE[todayIdx];
  const isOpen = today.from > 0 && currentH >= today.from && currentH < today.to;
  let nextLabel = '';
  if (!isOpen) {
    for (let i = 1; i <= 7; i++) {
      const d = SCHEDULE[(todayIdx + i) % 7];
      if (d.from > 0) { nextLabel = `${d.day} ${d.from}:00-tól`; break; }
    }
  }
  return { isOpen, todayIdx, statusText: isOpen ? `Most nyitva · ${today.from}:00–${today.to}:00` : `Most zárva · ${nextLabel}` };
}

const DISPLAY_HOURS = [
  { label: 'H–P', time: '8:00–16:00', range: [0, 4] as [number, number] },
  { label: 'Szo', time: '8:00–12:00', range: [5, 5] as [number, number] },
  { label: 'Vas', time: 'Zárva',      range: [6, 6] as [number, number] },
];

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isOpen, todayIdx, statusText } = getStatus();

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    let animId: number;

    import('three').then((THREE) => {
      // Nagyobb, reszponzív villám: max 420px, mobilon a viewport 65%-a.
      const W = Math.min(420, Math.round(window.innerWidth * 0.65));
      const H = Math.round(W * 1.083);
      c.width = W * window.devicePixelRatio;
      c.height = H * window.devicePixelRatio;
      c.style.width = `${W}px`;
      c.style.height = `${H}px`;

      const renderer = new THREE.WebGLRenderer({ canvas: c, alpha: true, antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
      camera.position.set(0, 0, 7.5);

      scene.add(new THREE.AmbientLight(0x000000, 1));
      const pl1 = new THREE.PointLight(0x00FFEF, 4, 20);
      pl1.position.set(3, 3, 3);
      scene.add(pl1);
      scene.add(new THREE.PointLight(0x000000, 2, 18));

      const s = new THREE.Shape();
      s.moveTo(0.14, 2.0); s.lineTo(-0.22, 0.06); s.lineTo(0.0, 0.06);
      s.lineTo(-0.14, -2.0); s.lineTo(0.22, -0.05); s.lineTo(0.0, -0.05);
      s.closePath();

      const geo = new THREE.ExtrudeGeometry(s, { depth: 0.14, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.05, bevelSegments: 4 });
      geo.center();

      const bolt = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo, 10),
        new THREE.LineBasicMaterial({ color: 0x00FFEF, transparent: true, opacity: 0.9 })
      );
      scene.add(bolt);
      bolt.add(new THREE.LineSegments(
        new THREE.EdgesGeometry(geo, 40),
        new THREE.LineBasicMaterial({ color: 0x00FFEF, transparent: true, opacity: 0.22 })
      ));

      const spawnPoints = [
        new THREE.Vector3(0, 2, 0), new THREE.Vector3(-0.2, 0.06, 0),
        new THREE.Vector3(0, 0.06, 0), new THREE.Vector3(0, -2, 0),
        new THREE.Vector3(0.2, -0.05, 0), new THREE.Vector3(0.1, 1, 0.07),
        new THREE.Vector3(-0.1, -1, 0.07),
      ];

      const sparks = Array.from({ length: 28 }, () => {
        const mat = new THREE.MeshBasicMaterial({ color: Math.random() > 0.5 ? 0x00FFEF : 0xffffff, transparent: true, opacity: 0 });
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.025 + Math.random() * 0.02, 4, 4), mat);
        const pos = spawnPoints[Math.floor(Math.random() * spawnPoints.length)].clone();
        mesh.position.copy(pos);
        scene.add(mesh);
        return { mesh, mat, pos: pos.clone(), vel: new THREE.Vector3((Math.random()-0.5)*0.06,(Math.random()-0.5)*0.06,(Math.random()-0.5)*0.06), life: Math.random(), maxLife: 0.5+Math.random()*0.8, delay: Math.random()*2 };
      });

      let t = 0;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        t += 0.012;
        bolt.rotation.y = t * 0.55;
        bolt.rotation.x = Math.sin(t * 0.28) * 0.14;
        pl1.position.x = Math.sin(t * 0.45) * 3.5;
        pl1.position.y = Math.cos(t * 0.38) * 2.5;
        sparks.forEach(sp => {
          sp.life += 0.018;
          if (sp.life > sp.maxLife + sp.delay) {
            sp.life = 0; sp.delay = Math.random()*1.5; sp.maxLife = 0.4+Math.random()*0.7;
            const np = spawnPoints[Math.floor(Math.random()*spawnPoints.length)].clone();
            sp.pos.copy(np); sp.mesh.position.copy(np);
            sp.vel.set((Math.random()-0.5)*0.07,(Math.random()-0.5)*0.07,(Math.random()-0.5)*0.07);
          }
          const active = sp.life - sp.delay;
          if (active > 0) {
            sp.mesh.position.set(sp.pos.x+sp.vel.x*active*18, sp.pos.y+sp.vel.y*active*18, sp.pos.z+sp.vel.z*active*18);
            const progress = active / sp.maxLife;
            sp.mat.opacity = progress < 0.2 ? (progress/0.2)*0.9 : (1-progress)*0.9;
            sp.mesh.scale.setScalar(1-progress*0.5);
          } else { sp.mat.opacity = 0; }
        });
        renderer.render(scene, camera);
      };
      animate();
    });
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section style={{ background:'#060d18', minHeight:560, position:'relative', overflow:'hidden', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'4rem 2rem 3rem', textAlign:'center' }}>
      <div style={{ position:'absolute', top:-100, right:-80, width:360, height:360, borderRadius:'50%', background:'radial-gradient(circle, rgba(0,255,239,0.07) 0%, transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-80, left:-60, width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle, rgba(0,0,0,0.4) 0%, transparent 70%)', pointerEvents:'none' }} />
      <canvas ref={canvasRef} aria-hidden="true" className="hero-canvas" style={{}} />

      <div style={{ position:'relative', zIndex:2, maxWidth:560, width:'100%' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(0,255,239,0.07)', border:'0.5px solid rgba(0,255,239,0.25)', color:'#00FFEF', fontSize:12, fontWeight:500, padding:'5px 14px', borderRadius:20, marginBottom:'1.6rem', letterSpacing:'0.03em' }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'#00FFEF', display:'inline-block', animation:'pulseDot 2s infinite' }} />
          Velence · Fecske utca 12.
        </div>

        <h1 style={{ fontSize:38, fontWeight:700, color:'#F1F5F9', lineHeight:1.22, marginBottom:'1rem' }}>
          Villanyszerelési anyagok —<br /><em style={{ fontStyle:'normal', color:'#00FFEF' }}>szakértői szinten</em>
        </h1>

        <p style={{ fontSize:15, color:'#8899aa', lineHeight:1.7, marginBottom:'2rem', maxWidth:420, marginLeft:'auto', marginRight:'auto' }}>
          10+ vezető márka egy helyen. Profi kiszolgálás villanyszerelőknek és magánvásárlóknak egyaránt.
        </p>

        {/* Persona fork */}
        <div style={{ marginBottom:'1.5rem' }}>
          <p style={{ fontSize:12, color:'#8899aa', marginBottom:10, letterSpacing:'0.02em' }}>Kinek keresünk megoldást?</p>
          <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap' }}>
            {[
              { label:'Villanyszerelő vagyok', target:'szakembereknek' },
              { label:'Otthoni vásárló vagyok', target:'termekek' },
            ].map(p => (
              <button
                key={p.label}
                onClick={() => document.getElementById(p.target)?.scrollIntoView({ behavior:'smooth' })}
                style={{ padding:'7px 18px', borderRadius:50, border:'1px solid #00FFEF', background:'transparent', color:'#fff', fontSize:13, fontWeight:500, cursor:'pointer', transition:'background 0.2s ease' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,255,239,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginBottom:'2.5rem' }}>
          <a href="tel:+36306182165" className="btn-primary" style={{ textDecoration:'none', fontSize:15 }}>
            📞 Hívjon most · +36 30 618 2165
          </a>
          <button onClick={() => document.getElementById('ajanlat')?.scrollIntoView({ behavior:'smooth' })} className="btn-secondary" style={{ fontSize:15 }}>
            Ajánlatot kérek
          </button>
        </div>

        {/* Kis statisztika badge — egy soros */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs md:text-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0d1f3c]/40 border border-[#00FFEF]/15">
            <span className="text-[#00FFEF] font-semibold">10+</span>
            <span className="text-gray-400">vezető márka</span>
          </div>
        </div>

        {/* Térkép + gyorsgombok szekció */}
        <div className="mt-12 md:mt-16 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-3 md:gap-4 items-stretch">

            {/* Bal: Google Maps gomb */}
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Velence+Vill+Kft+Fecske+utca+12+Velence"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center px-5 py-3 md:px-6 md:py-0 md:min-h-[220px] rounded-xl bg-[#0d1f3c]/60 hover:bg-[#0d1f3c] border border-[#00FFEF]/20 hover:border-[#00FFEF]/50 transition-all hover:scale-[1.02]"
              aria-label="Útvonal Google Maps-ben"
            >
              <div className="flex flex-col items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                     className="text-[#00FFEF] group-hover:scale-110 transition-transform">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"
                        fill="currentColor"/>
                </svg>
                <span className="text-sm font-medium text-white whitespace-nowrap">
                  Google Maps
                </span>
              </div>
            </a>

            {/* Középen: Beágyazott térkép */}
            <div className="relative rounded-xl overflow-hidden border border-[#00FFEF]/20 hover:border-[#00FFEF]/40 transition-colors group min-h-[220px] md:min-h-[260px]">
              {/* Cím badge bal felső */}
              <div className="absolute top-2 left-2 z-10 px-2.5 py-1 rounded-lg bg-[#060d18]/90 backdrop-blur-sm border border-[#00FFEF]/30 text-xs">
                <span className="text-[#00FFEF]">📍</span>
                <span className="text-white ml-1.5 font-medium">Fecske u. 12., Velence</span>
              </div>

              {/* iframe térkép — kitölti a konténert */}
              <iframe
                src="https://www.google.com/maps?q=Velence+Vill+Kft+Fecske+utca+12+Velence&output=embed"
                style={{ border: 0, filter: 'invert(0.92) hue-rotate(180deg) saturate(0.4) brightness(0.95)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Velence Vill Kft. helye"
                className="absolute inset-0 w-full h-full"
              />

              {/* Kattintási overlay (mobilon) */}
              <a
                href="https://maps.google.com/?q=Velence+Vill+Kft+Fecske+utca+12+Velence"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 md:hidden"
                aria-label="Térkép megnyitása"
              />
            </div>

            {/* Jobb: Waze gomb */}
            <a
              href="https://waze.com/ul?q=Velence+Vill+Kft+Fecske+utca+12+Velence&navigate=yes"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center px-5 py-3 md:px-6 md:py-0 md:min-h-[220px] rounded-xl bg-[#0d1f3c]/60 hover:bg-[#0d1f3c] border border-[#00FFEF]/20 hover:border-[#00FFEF]/50 transition-all hover:scale-[1.02]"
              aria-label="Útvonal Waze-ben"
            >
              <div className="flex flex-col items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                     className="text-[#00FFEF] group-hover:scale-110 transition-transform">
                  <path d="M20.54 6.63A10 10 0 002 13a2 2 0 002 2h.5a3.5 3.5 0 107 0h2a3.5 3.5 0 107 0h.5a2 2 0 002-2 9.94 9.94 0 00-.46-2.99l-1.5-3.38zM7 16a1.5 1.5 0 11.001-3.001A1.5 1.5 0 017 16zm9 0a1.5 1.5 0 11.001-3.001A1.5 1.5 0 0116 16z"
                        fill="currentColor"/>
                </svg>
                <span className="text-sm font-medium text-white whitespace-nowrap">
                  Waze
                </span>
              </div>
            </a>

          </div>
        </div>

        <div style={{ width:40, height:0.5, background:'rgba(0,255,239,0.15)', margin:'2.5rem auto 2rem' }} />

        {/* Opening hours */}
        <div style={{ maxWidth:400, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, fontSize:13, fontWeight:500, padding:'5px 14px', borderRadius:20, background: isOpen ? 'rgba(0,255,239,0.07)' : 'rgba(0,0,0,0.4)', border: isOpen ? '0.5px solid rgba(0,255,239,0.22)' : '0.5px solid rgba(239,68,68,0.2)', color: isOpen ? '#00FFEF' : '#F87171' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background: isOpen ? '#00FFEF' : '#EF4444', display:'inline-block' }} />
            {statusText}
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'1.2rem' }}>
            {DISPLAY_HOURS.map((d, i) => {
              const isToday = todayIdx >= d.range[0] && todayIdx <= d.range[1];
              return (
                <div key={d.label} style={{ display:'flex', alignItems:'center', gap:'1.2rem' }}>
                  {i > 0 && <div style={{ width:0.5, height:26, background:'rgba(255,255,255,0.05)' }} />}
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
                    <div style={{ fontSize:11, textTransform:'uppercase', letterSpacing:'0.07em', color: isToday ? '#00FFEF' : '#8899aa' }}>{d.label}</div>
                    <div style={{ fontSize:13, fontWeight:500, color: isToday ? '#00FFEF' : d.time === 'Zárva' ? '#4a5568' : '#8899aa' }}>{d.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <style>{`@keyframes pulseDot { 0%,100%{opacity:1} 50%{opacity:0.25} }`}</style>
    </section>
  );
}
