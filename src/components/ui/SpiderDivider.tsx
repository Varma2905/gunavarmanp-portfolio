interface SpiderDividerProps {
  className?: string;
}

/**
 * Full-width section divider: a thin glowing red web strand with a gentle
 * organic wave and a glowing diamond node at its centre.
 *
 * The SVG uses `preserveAspectRatio="none"` so the wave stretches to whatever
 * width the container gives it, and `vector-effect="non-scaling-stroke"` so the
 * strand stays exactly one hairline thick at every viewport size. The centre
 * diamond is a DOM element rather than an SVG shape so it can never be
 * horizontally squashed by that stretch.
 */
export function SpiderDivider({ className }: SpiderDividerProps) {
  return (
    <div
      className={`relative w-full overflow-hidden py-8 sm:py-10 ${className ?? ''}`}
      role="presentation"
      aria-hidden="true"
    >
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="relative h-6 w-full sm:h-7">
          <svg
            viewBox="0 0 1000 24"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full text-spider-red [mask-image:linear-gradient(to_right,transparent_0%,#000_6%,#000_94%,transparent_100%)]"
          >
            {/* fine web cross-ticks, echoing the strand under each heading */}
            <g
              stroke="currentColor"
              strokeWidth="1"
              strokeOpacity="0.4"
              vectorEffect="non-scaling-stroke"
            >
              <path d="M170 8.5 L170 15.5 M330 6.5 L330 17.5 M500 4 L500 20 M670 6.5 L670 17.5 M830 8.5 L830 15.5" />
            </g>

            {/* the strand itself */}
            <path
              d="M0 12 Q 125 4 250 12 T 500 12 T 750 12 T 1000 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              className="drop-shadow-[0_0_6px_rgba(230,36,41,0.9)]"
            />

            {/* slow travelling glint along the strand */}
            <path
              d="M0 12 Q 125 4 250 12 T 500 12 T 750 12 T 1000 12"
              fill="none"
              stroke="#ff8a8d"
              strokeWidth="1.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              className="web-glint drop-shadow-[0_0_8px_rgba(255,120,120,0.9)]"
            />
          </svg>

          {/* centre diamond node */}
          <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[1px] bg-spider-red shadow-[0_0_12px_rgba(230,36,41,1)] animate-pulse-glow" />
        </div>
      </div>
    </div>
  );
}
