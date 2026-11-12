'use client';

// Nav links jump to the matching point in the zoom sequence
function jump(id) {
  return (e) => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const fly = document.getElementById('fly');
    const scene = document.getElementById(id);
    if (!fly || !scene) return;
    e.preventDefault();
    const top = fly.getBoundingClientRect().top + window.scrollY + parseFloat(scene.dataset.p) * (fly.offsetHeight - window.innerHeight);
    window.scrollTo({ top, behavior: 'smooth' });
  };
}

export default function Header() {
  return (
    <header>
      <div className="logo">R&amp;R</div>
      <nav>
        <a href="#story" onClick={jump('story')}>Our story</a>
        <a href="#wedding" onClick={jump('wedding')}>The wedding</a>
        <a className="pill" href="#rsvp">RSVP</a>
      </nav>
    </header>
  );
}
