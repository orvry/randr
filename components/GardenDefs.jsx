// SVG artwork (baby's breath sprigs, leaves, blossom) referenced with <use href="#id">
const G = '#5F6831';
const T = '#9A7A54';

const cluster = (x, y) =>
  [[0, 0], [5, -3.5], [-5, -3], [3.5, 4.5], [-4, 4.5], [0, -7]].map((o, i) => (
    <use key={i} href="#f" x={x + o[0]} y={y + o[1]} />
  ));

function Sprig({ stems, tips, flip }) {
  const inner = (
    <>
      <g fill="none" stroke={G} strokeWidth="1.6" strokeLinecap="round">
        {stems.map((d, i) => <path key={i} d={d} />)}
      </g>
      {tips.map((t, i) => <g key={i}>{cluster(t[0], t[1])}</g>)}
    </>
  );
  return flip ? <g transform="translate(100 0) scale(-1 1)">{inner}</g> : inner;
}

const A = {
  stems: ['M50 98C50 70 48 50 46 30', 'M49 74C60 64 70 58 76 40', 'M48 62C38 52 28 48 24 30', 'M47 46C54 36 60 28 62 14', 'M47 38C40 28 36 20 34 10', 'M50 84C40 76 30 72 20 58', 'M50 86C62 80 72 78 82 66'],
  tips: [[46, 28], [76, 38], [24, 28], [62, 12], [34, 8], [20, 56], [82, 64]],
};
const C = {
  stems: ['M50 98L50 60', 'M50 80L22 48', 'M50 80L78 48', 'M50 66L36 28', 'M50 66L64 28', 'M50 62L50 20', 'M30 56L12 40', 'M70 56L88 40'],
  tips: [[22, 46], [78, 46], [36, 26], [64, 26], [50, 18], [12, 38], [88, 38], [50, 58]],
};

export default function GardenDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <g id="f">
          <circle r="4.2" fill="#fffefa" stroke="#b9b4a2" strokeWidth=".8" />
          <circle r="1.1" fill={T} />
        </g>
        <symbol id="sprigA" viewBox="0 0 100 100"><Sprig {...A} /></symbol>
        <symbol id="sprigB" viewBox="0 0 100 100"><Sprig {...A} flip /></symbol>
        <symbol id="cluster" viewBox="0 0 100 100"><Sprig {...C} /></symbol>
        <symbol id="leaf" viewBox="0 0 100 100">
          <path d="M12 88C8 40 40 8 90 10c2 48-30 82-78 78z" fill={G} />
          <path d="M14 86C40 60 60 40 82 18" stroke="#c9d1a0" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".7" />
        </symbol>
        <symbol id="leafT" viewBox="0 0 100 100">
          <path d="M88 88C92 40 60 8 10 10c-2 48 30 82 78 78z" fill={T} />
          <path d="M86 86C60 60 40 40 18 18" stroke="#e6d3b8" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".7" />
        </symbol>
        <symbol id="bloom" viewBox="0 0 100 100">
          <g fill="#fffefa" stroke="#b9b4a2" strokeWidth="1.5">
            <circle cx="50" cy="26" r="16" /><circle cx="73" cy="43" r="16" /><circle cx="64" cy="70" r="16" />
            <circle cx="36" cy="70" r="16" /><circle cx="27" cy="43" r="16" />
          </g>
          <circle cx="50" cy="52" r="10" fill={T} />
        </symbol>
      </defs>
    </svg>
  );
}
