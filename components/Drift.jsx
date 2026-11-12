'use client';
import { useEffect, useRef, useState } from 'react';

const KINDS = ['sprigA', 'sprigB', 'cluster', 'leaf', 'sprigA', 'bloom', 'leafT', 'cluster', 'sprigB'];

// Gently drifting garden objects behind a section (used behind the RSVP form)
export default function Drift({ count = 14 }) {
  const layerRef = useRef(null);
  const refs = useRef([]);
  const [objs, setObjs] = useState([]);

  useEffect(() => {
    const list = [];
    for (let k = 0; k < count; k++) {
      const kind = KINDS[k % KINDS.length];
      const big = /sprig|cluster/.test(kind);
      const size = (big ? 80 : 40) + Math.random() * (big ? 90 : 60);
      list.push({ kind, size, left: Math.random() * 96, top: Math.random() * 92, speed: Math.random() * 0.7 - 0.25, rot: Math.random() * 360, rs: (Math.random() - 0.5) * 0.18 });
    }
    setObjs(list);
  }, [count]);

  useEffect(() => {
    if (!objs.length) return;
    const sec = layerRef.current.parentElement;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let mx = 0, my = 0, tx = 0, ty = 0, raf;
    const onMove = (e) => { tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5; };
    addEventListener('pointermove', onMove, { passive: true });
    const frame = () => {
      mx += (tx - mx) * 0.06; my += (ty - my) * 0.06;
      const vh = innerHeight, r = sec.getBoundingClientRect();
      if (r.bottom > -200 && r.top < vh + 200) {
        const p = vh / 2 - (r.top + r.height / 2);
        objs.forEach((o, i) => {
          const el = refs.current[i];
          if (!el) return;
          const depth = o.size / 100;
          el.style.transform = `translate3d(${(mx * 60 * depth).toFixed(1)}px,${(-p * o.speed + my * 30 * depth).toFixed(1)}px,0) rotate(${(o.rot + p * o.rs).toFixed(1)}deg)`;
        });
      }
      if (!reduce) raf = requestAnimationFrame(frame);
    };
    frame();
    if (!reduce) raf = requestAnimationFrame(frame); else addEventListener('scroll', frame, { passive: true });
    return () => { cancelAnimationFrame(raf); removeEventListener('pointermove', onMove); removeEventListener('scroll', frame); };
  }, [objs]);

  return (
    <div className="layer" ref={layerRef}>
      {objs.map((o, i) => (
        <div key={i} className="obj" ref={(el) => { refs.current[i] = el; }} style={{ width: o.size, height: o.size, left: `${o.left}%`, top: `${o.top}%` }}>
          <svg><use href={`#${o.kind}`} /></svg>
        </div>
      ))}
    </div>
  );
}
