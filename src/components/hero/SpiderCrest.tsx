import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * The hero's right-hand centrepiece: a spun web disc with the site's spider
 * emblem at its centre, orbiting signal nodes and a hairline HUD. The web,
 * rings and nodes are generated here; the centre emblem is the supplied
 * asset at public/spider-logo.png.
 */
export function SpiderCrest() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    const onMove = (event: MouseEvent) => {
      const node = containerRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: Math.max(-1, Math.min(1, px)) * 12, y: Math.max(-1, Math.min(1, py)) * -12 });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const spokes = 16;
  const rings = [58, 96, 134, 172, 210];

  const point = (radius: number, index: number) => {
    const angle = (Math.PI * 2 * index) / spokes - Math.PI / 2;
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  };

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full min-h-[380px] sm:min-h-[520px] items-center justify-center"
    >
      {/* ambient glow behind the crest */}
      <div className="absolute h-[70%] w-[70%] rounded-full ambient-red blur-3xl animate-pulse-glow" />
      <div className="absolute h-[45%] w-[45%] translate-x-16 translate-y-16 rounded-full ambient-blue blur-3xl" />

      <motion.div
        className="relative w-[min(88vw,520px)] aspect-square"
        style={{ perspective: 1000 }}
        animate={{ rotateY: tilt.x, rotateX: tilt.y }}
        transition={{ type: 'spring', stiffness: 60, damping: 18 }}
      >
        {/* ---- the spun web ---- */}
        <svg viewBox="-260 -260 520 520" className="absolute inset-0 h-full w-full">
          <defs>
            <radialGradient id="crest-fade" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff3b3f" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#e62429" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#2b6cff" stopOpacity="0.05" />
            </radialGradient>
            <filter id="crest-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g stroke="url(#crest-fade)" fill="none" strokeWidth="1.1" filter="url(#crest-glow)">
            {/* anchor threads */}
            {Array.from({ length: spokes }).map((_, i) => {
              const end = point(238, i);
              return (
                <line
                  key={`spoke-${i}`}
                  x1="0"
                  y1="0"
                  x2={end.x}
                  y2={end.y}
                  className="web-stroke"
                  style={{ animationDelay: `${i * 0.045}s` }}
                />
              );
            })}

            {/* sagging cross threads */}
            {rings.map((radius, ringIndex) => {
              const sag = radius * 0.085;
              let d = '';
              for (let i = 0; i <= spokes; i += 1) {
                const a = point(radius, i);
                const b = point(radius, i + 1);
                const mid = point(radius - sag, i + 0.5);
                if (i === 0) d += `M ${a.x} ${a.y} `;
                d += `Q ${mid.x} ${mid.y} ${b.x} ${b.y} `;
              }
              return (
                <path
                  key={`ring-${ringIndex}`}
                  d={d}
                  className="web-stroke"
                  strokeWidth={ringIndex > 2 ? 0.85 : 1.15}
                  style={{ animationDelay: `${0.35 + ringIndex * 0.12}s` }}
                />
              );
            })}
          </g>
        </svg>

        {/* ---- rotating HUD rings ---- */}
        <div className="absolute inset-[8%] rounded-full border border-spider-red/25 animate-spin-slow [border-style:dashed]" />
        <div className="absolute inset-[20%] rounded-full border border-spider-blue/25 animate-spin-reverse [border-style:dashed]" />

        {/* orbiting signal nodes */}
        <div className="absolute inset-[8%] animate-spin-slow">
          <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-spider-red shadow-[0_0_16px_#e62429]" />
          <span className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-spider-blue shadow-[0_0_14px_#2b6cff]" />
        </div>

        {/* ---- centre emblem ---- */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="relative flex h-[42%] w-[42%] items-center justify-center rounded-full border border-spider-red/30 bg-black/50 backdrop-blur-xl shadow-[0_0_60px_-10px_rgba(230,36,41,0.75)]">
            <img
              src="/spider-logo.png"
              alt=""
              draggable={false}
              className="h-[62%] w-[62%] object-contain select-none drop-shadow-[0_0_18px_rgba(230,36,41,0.9)]"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* HUD caption */}
      <div className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-spider-red/30 bg-black/70 px-4 py-1.5 font-mono text-[11px] tracking-widest text-spider-crimson backdrop-blur-md shadow-[0_0_18px_rgba(230,36,41,0.35)]">
        <span className="h-2 w-2 animate-ping rounded-full bg-spider-red" />
        <span>SPIDER-SENSE ONLINE</span>
      </div>
    </div>
  );
}
