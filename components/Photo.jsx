'use client';
import { useEffect, useRef, useState } from 'react';

// Shows the photo if it exists, otherwise a styled placeholder naming the file to add
export default function Photo({ src, alt, caption, className = '' }) {
  const [ok, setOk] = useState(true);
  const img = useRef(null);

  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setOk(false);
  }, []);

  return (
    <figure className={`photo ${className}`}>
      <div className="ph"><span>Add photo<code>public{src}</code></span></div>
      {ok && <img ref={img} src={src} alt={alt} onError={() => setOk(false)} />}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
