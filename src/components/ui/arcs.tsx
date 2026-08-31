/**
 * Motif d'arcs repris du logo (violet, teal, orange) utilise comme
 * element decoratif de fond. Purement ornemental, donc masque aux
 * technologies d'assistance.
 */
export function Arcs({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 240"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M12 232C12 111 100 20 210 20s178 91 178 212"
        stroke="var(--color-brand)"
        strokeWidth="26"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M62 232c0-92 66-166 148-166s148 74 148 166"
        stroke="var(--color-teal)"
        strokeWidth="22"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M112 232c0-63 44-114 98-114s98 51 98 114"
        stroke="var(--color-orange)"
        strokeWidth="18"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}

/** Petit soleil du logo, decoratif. */
export function Sun({ className }: { className?: string }) {
  const rays = Array.from({ length: 16 }, (_, index) => index * 22.5);

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <circle cx="50" cy="50" r="17" fill="var(--color-sun)" />
      {rays.map((angle) => (
        <line
          key={angle}
          x1="50"
          y1="26"
          x2="50"
          y2="12"
          stroke="var(--color-sun)"
          strokeWidth="3.5"
          strokeLinecap="round"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
    </svg>
  );
}
