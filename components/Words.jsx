// Splits text into words that rise in when an ancestor has the "in" class
export default function Words({ children, start = 0 }) {
  return String(children)
    .split(' ')
    .filter(Boolean)
    .map((w, i) => (
      <span key={i}>
        <span className="w"><span style={{ '--i': start + i }}>{w}</span></span>{' '}
      </span>
    ));
}
