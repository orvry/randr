'use client';
import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import Photo from './Photo';
import Garnish from './Garnish';
import { rich } from '../lib/rich';
import { couple } from '../lib/story';

export default function Couple() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  // headline on ivory → split-screen panels slide in → names → panels draw together
  // → one big shared photo → a long, slow fade out
  const headOp = useTransform(p, [0, 0.06, 0.16, 0.26], [0, 1, 1, 0]);
  const xL = useTransform(p, [0.1, 0.3], ['-50vw', '0vw']);
  const xR = useTransform(p, [0.1, 0.3], ['50vw', '0vw']);
  const scale = useTransform(p, [0.48, 0.74], [1, 0.62]);
  const panelOp = useTransform(p, [0.64, 0.8], [1, 0]);
  const capOp = useTransform(p, [0.3, 0.4, 0.5, 0.58], [0, 1, 1, 0]);
  const togOp = useTransform(p, [0.62, 0.76, 0.84, 1], [0, 1, 1, 0]);
  const togScale = useTransform(p, [0.62, 1], [0.94, 1.06]);
  const anim = !reduce;
  const S = (v) => (anim ? v : undefined);

  return (
    <section id="couple" ref={ref} className={`ch light couple${anim ? ' anim' : ''}`}>
      <div className="couple-stage">
        <Garnish />
        <motion.div className="couple-head" style={{ opacity: S(headOp) }}>
          <div className="eyebrow">{couple.eyebrow}</div>
          <h2>{couple.title}</h2>
        </motion.div>

        <div className="pair">
          {couple.people.map((pr, i) => (
            <motion.div
              key={pr.name}
              className="person"
              style={{ x: S(i ? xR : xL), scale: S(scale), originX: i ? 0 : 1, originY: 0.5, opacity: S(panelOp) }}
            >
              <button
                type="button"
                className={'portrait' + (open === i ? ' open' : '')}
                aria-expanded={open === i}
                onMouseEnter={() => setOpen(i)}
                onMouseLeave={() => setOpen(null)}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <Photo src={pr.src} alt={pr.alt} />
                <motion.span className="cap" style={{ opacity: S(capOp) }}>
                  <b className="pname">{pr.name}</b>
                  <span className="intro">{rich(pr.intro)}</span>
                  <small className="tap">Hover or tap to meet {pr.name}</small>
                </motion.span>
              </button>
            </motion.div>
          ))}
        </div>

        <motion.figure className="together" style={{ opacity: S(togOp), scale: S(togScale) }}>
          <Photo src={couple.together.src} alt={couple.together.alt} />
          <figcaption>{couple.together.caption}</figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
