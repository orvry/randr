// Little owl accent (inline SVG so the blink animation can be styled from CSS)
export default function Owl({ className = '' }) {
  return (
    <svg className={`owl ${className}`} viewBox="0 0 100 124" aria-hidden="true">
      <path d="M22 62C8 80 12 102 30 112C27 94 27 78 34 64Z" fill="#7d6243" />
      <path d="M78 62C92 80 88 102 70 112C73 94 73 78 66 64Z" fill="#7d6243" />
      <ellipse cx="50" cy="80" rx="29" ry="34" fill="#9A7A54" />
      <ellipse cx="50" cy="86" rx="18" ry="25" fill="#EADFC8" />
      <path d="M40 72q5 5 10 0q5 5 10 0M38 84q6 5 12 0q6 5 12 0M40 96q5 5 10 0q5 5 10 0" fill="none" stroke="#b89a74" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M27 24L23 6L41 17Z" fill="#9A7A54" />
      <path d="M73 24L77 6L59 17Z" fill="#9A7A54" />
      <circle cx="50" cy="41" r="26" fill="#9A7A54" />
      <circle cx="39" cy="41" r="13" fill="#F7F4EC" />
      <circle cx="61" cy="41" r="13" fill="#F7F4EC" />
      <circle cx="39" cy="41" r="7" fill="#5F6831" /><circle cx="61" cy="41" r="7" fill="#5F6831" />
      <circle cx="39" cy="41" r="3.4" fill="#2b3014" /><circle cx="61" cy="41" r="3.4" fill="#2b3014" />
      <circle cx="37.5" cy="39" r="1.3" fill="#fff" /><circle cx="59.5" cy="39" r="1.3" fill="#fff" />
      <ellipse className="lid" cx="39" cy="41" rx="8" ry="8" fill="#F7F4EC" />
      <ellipse className="lid" cx="61" cy="41" rx="8" ry="8" fill="#F7F4EC" />
      <path d="M45.5 49H54.5L50 58Z" fill="#c9963a" />
      <ellipse cx="40" cy="115" rx="7" ry="3.2" fill="#c9963a" />
      <ellipse cx="60" cy="115" rx="7" ry="3.2" fill="#c9963a" />
    </svg>
  );
}
