// UATC brand mark — varsity U in a circular travel badge.
// Road-with-horizon in the U's negative space (per Big Man spec 2026-09-08).
// Flat, two-color, gradient-free: mark colors come from c1/c2 props ONLY.
// No text — pure mark, recolors to any college pair.
export function UatcMark({
  c1 = "#faf7f0", // mark foreground (ring, U, dashes, sun)
  c2 = "#0a0a0a", // field (badge interior, road)
  className,
  title,
}: {
  c1?: string;
  c2?: string;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label={title || "UATC"}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* badge field */}
      <circle cx="50" cy="50" r="48" fill={c2} />
      {/* ring */}
      <circle cx="50" cy="50" r="44" fill="none" stroke={c1} strokeWidth="5.5" />
      {/* varsity U — slab serif stems, chamfered feet */}
      <path
        d="M30 26 h9 v32 c0 4 1.5 6 4 7.5 c2.5 1.5 4.5 2 7 2 s4.5 -0.5 7 -2 c2.5 -1.5 4 -3.5 4 -7.5 v-32 h9 v33 c0 8 -2.5 13.5 -7 16.5 c-4 2.7 -8.5 4 -13 4 s-9 -1.3 -13 -4 c-4.5 -3 -7 -8.5 -7 -16.5 z"
        fill={c1}
      />
      {/* slab serifs (top caps) */}
      <rect x="27" y="21" width="15" height="6" fill={c1} />
      <rect x="58" y="21" width="15" height="6" fill={c1} />
      {/* road in the U's negative space: tapering toward a sun/horizon */}
      <path d="M47.2 74 L45.5 46 L54.5 46 L52.8 74 Z" fill={c2} />
      {/* dashed lane markings up the road */}
      <rect x="49.4" y="66" width="1.6" height="4" fill={c1} />
      <rect x="49.4" y="58" width="1.6" height="4" fill={c1} />
      <rect x="49.4" y="50" width="1.6" height="4" fill={c1} />
      {/* horizon sun at the road's end */}
      <circle cx="50" cy="43" r="3.4" fill={c1} />
      <rect x="43" y="46" width="14" height="1.4" fill={c1} opacity="0.85" />
    </svg>
  );
}

// Travel Stripe — the end-zone pair as a section device.
// a/b are the two stripe colors; defaults are the UATC red pair.
export function TravelStripe({
  a = "#c8102e",
  b = "#faf7f0",
  className = "",
  style,
}: {
  a?: string;
  b?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      className={`travel-stripe ${className}`}
      style={{ "--stripe-a": a, "--stripe-b": b, ...style } as React.CSSProperties}
    />
  );
}