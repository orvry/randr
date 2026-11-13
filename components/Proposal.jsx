'use client';
import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import Photo from './Photo';
import { rich } from '../lib/rich';
import { proposal } from '../lib/story';

export default function Proposal() {
  const root = useRef(null);
  const stage = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const el = stage.current;
      el.classList.add('anim');
      const q = gsap.utils.selector(root);
      const heart = q('.heart')[0];
      const len = heart.getTotalLength();
      gsap.set(heart, { strokeDasharray: len, strokeDashoffset: len });
      const small = window.innerWidth < 768;

      // the photo is visible from the first frame (blurred), so the hand-over from the
      // adventure reel is photo → photo; then it slowly sharpens while the words arrive
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: small ? '+=170%' : '+=300%', pin: true, scrub: 0.8, anticipatePin: 1 } })
        .fromTo(q('.prop-bg'), { filter: 'blur(18px)', scale: 1.1 }, { filter: 'blur(0px)', scale: 1, duration: 1.6, ease: 'power1.out' })
        .from(q('.prop-eyebrow'), { opacity: 0, duration: 0.5 }, '-=0.8')
        .from(q('.prop-title'), { opacity: 0, y: 24, duration: 0.9 })
        .from(q('.prop-meta > *'), { opacity: 0, y: 12, stagger: 0.25, duration: 0.6 })
        .from(q('.prop-text'), { opacity: 0, y: 12, duration: 0.6 })
        .from(q('.ring-wrap'), { opacity: 0, scale: 0.8, duration: 0.8 })
        .to(heart, { strokeDashoffset: 0, duration: 1.2, ease: 'power1.inOut' })
        .to([q('.prop-copy'), q('.ring-wrap')], { opacity: 0.1, duration: 0.8 }, '+=0.3')
        .from(q('.yes'), { opacity: 0, scale: 0.92, duration: 1.2 });
      return () => el.classList.remove('anim');
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="proposal" ref={root} className="ch dark proposal">
      <div className="prop-stage" ref={stage}>
        <div className="prop-bg"><Photo {...proposal.photo} /></div>
        <div className="prop-shade" />
        <div className="prop-copy">
          <div className="eyebrow prop-eyebrow">{proposal.eyebrow}</div>
          <h2 className="prop-title">{proposal.title}</h2>
          <div className="prop-meta">
            <div><small>When</small>{rich(proposal.date)}</div>
            <div><small>Where</small>{rich(proposal.place)}</div>
          </div>
          <p className="prop-text">{rich(proposal.text)}</p>
        </div>
        <div className="ring-wrap">
          <Photo {...proposal.ring} />
          <svg viewBox="0 0 100 100" aria-hidden="true"><path className="heart" d="M50 88C18 62 8 44 8 30a21 21 0 0 1 42-4 21 21 0 0 1 42 4c0 14-10 32-42 58z" /></svg>
        </div>
        <div className="yes"><span>{proposal.yes}</span></div>
      </div>
    </section>
  );
}
