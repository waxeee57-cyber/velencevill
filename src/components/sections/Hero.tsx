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
      const W = 240, H = 260;
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

      const geo = new THREE.ExtrudeGeometry(s, {
        depth: 0.14, bevelEnabled: true,
        bevelThickness: 0.07, bevelSize: 0.05, bevelSegments: 4,
      });
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
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.025 + Math.random() * 0.02, 4, 4),
          new THREE.MeshBasicMaterial({ color: Math.random() > 0.5 ? 0x00FFEF : 0xffffff, transparent: true, opacity: 0 })
        );
        const pos = spawnPoints[Math.floor(Math.random() * spawnPoints.length)].clone();
        mesh.position.copy(pos);
        scene.add(mesh);
        return {
          mesh, pos: pos.clone(),
          vel: new THREE.Vector3((Math.random() - 0.5) * 0.06, (Math.random() - 0.5) * 0.06, (Math.random() - 0.5) * 0.06),
          life: Math.random(), maxLife: 0.5 + Math.random() * 0.8, delay: Math.random() * 2,
        };
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
            sp.life = 0; sp.delay = Math.random() * 1.5; sp.maxLife = 0.4 + Math.random() * 0.7;
            const np = spawnPoints[Math.floor(Math.random() * spawnPoints.length)].clone();
            sp.pos.copy(np); sp.mesh.position.copy(np);
            sp.vel.set((Math.random() - 0.5) * 0.07, (Math.random() - 0.5) * 0.07, (Math.random() - 0.5) * 0.07);
          }
          const active = sp.life - sp.delay;
          if (active > 0) {
            sp.mesh.position.set(
              sp.pos.x + sp.vel.x * active * 18,
              sp.pos.y + sp.vel.y * active * 18,
              sp.pos.z + sp.vel.z * active * 18
            );
            const progress = active / sp.maxLife;
            (sp.mesh.material as THREE.MeshBasicMaterial).opacity = progress < 0.2 ? (progress / 0.2) * 0.9 : (1 - progress) * 0.9;
            sp.mesh.scale.setScalar(1 - progress * 0.5);
            sp.mesh.rotation.set(bolt.rotation.x, bolt.rotation.y, 0);
          } else {
            (sp.mesh.material as THREE.MeshBasicMaterial).opacity = 0;
          }
        });

        renderer.render(scene, camera);
      };
      animate();
    });

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section style={{
      background: '#060d18',
      minHeight: 540,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem 3rem',
      textAlign: 'center',
    }}>
      {/* Glow orbs */}
      <div style={{ position: 'absolute', top: -100, right: -80, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,255,239,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, left: -60, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,0,0,0.4) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* 3D Bolt */}
      <canvas ref={canvasRef} style={{ position: 'absolute', top: -14, right: -14, pointerEvents: 'none', zIndex: 1, opacity: 0.8 }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 560, width: '100%' }}>

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(0,255,239,0.07)', border: '0.5px solid rgba(0,255,239,0.25)', color: '#00FFEF', fontSize: 12, fontWeight: 500, padding: '5px 14px', borderRadius: 20, marginBottom: '1.6rem', letterSpacing: '0.03em' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00FFEF', display: 'inline-block', animation: 'pulseDot 2s infinite' }} />
          Velence · Fecske utca 12.
        </div>

        {/* H1 */}
        <h1 style={{ fontSize: 38, fontWeight: 500, color: '#F1F5F9', lineHeight: 1.22, marginBottom: '1rem', fontFamily: 'system-ui, sans-serif' }}>
          Villanyszerelési anyagok —<br />
          <em style={{ fontStyle: 'normal', color: '#00FFEF' }}>szakértői szinten</em>
        </h1>

        <p style={{ fontSize: 15, color: '#4a6080', lineHeight: 1.7, marginBottom: '2rem', maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
          13 vezető márka egy helyen. Profi kiszolgálás villanyszerelőknek és magánvásárlóknak egyaránt.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          <a href="tel:+36306182165" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#00FFEF', color: '#000', fontSize: 15, fontWeight: 600, padding: '12px 24px', borderRadius: 10, textDecoration: 'none', boxShadow: '0 0 24px rgba(0,255,239,0.25)' }}>
            📞 Hívjon most · +36 30 618 2165
          </a>
          <button
            onClick={() => document.getElementById('ajanlat')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#000', color: '#94A3B8', fontSize: 15, fontWeight: 500, padding: '12px 24px', borderRadius: 10, border: '0.5px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
            Ajánlatot kérek
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 500, color: '#F1F5F9' }}>13</div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#2a3a4a', marginTop: 2 }}>Vezető márka</div>
          </div>
          <div style={{ width: 0.5, height: 32, background: 'rgba(0,255,239,0.1)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 500, color: '#F1F5F9' }}>1 nap</div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#2a3a4a', marginTop: 2 }}>Válaszidő</div>
          </div>
        </div>

        <div style={{ width: 40, height: 0.5, background: 'rgba(0,255,239,0.15)', margin: '0 auto 2rem' }} />

        {/* Live hours */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 500, padding: '5px 14px', borderRadius: 20, background: isOpen ? 'rgba(0,255,239,0.07)' : 'rgba(0,0,0,0.4)', border: isOpen ? '0.5px solid rgba(0,255,239,0.22)' : '0.5px solid rgba(239,68,68,0.2)', color: isOpen ? '#00FFEF' : '#F87171' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: isOpen ? '#00FFEF' : '#EF4444', display: 'inline-block' }} />
            {statusText}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.2rem' }}>
            {DISPLAY_HOURS.map((d, i) => {
              const isToday = todayIdx >= d.range[0] && todayIdx <= d.range[1];
              return (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                  {i > 0 && <div style={{ width: 0.5, height: 26, background: 'rgba(255,255,255,0.05)' }} />}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', color: isToday ? '#00FFEF' : '#2a3a4a' }}>{d.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: isToday ? '#00FFEF' : d.time === 'Zárva' ? '#2a3a4a' : '#4a6080' }}>{d.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulseDot { 0%,100%{opacity:1} 50%{opacity:0.25} }
      `}</style>
    </section>
  );
}
