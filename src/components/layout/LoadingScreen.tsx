import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete?: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const bootLogs = [
    "CALIBRATING WEB-SHOOTERS...",
    "SPIDER-SENSE CALIBRATED...",
    "SUIT SYSTEMS ONLINE...",
    "WELCOME TO THE WEB..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setLoading(false);
            onComplete?.();
          }, 600);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const logIndex = Math.min(Math.floor((progress / 100) * bootLogs.length), bootLogs.length - 1);
    setLogs((prev) => {
      if (!prev.includes(bootLogs[logIndex])) {
        return [...prev, bootLogs[logIndex]];
      }
      return prev;
    });
  }, [progress]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          exit={{ opacity: 0, scale: 1.08, filter: 'blur(8px)' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#05060b] p-6 select-none"
        >
          {/* Web pattern backdrop */}
          <div className="absolute inset-0 web-mesh opacity-40" />
          <div className="absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 ambient-red blur-3xl opacity-70" />
          <WelcomeWeb className="absolute left-1/2 top-1/2 h-[110vmin] w-[110vmin] -translate-x-1/2 -translate-y-1/2 opacity-[0.35]" />
          <div className="absolute inset-0 cine-vignette" />

          <div className="relative flex w-full max-w-md flex-col items-center">
            {/* Spider emblem with pulsing red glow */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0, rotate: -12 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative mb-8 flex h-28 w-28 items-center justify-center"
            >
              <div className="absolute inset-0 rounded-full border border-spider-red/30 [border-style:dashed] animate-spin-slow" />
              <div className="absolute inset-3 rounded-full ambient-red blur-xl animate-pulse-glow" />
              <img
                src="/spider-logo.png"
                alt=""
                draggable={false}
                className="relative h-20 w-20 object-contain select-none drop-shadow-[0_0_18px_rgba(230,36,41,0.9)]"
              />
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="font-display text-2xl font-bold tracking-[0.18em] text-gradient-spider mb-2 text-center"
            >
              GUNAVARMAN PALANISAMY
            </motion.h2>

            {/* Percentage */}
            <div className="font-mono text-spider-crimson text-sm tracking-wider mb-4">
              Spinning the web...<span className="ml-2 font-bold text-white">{progress}%</span>
            </div>

            {/* Progress Bar Container */}
            <div className="mb-6 h-2 w-full overflow-hidden rounded-full border border-spider-red/30 bg-black/70 shadow-[0_0_15px_rgba(230,36,41,0.25)]">
              <motion.div
                className="h-full bg-gradient-to-r from-spider-blood via-spider-red to-spider-blue"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Boot Log Messages */}
            <div className="flex h-20 w-full flex-col justify-end overflow-hidden rounded-lg border border-spider-red/15 bg-black/70 p-3 font-mono text-[11px] text-gray-400 backdrop-blur-sm">
              {logs.slice(-3).map((log, idx) => (
                <div key={idx} className="flex items-center gap-2 text-spider-crimson/90">
                  <span className="text-spider-blue">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Full concentric web used as the welcome backdrop. */
function WelcomeWeb({ className }: { className?: string }) {
  const spokes = 14;
  const rings = [70, 118, 170, 226, 286, 350, 418];

  const point = (radius: number, index: number) => {
    const angle = (Math.PI * 2 * index) / spokes - Math.PI / 2;
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  };

  return (
    <svg viewBox="-460 -460 920 920" className={className} aria-hidden="true">
      <g stroke="#e62429" fill="none" strokeWidth="1.2">
        {Array.from({ length: spokes }).map((_, i) => {
          const end = point(450, i);
          return (
            <line
              key={`s-${i}`}
              x1="0"
              y1="0"
              x2={end.x}
              y2={end.y}
              strokeOpacity="0.5"
              className="web-stroke"
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          );
        })}
        {rings.map((radius, ringIndex) => {
          const sag = radius * 0.08;
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
              key={`r-${ringIndex}`}
              d={d}
              strokeOpacity={0.4 - ringIndex * 0.03}
              className="web-stroke"
              style={{ animationDelay: `${0.3 + ringIndex * 0.1}s` }}
            />
          );
        })}
      </g>
    </svg>
  );
}
