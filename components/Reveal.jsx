'use client';
import { useEffect, useRef, useState } from 'react';

// Adds the "in" class once visible (or immediately with `always`)
export default function Reveal({ className = '', always = false, children, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (always) { setShown(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); io.disconnect(); }
    }, { threshold: 0.25 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [always]);

  return <div ref={ref} className={className + (shown ? ' in' : '')} {...rest}>{children}</div>;
}
