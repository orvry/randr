'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import Photo from './Photo';
import Garnish from './Garnish';
import Owl from './Owl';
import { rich } from '../lib/rich';
import { invitation } from '../lib/story';

const list = { hidden: {}, show: { transition: { staggerChildren: 0.18, delayChildren: 0.9 } } };
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.7 } } };

export default function Invitation() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [open, setOpen] = useState(false);

  // the envelope opens shortly after it scrolls into view
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setOpen(true), reduce ? 0 : 900);
    return () => clearTimeout(t);
  }, [inView, reduce]);

  return (
    <section id="invitation" ref={ref} className="ch light invitation">
      <div className="inv-bg"><Photo {...invitation.photo} /></div>
      <Garnish />
      <div className="inv-stage">
        <motion.div
          className={'env' + (open ? ' open' : '')}
          initial={reduce ? false : { opacity: 0, y: 40, scale: 0.92 }}
          animate={inView || reduce ? { opacity: 1, y: 0, scale: 1 } : undefined}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          onClick={() => setOpen((o) => !o)}
        >
          <div className="env-back" />
          <div className="env-card"><span>R&amp;R</span><small>Together with their families</small></div>
          <div className="env-front" />
          <div className="env-flap" />
          <Owl className="env-owl" />
        </motion.div>

        <motion.div className="inv-details" variants={list} initial={reduce ? 'show' : 'hidden'} animate={open || reduce ? 'show' : 'hidden'}>
          <motion.div variants={item} className="eyebrow">{invitation.eyebrow}</motion.div>
          <motion.h2 variants={item}>{invitation.title}</motion.h2>
          <motion.p variants={item} className="inv-text">{rich(invitation.text)}</motion.p>
          <motion.div variants={item} className="facts">
            {invitation.facts.map((f) => <div key={f.label}><small>{f.label}</small>{f.value}</div>)}
          </motion.div>
          <motion.a variants={item} className="cta" href="#rsvp">RSVP</motion.a>
        </motion.div>
      </div>
    </section>
  );
}
