import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowOnHover?: boolean;
  interactive?: boolean;
  /** Renders a faint corner web lattice inside the card. */
  web?: boolean;
}

export function GlassCard({
  children,
  className,
  glowOnHover = true,
  interactive = false,
  web = true,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl p-6 transition-all duration-300 overflow-hidden",
        "bg-cyber-card/75 backdrop-blur-xl border border-cyber-border",
        "shadow-[0_8px_32px_0_rgba(0,0,0,0.55)]",
        glowOnHover && "hover:border-spider-red/45 hover:shadow-[0_0_28px_rgba(230,36,41,0.28)]",
        interactive && "hover:-translate-y-1 cursor-pointer",
        className
      )}
    >
      {/* Top subtle highlight line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-spider-red/40 to-transparent pointer-events-none" />

      {/* Corner web lattice */}
      {web && <CardWeb />}

      {children}
    </div>
  );
}

/** Small decorative quarter-web anchored in the card's top-right corner. */
function CardWeb() {
  const spokes = 5;
  const rings = [26, 46, 68, 92];

  /* Hub sits at (100, 0); threads fan from straight-down to straight-left. */
  const point = (radius: number, index: number) => {
    const angle = Math.PI / 2 + ((Math.PI / 2) / (spokes - 1)) * index;
    return { x: 100 + Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  };

  return (
    <svg
      viewBox="0 0 100 100"
      className="pointer-events-none absolute top-0 right-0 h-24 w-24 text-spider-red opacity-[0.16]"
      aria-hidden="true"
    >
      <g stroke="currentColor" fill="none" strokeWidth="1">
        {Array.from({ length: spokes }).map((_, i) => {
          const end = point(104, i);
          return <line key={`s-${i}`} x1="100" y1="0" x2={end.x} y2={end.y} />;
        })}
        {rings.map((radius, ri) => {
          const sag = radius * 0.08;
          let d = '';
          for (let i = 0; i < spokes - 1; i += 1) {
            const a = point(radius, i);
            const b = point(radius, i + 1);
            const mid = point(radius - sag, i + 0.5);
            if (i === 0) d += `M ${a.x} ${a.y} `;
            d += `Q ${mid.x} ${mid.y} ${b.x} ${b.y} `;
          }
          return <path key={`r-${ri}`} d={d} />;
        })}
      </g>
    </svg>
  );
}
