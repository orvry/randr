'use client';
import { useEffect, useState } from 'react';

const CHAPTERS = [
  ['hero', 'The announcement'], ['couple', 'Meet the couple'], ['met', 'The beginning'],
  ['adventures', 'The adventures'], ['proposal', 'The proposal'], ['invitation', 'The invitation'], ['rsvp', 'RSVP'],
];

// Small dots that show which chapter of the story you're in
export default function ChapterNav() {
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -45% 0px' }
    );
    CHAPTERS.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  return (
    <nav className="chapters" aria-label="Story chapters">
      {CHAPTERS.map(([id, label]) => (
        <a key={id} href={`#${id}`} className={active === id ? 'on' : ''} aria-label={label} aria-current={active === id ? 'true' : undefined}>
          <span>{label}</span>
        </a>
      ))}
    </nav>
  );
}
