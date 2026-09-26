interface SpiderMarkProps {
  className?: string;
  /** Colour of the legs and body */
  color?: string;
  /** Thickness of the leg strokes, in viewBox units */
  strokeWidth?: number;
  glow?: boolean;
}

/**
 * Original eight-legged emblem drawn from scratch: a solid tapered body with
 * angular, mitre-jointed legs that splay out and taper to points.
 *
 * Deliberately not a reproduction of any existing character emblem — the leg
 * count and symmetry are generic to spiders, but the geometry, proportions and
 * silhouette here are our own.
 */
export function SpiderMark({
  className,
  color = 'currentColor',
  strokeWidth = 5,
  glow = false,
}: SpiderMarkProps) {
  /* Right-hand legs; each mirrors to the left. Sharp mitre joints give the
     mark its angular, emblem-like read rather than a soft organic curve. */
  const legs = [
    { d: 'M 10,-20 L 34,-44 L 50,-70', w: 1 },
    { d: 'M 13,-9 L 44,-27 L 72,-40', w: 1.05 },
    { d: 'M 13,3 L 46,9 L 76,2', w: 1.05 },
    { d: 'M 10,14 L 38,36 L 56,66', w: 1 },
  ];

  return (
    <svg viewBox="-100 -100 200 200" className={className} aria-hidden="true">
      {glow && (
        <defs>
          <filter id="spider-mark-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}

      <g filter={glow ? 'url(#spider-mark-glow)' : undefined}>
        {/* legs, mirrored across the vertical axis */}
        <g
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="miter"
          strokeMiterlimit={8}
        >
          {legs.map((leg, i) => (
            <path key={`r-${i}`} d={leg.d} strokeWidth={strokeWidth * leg.w} />
          ))}
          <g transform="scale(-1 1)">
            {legs.map((leg, i) => (
              <path key={`l-${i}`} d={leg.d} strokeWidth={strokeWidth * leg.w} />
            ))}
          </g>
        </g>

        {/* solid body: head, then an abdomen tapering to a point */}
        <g fill={color} stroke="none">
          <path d="M 0,-30 C 9,-30 13,-24 13,-18 C 13,-12 8,-8 0,-8 C -8,-8 -13,-12 -13,-18 C -13,-24 -9,-30 0,-30 Z" />
          <path d="M 0,-12 C 12,-4 17,14 0,54 C -17,14 -12,-4 0,-12 Z" />
          {/* short fangs */}
          <path d="M -7,-31 L -11,-40 L -4,-34 Z M 7,-31 L 11,-40 L 4,-34 Z" />
        </g>
      </g>
    </svg>
  );
}
