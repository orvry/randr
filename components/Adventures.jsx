'use client';
import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import Photo from './Photo';
import Garnish from './Garnish';
import { rich } from '../lib/rich';
import { adventures } from '../lib/story';

const IVORY = '#F7F4EC', CHAMPAGNE = '#EADFC8', DEEP = '#2f3517';

export default function Adventures() {
  const root = useRef(null);
  const pin = useRef(null);
  const track = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    // Desktop: vertical scroll drives a horizontal film reel. Phones / reduced motion: native swipe row.
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const p = pin.current, t = track.current;
      p.classList.add('anim');
      const cards = [...t.children];
      const last = cards[cards.length - 1];
      const media = last.querySelector('.mem-media');
      const frame = last.querySelector('.frame');
      const title = p.querySelector('.adv-title');
      const dist = () => Math.max(0, last.offsetLeft + last.offsetWidth / 2 - window.innerWidth / 2);
      // scale that makes the last photo cover the whole screen, and the nudge that centres it
      const cover = () => Math.max(window.innerWidth / frame.offsetWidth, window.innerHeight / frame.offsetHeight) * 1.1;
      const lift = () => window.innerHeight / 2 - (media.offsetTop + frame.offsetTop + frame.offsetHeight / 2);

      let tl;
      // photos grow and captions fade in as they reach the middle of the screen
      const focus = () => {
        if (tl && tl.time() > 2) return; // the finale takes over
        cards.forEach((c) => {
          const r = c.getBoundingClientRect();
          const k = Math.max(0, 1 - Math.abs(r.left + r.width / 2 - window.innerWidth / 2) / (window.innerWidth * 0.45));
          gsap.set(c.querySelector('.mem-media'), { scale: 1 + 0.08 * k });
          gsap.set(c.querySelector('.mem-info'), { opacity: 0.2 + 0.8 * k });
        });
      };

      tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top top', end: () => '+=' + Math.round(dist() * 1.45), pin: true, scrub: 0.5, invalidateOnRefresh: true, onUpdate: focus, onRefresh: focus },
      });
      tl.fromTo(p, { backgroundColor: IVORY }, { backgroundColor: CHAMPAGNE, duration: 1 }, 0)
        .to(t, { x: () => -dist(), duration: 2 }, 0)
        // finale: everything else fades, the last photo grows to fill the screen and darkens,
        // so the proposal chapter opens on a photograph (no empty screen in between)
        .to([title, ...cards.slice(0, -1), last.querySelector('.mem-info')], { opacity: 0, duration: 0.5 }, 2)
        .to(frame, { scale: cover, y: lift, '--ov': 0.55, duration: 0.9, ease: 'power2.inOut' }, 2)
        .to(p, { backgroundColor: DEEP, duration: 0.9 }, 2);
      return () => p.classList.remove('anim');
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="adventures" ref={root} className="ch light adv">
      <div className="adv-pin" ref={pin}>
        <Garnish />
        <h2 className="adv-title">{adventures.title}</h2>
        <div className="adv-track" ref={track}>
          {adventures.items.map((m) => (
            <article key={m.src} className={`mem ${m.variant}`}>
              <div className="mem-media"><div className="frame"><Photo src={m.src} alt={m.alt} /></div></div>
              <div className="mem-info">
                <small>{rich(m.date)} · {rich(m.place)}</small>
                <p>{m.caption}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="adv-line" aria-hidden="true" />
      </div>
    </section>
  );
}
