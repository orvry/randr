'use client';
import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import Photo from './Photo';
import Garnish from './Garnish';
import { rich } from '../lib/rich';
import { met } from '../lib/story';

// deterministic tilt + nudge so the pile looks hand-placed but never changes between renders
const rot = (i) => ((i * 37) % 17) - 8;
const jx = (i) => ((i * 29) % 31) - 15;
const jy = (i) => ((i * 53) % 27) - 13;

export default function Polaroids() {
  const root = useRef(null);
  const stage = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const el = stage.current;
      el.classList.add('anim'); // switches CSS from a static gallery to the full-screen scrapbook
      const q = gsap.utils.selector(root);
      const vis = q('.pola').filter((p) => p.offsetParent !== null); // fewer photos fit on small screens
      const caps = vis.map((p) => p.querySelector('figcaption'));
      const small = window.innerWidth < 768;
      const each = 0.22;
      const landed = 0.7 + (vis.length - 1) * each + 0.9;
      vis.forEach((p, i) => gsap.set(p, { rotation: rot(i), x: jx(i), y: jy(i) }));

      gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: small ? '+=220%' : '+=420%', pin: true, scrub: 0.6, anticipatePin: 1 } })
        .from(q('.met-title'), { opacity: 0, y: 30, duration: 0.7 })
        .from(vis, {
          x: (i) => jx(i) + (i % 2 ? 1 : -1) * window.innerWidth * 0.6,
          y: (i) => jy(i) - window.innerHeight * 0.5,
          rotation: (i) => rot(i) + (i % 2 ? 25 : -25),
          opacity: 0, duration: 0.9, ease: 'back.out(1.1)', stagger: each,
        }, 0.7)
        .from(caps, { opacity: 0, y: 6, duration: 0.5, stagger: each }, 1.1)
        .to(q('.met-title'), { opacity: 0, duration: 1 }, 0.7 + each * 5)
        .to(vis, { opacity: 0.22, duration: 0.7 }, landed + 0.15)
        .fromTo(q('.met-story'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, landed + 0.35);
      return () => el.classList.remove('anim');
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="met" ref={root} className="ch light met">
      <div className="met-stage" ref={stage}>
        <Garnish />
        <h2 className="met-title">{met.title}</h2>
        <div className="polas">
          {met.polaroids.map((p, i) => (
            <figure key={p.src} className="pola" style={{ '--r': `${rot(i)}deg` }}>
              <div className="img"><Photo src={p.src} alt={p.alt} /></div>
              <figcaption>{rich(p.caption)}</figcaption>
            </figure>
          ))}
        </div>
        <p className="met-story">{rich(met.text)}</p>
      </div>
    </section>
  );
}
