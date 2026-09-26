import { useEffect, useRef, useState } from 'react';

/**
 * Global cinematic backdrop: dark city haze, red/blue ambient lighting,
 * a static corner web lattice and a light particle field with occasional
 * web-line shots. Everything is original artwork drawn with canvas/SVG.
 *
 * Performance notes:
 *  - particle count scales with viewport and is capped hard on small screens
 *  - neighbour-linking is skipped on coarse pointers (phones/tablets)
 *  - the whole animation halts when the tab is hidden or motion is reduced
 */
export function SpiderWebBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  /* Subtle mouse parallax for the ambient light blobs (pointer devices only) */
  useEffect(() => {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    let frame = 0;
    const onMove = (event: MouseEvent) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setParallax({
          x: (event.clientX / window.innerWidth - 0.5) * 40,
          y: (event.clientY / window.innerHeight - 0.5) * 40,
        });
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrameId = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    };
    window.addEventListener('resize', onResize);

    /* --- floating dust particles ---------------------------------- */
    type Particle = { x: number; y: number; vx: number; vy: number; r: number; a: number; blue: boolean };

    const particleCap = coarsePointer ? 34 : 78;
    const count = Math.min(Math.floor((width * height) / 22000), particleCap);
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.7 + 0.5,
      a: Math.random() * 0.45 + 0.12,
      blue: Math.random() > 0.7,
    }));

    /* --- occasional web-line shot --------------------------------- */
    type Shot = { x1: number; y1: number; x2: number; y2: number; t: number };
    let shot: Shot | null = null;
    let nextShotAt = performance.now() + 3500;

    const spawnShot = (now: number) => {
      const fromLeft = Math.random() > 0.5;
      const y = Math.random() * height * 0.8 + height * 0.1;
      shot = {
        x1: fromLeft ? -60 : width + 60,
        y1: y,
        x2: fromLeft ? width * (0.45 + Math.random() * 0.4) : width * (0.15 + Math.random() * 0.4),
        y2: y + (Math.random() - 0.5) * height * 0.35,
        t: 0,
      };
      nextShotAt = now + 6000 + Math.random() * 6000;
    };

    const linkDistance = 130;

    const render = (now: number) => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.blue
          ? `rgba(43,108,255,${p.a})`
          : `rgba(230,36,41,${p.a})`;
        ctx.fill();

        if (coarsePointer) continue;

        /* thin web threads between close particles */
        for (let j = i + 1; j < particles.length; j += 1) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(230, 36, 41, ${0.1 * (1 - dist / linkDistance)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      /* web shot streak */
      if (!coarsePointer) {
        if (!shot && now > nextShotAt) spawnShot(now);

        if (shot) {
          shot.t += 0.022;
          const eased = 1 - Math.pow(1 - Math.min(shot.t, 1), 3);
          const fade = shot.t < 0.6 ? 1 : Math.max(0, 1 - (shot.t - 0.6) / 0.6);
          const cx = shot.x1 + (shot.x2 - shot.x1) * eased;
          const cy = shot.y1 + (shot.y2 - shot.y1) * eased;

          const gradient = ctx.createLinearGradient(shot.x1, shot.y1, cx, cy);
          gradient.addColorStop(0, 'rgba(230,36,41,0)');
          gradient.addColorStop(1, `rgba(255,255,255,${0.5 * fade})`);

          ctx.beginPath();
          ctx.moveTo(shot.x1, shot.y1);
          ctx.lineTo(cx, cy);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.1;
          ctx.stroke();

          if (shot.t >= 1.2) shot = null;
        }
      }

      animationFrameId = window.requestAnimationFrame(render);
    };

    const start = () => {
      if (!animationFrameId) animationFrameId = window.requestAnimationFrame(render);
    };
    const stop = () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
    };

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    if (reducedMotion) {
      /* draw a single static frame */
      render(performance.now());
      stop();
    } else {
      start();
    }

    return () => {
      stop();
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#05060b]">
      {/* Dark city skyline haze */}
      <div className="absolute inset-x-0 bottom-0 h-[45vh] bg-gradient-to-t from-[#0b0d18] via-[#07080f]/70 to-transparent" />

      {/* Ambient red / blue lighting with mouse parallax */}
      <div
        className="absolute -top-40 -left-32 h-[70vh] w-[70vh] ambient-red blur-3xl transition-transform duration-500 ease-out"
        style={{ transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)` }}
      />
      <div
        className="absolute -bottom-40 -right-32 h-[65vh] w-[65vh] ambient-blue blur-3xl transition-transform duration-500 ease-out"
        style={{ transform: `translate3d(${-parallax.x}px, ${-parallax.y}px, 0)` }}
      />

      {/* Fine web mesh */}
      <div className="absolute inset-0 web-mesh opacity-[0.55] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,#000_35%,transparent_100%)]" />

      {/* Corner web lattices — original geometry, drawn as SVG */}
      <CornerWeb className="absolute -top-24 -left-24 h-[420px] w-[420px] opacity-[0.22]" />
      <CornerWeb className="absolute -bottom-28 -right-24 h-[460px] w-[460px] opacity-[0.16] rotate-180" />

      {/* Particle + web-shot canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Cinematic vignette */}
      <div className="absolute inset-0 cine-vignette" />
    </div>
  );
}

/** A quarter web: radial anchor threads plus catenary cross threads. */
function CornerWeb({ className }: { className?: string }) {
  const rings = [70, 118, 168, 222, 280, 342];
  const spokes = 9;
  const spread = Math.PI / 2;

  const point = (radius: number, index: number) => {
    const angle = (spread / (spokes - 1)) * index;
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  };

  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true">
      <g transform="translate(20 20)" stroke="#e62429" fill="none" strokeWidth="1">
        {Array.from({ length: spokes }).map((_, i) => {
          const end = point(370, i);
          return <line key={`spoke-${i}`} x1="0" y1="0" x2={end.x} y2={end.y} strokeOpacity="0.55" />;
        })}

        {rings.map((radius, ringIndex) => {
          const sag = radius * 0.06;
          let d = '';
          for (let i = 0; i < spokes - 1; i += 1) {
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
              strokeOpacity={0.45 - ringIndex * 0.04}
              strokeWidth={ringIndex > 3 ? 0.8 : 1}
            />
          );
        })}
      </g>
    </svg>
  );
}
