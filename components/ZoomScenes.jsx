"use client";
import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import Words from "./Words";

const KINDS = [
  "sprigA",
  "cluster",
  "leaf",
  "sprigB",
  "bloom",
  "leafT",
  "sprigA",
  "cluster",
  "sprigB",
  "leaf",
];
const N = 3;
const ease = (u) => u * u * (3 - 2 * u);

// scale + opacity of a scene at local time t (t = progress * N - index)
function sceneState(t, i) {
  let s, o;
  if (t < -0.35) {
    s = 0.55;
    o = 0;
  } else if (t < 0) {
    const u = (t + 0.35) / 0.35;
    s = 0.55 + 0.45 * ease(u);
    o = u;
  } else if (t < 0.7 || i === N - 1) {
    s = 1 + (0.08 * Math.min(t, 1)) / 0.7;
    o = 1;
  } else if (t < 1.05) {
    const v = (t - 0.7) / 0.35;
    s = 1.08 + 1.4 * v * v;
    o = 1 - v;
  } else {
    s = 2.5;
    o = 0;
  }
  if (i === 0 && t < 0) {
    s = 1;
    o = 1;
  }
  return [s, o];
}

export default function ZoomScenes() {
  const flyRef = useRef(null);
  const hintRef = useRef(null);
  const sceneRefs = useRef([]);
  const objRefs = useRef([]);
  const [objs, setObjs] = useState([]);

  // Create the flying objects on the client only (random positions)
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const vw = window.innerWidth;
    const count = vw < 700 ? 22 : 42;
    const sf = Math.min(1, Math.max(0.6, vw / 1100));
    const list = [];
    for (let i = 0; i < count; i++) {
      const kind = KINDS[i % KINDS.length];
      const big = /sprig|cluster/.test(kind);
      let x, y;
      do {
        x = Math.random() * 1.3 - 0.65;
        y = Math.random() * 1.3 - 0.65;
      } while (Math.abs(x) < 0.2 && Math.abs(y) < 0.2);
      list.push({
        kind,
        x,
        y,
        size: ((big ? 130 : 80) + Math.random() * 60) * sf,
        z: 0.12 + (i / count) * 1.45 + (Math.random() - 0.5) * 0.05,
        rot: Math.random() * 360,
        rs: (Math.random() - 0.5) * 120,
      });
    }
    setObjs(list);
  }, []);

  // Scroll-driven camera: scenes zoom past, objects fly toward the viewer
  useEffect(() => {
    if (!objs.length) return;
    const fly = flyRef.current;
    let ps = 0,
      first = true,
      raf;
    const frame = () => {
      const r = fly.getBoundingClientRect();
      const vh = window.innerHeight,
        vw = window.innerWidth;
      if (r.bottom > -50 && r.top < vh + 50) {
        const target = Math.min(1, Math.max(0, -r.top / (r.height - vh)));
        ps += (target - ps) * (first ? 1 : 0.12);
        first = false;
        sceneRefs.current.forEach((el, i) => {
          if (!el) return;
          const [s, o] = sceneState(ps * N - i, i);
          el.style.transform = `scale(${s.toFixed(3)})`;
          el.style.opacity = o.toFixed(3);
          el.style.pointerEvents = o > 0.6 ? "auto" : "none";
        });
        if (hintRef.current)
          hintRef.current.style.opacity = Math.max(0, 1 - ps * 25);
        const c = ps * 1.5,
          cx = vw / 2,
          cy = vh / 2;
        objs.forEach((o, i) => {
          const el = objRefs.current[i];
          if (!el) return;
          const d = o.z - c;
          if (d < 0.07) {
            el.style.opacity = 0;
            return;
          }
          const sc = 0.25 / d;
          const op =
            Math.max(0, Math.min(1, (1.7 - d) / 0.5, (d - 0.07) / 0.2)) * 0.95;
          el.style.opacity = op.toFixed(2);
          el.style.transform = `translate3d(${(cx + o.x * vw * sc - o.size / 2).toFixed(1)}px,${(cy + o.y * vh * sc - o.size / 2).toFixed(1)}px,0) scale(${sc.toFixed(3)}) rotate(${(o.rot + ps * o.rs).toFixed(1)}deg)`;
          el.style.filter =
            d < 0.4 ? `blur(${((0.4 - d) * 16).toFixed(1)}px)` : "none";
        });
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [objs]);

  const setScene = (i) => (el) => {
    sceneRefs.current[i] = el;
  };

  return (
    <div id="fly" ref={flyRef}>
      <div className="stage">
        <div className="fly-layer">
          {objs.map((o, i) => (
            <div
              key={i}
              className="obj"
              ref={(el) => {
                objRefs.current[i] = el;
              }}
              style={{ width: o.size, height: o.size, opacity: 0 }}
            >
              <svg>
                <use href={`#${o.kind}`} />
              </svg>
            </div>
          ))}
        </div>

        <div className="scene" ref={setScene(0)} style={{ opacity: 1 }}>
          <Reveal always className="content">
            <div className="eyebrow fade">Save the date · March 21, 2027</div>
            <h1>
              <Words>We’re getting married</Words>
            </h1>
            <p className="lead fade">
              Russelle &amp; Rosie are tying the knot in a garden, and it’s only
              fun if you’re there.
            </p>
          </Reveal>
          <div className="scroll-hint" ref={hintRef}>
            Scroll to zoom in
          </div>
        </div>

        <div
          className="scene"
          id="story"
          data-p=".4"
          ref={setScene(1)}
          style={{ opacity: 0 }}
        >
          <Reveal always className="content">
            <h2>
              <Words>
                Being us means we love to laugh, wander and grow things
              </Words>
            </h2>
            <p className="lead fade">
              We said yes, and now we want to throw the best garden party of our
              lives with everyone we love.
            </p>
          </Reveal>
        </div>

        <div
          className="scene"
          id="wedding"
          data-p=".85"
          ref={setScene(2)}
          style={{ opacity: 0 }}
        >
          <Reveal always className="content">
            <h2>
              <Words>And we want the people we love to be there</Words>
            </h2>
            <div className="cards fade">
              <div className="card">
                <small>When</small>
                <h3>Sun, March 21</h3>
                <p>
                  Ceremony at 5:00 PM, followed by dinner and dancing until
                  late.
                </p>
              </div>
              <div className="card">
                <small>Where</small>
                <h3>Metro Manila</h3>
                <p>
                  Philippines. Full venue details will follow with your
                  invitation.
                </p>
              </div>
              <div className="card">
                <small>Dress code</small>
                <h3>Garden formal</h3>
                <p>
                  Earthy tones and comfy shoes. There will be grass and a dance
                  floor.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
