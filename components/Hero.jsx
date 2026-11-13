'use client';
import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import Photo from './Photo';
import Owl from './Owl';
import { hero } from '../lib/story';

const Chars = ({ text }) => (
  <span className="mask">
    {[...text].map((c, i) => <span className="hn" key={i}>{c}</span>)}
  </span>
);

export default function Hero() {
  const root = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root);
      // cinematic reveal: slow settle, foliage drifts up, names, headline, date last
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo(q('.hero-bg'), { scale: 1.05 }, { scale: 1, duration: 2.6, ease: 'power2.out' }, 0)
        .from(q('.foliage'), { y: 50, opacity: 0, duration: 1.5, stagger: 0.15 }, 0.4)
        .from(q('.hn'), { yPercent: 115, duration: 1, stagger: 0.06 }, 1)
        .from(q('.hh'), { opacity: 0, y: 14, duration: 1.2, stagger: 0.2 }, 2)
        .from(q('.hd'), { opacity: 0, y: 10, duration: 1 }, 2.9)
        .from(q('.hint'), { opacity: 0, duration: 1 }, 3.3)
        .from(q('.owl-hero'), { opacity: 0, y: 20, duration: 1.1 }, 3.5);
      // parallax on scroll
      gsap.to(q('.hero-bg'), { yPercent: -10, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to(q('.hero-copy'), { yPercent: -25, opacity: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: '75% top', scrub: true } });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="hero" ref={root} className="ch hero">
      <div className="hero-bg"><Photo {...hero.photo} /></div>
      <div className="hero-shade" />
      {['sprigA f1', 'sprigB f2', 'leaf f3', 'cluster f4'].map((s) => {
        const [id, cls] = s.split(' ');
        return <div key={cls} className={`foliage ${cls}`}><svg><use href={`#${id}`} /></svg></div>;
      })}
      <Owl className="owl-hero" />
      <div className="hero-copy">
        <h1 className="hero-names">
          <Chars text={hero.names[0]} /> <span className="amp"><Chars text="&" /></span> <Chars text={hero.names[1]} />
        </h1>
        <p className="hh">{hero.headline}</p>
        <p className="hh sub">{hero.tagline}</p>
        <p className="hd">{hero.date}</p>
      </div>
      <div className="hint">Scroll</div>
    </section>
  );
}
