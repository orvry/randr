// Swaying baby's breath sprigs tucked into the empty corners of the ivory chapters
const SPRIGS = [['sprigA', 'g1'], ['sprigB', 'g2'], ['cluster', 'g3'], ['sprigA', 'g4'], ['leaf', 'g5'], ['cluster', 'g6']];

export default function Garnish() {
  return (
    <div className="garnish" aria-hidden="true">
      {SPRIGS.map(([id, c]) => (
        <svg key={c} className={`g ${c}`}><use href={`#${id}`} /></svg>
      ))}
    </div>
  );
}
