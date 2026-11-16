const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export const ArrowUpRight = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export const ArrowDown = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <path d="M12 5v14M5 12l7 7 7-7" />
  </svg>
);

export const ArrowRight = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export const Play = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M7 5v14l12-7z" />
  </svg>
);

export const Mail = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

export const Doc = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <path d="M6 3h8l4 4v14H6z" />
    <path d="M14 3v4h4M9 12h6M9 16h6" />
  </svg>
);
