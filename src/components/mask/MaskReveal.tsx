import { useEffect, useRef, useState } from 'react';
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion';
import { PERSONAL_INFO } from '@/lib/constants';

/**
 * Cinematic intro section that sits between the welcome screen and the hero.
 *
 * Two stacked full-bleed layers: the masked figure in front, the unmasked
 * portrait behind. A soft circular hole is cut into the front layer and
 * follows the pointer, so moving the cursor "unmasks" the person underneath.
 *
 * Timeline (ms from mount) follows the requested beats:
 *   300  ambient red glow
 *   700  front layer starts emerging (opacity 0→1, scale .92→1)
 *  1200  front layer fully visible
 *  1800  light sweep crosses the frame
 *  2200  web pattern + particles settle in
 *  2700  reveal — the hole blooms open, then eases back to cursor size
 *  3200  caption and scroll cue fade in
 *
 * Everything animated here is transform / opacity / mask-position, and the
 * pointer writes straight into motion values so tracking never re-renders.
 */

const BEAT = {
  glow: 0.3,
  maskIn: 0.7,
  maskFull: 1.2,
  sweep: 1.8,
  particles: 2.2,
  reveal: 2.7,
  tag: 2.85,
  name: 3.05,
  title: 3.3,
  tagline: 3.5,
  cta: 3.75,
} as const;

/** Radius the cursor hole rests at, and how wide the reveal blooms. */
const REST_RADIUS = 190;
const BLOOM_RADIUS = 620;

export function MaskReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);

  /* Pointer-driven values. Written imperatively — never React state — so
     moving the mouse costs one style write instead of a re-render. */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const radius = useMotionValue(0);
  const parallaxX = useMotionValue(0);
  const parallaxY = useMotionValue(0);

  /* Long, multi-stop falloff — a short ramp reads as a hard cut-out disc.
     This keeps a clear core, then feathers over ~60% of the radius. */
  const maskImage = useMotionTemplate`radial-gradient(circle ${radius}px at ${mx}px ${my}px, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 34%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.38) 64%, rgba(0,0,0,0.7) 78%, rgba(0,0,0,0.92) 90%, #000 100%)`;

  /* Centre the hole on mount and keep it centred through resizes. */
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const centre = () => {
      const rect = node.getBoundingClientRect();
      mx.set(rect.width / 2);
      my.set(rect.height * 0.42);
    };

    centre();
    const observer = new ResizeObserver(centre);
    observer.observe(node);
    return () => observer.disconnect();
  }, [mx, my]);

  /* The reveal beat: bloom the hole open, then settle to resting size. */
  useEffect(() => {
    if (prefersReducedMotion) {
      radius.set(REST_RADIUS);
      setRevealed(true);
      return;
    }

    const bloom = window.setTimeout(() => {
      animate(radius, BLOOM_RADIUS, {
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1],
        onComplete: () => {
          animate(radius, REST_RADIUS, { duration: 0.7, ease: [0.4, 0, 0.2, 1] });
        },
      });
      setRevealed(true);
    }, BEAT.reveal * 1000);

    return () => window.clearTimeout(bloom);
  }, [prefersReducedMotion, radius]);

  /* Pointer / touch tracking + subtle parallax, throttled to one frame. */
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    let frame = 0;
    let pending: { x: number; y: number } | null = null;

    const apply = () => {
      frame = 0;
      if (!pending) return;
      const rect = node.getBoundingClientRect();
      const x = pending.x - rect.left;
      const y = pending.y - rect.top;
      mx.set(x);
      my.set(y);
      /* gentle camera drift, opposite directions for depth */
      parallaxX.set((x / rect.width - 0.5) * -18);
      parallaxY.set((y / rect.height - 0.5) * -12);
      pending = null;
    };

    const queue = (x: number, y: number) => {
      pending = { x, y };
      if (!frame) frame = window.requestAnimationFrame(apply);
    };

    const onMouse = (event: MouseEvent) => queue(event.clientX, event.clientY);
    const onTouch = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) queue(touch.clientX, touch.clientY);
    };

    node.addEventListener('mousemove', onMouse, { passive: true });
    node.addEventListener('touchmove', onTouch, { passive: true });
    return () => {
      node.removeEventListener('mousemove', onMouse);
      node.removeEventListener('touchmove', onTouch);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [mx, my, parallaxX, parallaxY]);

  return (
    <section
      id="mask-reveal"
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-black"
    >
      {/* Camera dolly: one slow, one-shot push toward the subject over the
          whole intro. Pure transform, so it stays on the compositor. */}
      <motion.div
        className="absolute inset-0"
        initial={prefersReducedMotion ? false : { scale: 1 }}
        animate={{ scale: 1.045 }}
        transition={{ duration: 4.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* ---------- layer 1: the unmasked portrait (behind) ---------- */}
        <motion.div
          className="absolute inset-0"
          style={{ x: parallaxX, y: parallaxY }}
        >
          {/* Idle sway: subtle head/shoulder drift, independent of the
              pointer parallax above so it never fights the mask hole. */}
          <motion.div
            className="absolute inset-0"
            style={{ scale: 1.06 }}
            animate={
              prefersReducedMotion
                ? undefined
                : { rotate: [0, -0.5, 0, 0.5, 0], y: [0, -4, 0, 3, 0] }
            }
            transition={{ delay: BEAT.maskFull, duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img
              src="/me_2.png"
              alt="Gunavarman P"
              draggable={false}
              className="h-full w-full select-none object-cover object-[50%_20%]"
              /* Base grade: darken and lift contrast to sit in the same
                 exposure range as the suit plate, then warm the whole frame
                 toward red so the skin tone matches instead of reading grey. */
              style={{
                filter:
                  'brightness(0.66) contrast(1.3) saturate(0.92) sepia(0.24) hue-rotate(-14deg)',
              }}
            />

            {/* Kill the bright studio backdrop: clear over the face, drowning
                to solid black at the edges where the grey wall sits. */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 40% 52% at 50% 30%, rgba(5,6,11,0) 0%, rgba(5,6,11,0.42) 46%, rgba(5,6,11,0.93) 76%, #05060b 100%)',
              }}
            />

            {/* Red ambient bounce on the face */}
            <div
              className="absolute inset-0 mix-blend-soft-light"
              style={{
                background:
                  'radial-gradient(ellipse 42% 46% at 50% 27%, rgba(230,36,41,0.55) 0%, rgba(230,36,41,0.15) 55%, transparent 75%)',
              }}
            />

            {/* Warm key from upper left + cool red rim from the right,
                mirroring how the suit plate is lit. */}
            <div
              className="absolute inset-0 mix-blend-screen"
              style={{
                background:
                  'linear-gradient(115deg, rgba(255,145,120,0.16) 0%, transparent 42%), linear-gradient(270deg, rgba(230,36,41,0.3) 0%, transparent 38%)',
              }}
            />

            {/* Contact shadow into the lower frame */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 28%, transparent 55%, rgba(5,6,11,0.9) 100%)',
              }}
            />
          </motion.div>
        </motion.div>

        {/* ---------- layer 2: the mask (in front, hole follows cursor) ---------- */}
        <motion.div
          className="absolute inset-0"
          style={{
            x: parallaxX,
            y: parallaxY,
            maskImage,
            WebkitMaskImage: maskImage,
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
          }}
          /* Rests at 1.06 to match the back layer's bleed — at scale 1 the
             parallax translate would expose the frame edges. */
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1.06 }}
          transition={{
            delay: BEAT.maskIn,
            duration: BEAT.maskFull - BEAT.maskIn + 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {/* Same idle sway on the mask image only — the mask geometry
              (mx/my/radius) lives on the outer div and never moves. */}
          <motion.div
            className="absolute inset-0"
            animate={
              prefersReducedMotion
                ? undefined
                : { rotate: [0, -0.5, 0, 0.5, 0], y: [0, -4, 0, 3, 0] }
            }
            transition={{ delay: BEAT.maskFull, duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img
              src="/spider-man.jpeg"
              alt=""
              draggable={false}
              className="h-full w-full select-none object-cover object-[50%_28%]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ---------- atmosphere ---------- */}

      {/* red ambient glow blooming from the centre */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[42%] h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 ambient-red blur-3xl"
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.85, scale: 1 }}
        transition={{ delay: BEAT.glow, duration: 1.4, ease: 'easeOut' }}
      />
      {/* cooler secondary rim */}
      <motion.div
        className="pointer-events-none absolute -right-24 bottom-0 h-[55vmin] w-[55vmin] ambient-blue blur-3xl"
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: BEAT.glow + 0.3, duration: 1.6, ease: 'easeOut' }}
      />

      {/* faint animated web pattern */}
      <motion.div
        className="pointer-events-none absolute inset-0 web-mesh [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,transparent_20%,#000_100%)]"
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: BEAT.particles, duration: 1.2 }}
      />

      {/* floating dust motes */}
      {!prefersReducedMotion && <DustField delay={BEAT.particles} />}

      {/* single light sweep across the frame */}
      {!prefersReducedMotion && (
        <motion.div
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-12 bg-gradient-to-r from-transparent via-white/12 to-transparent"
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: ['0%', '420%'], opacity: [0, 1, 1, 0] }}
          transition={{ delay: BEAT.sweep, duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        />
      )}

      {/* ---------- unifying grade ----------
          A single wash applied over BOTH plates. This is what makes two
          separately-shot images read as one photograph: shared colour
          cast, shared black point, shared grain. */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        style={{
          background:
            'linear-gradient(165deg, rgba(230,36,41,0.3) 0%, rgba(10,8,14,0.15) 45%, rgba(43,108,255,0.14) 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 mix-blend-multiply"
        style={{
          background:
            'radial-gradient(ellipse 75% 70% at 50% 40%, rgba(255,255,255,1) 0%, rgba(150,120,125,1) 60%, rgba(70,40,45,1) 100%)',
        }}
      />

      {/* film grain, oversized so the drift never exposes an edge */}
      <div
        className="pointer-events-none absolute -inset-[8%] film-grain"
        style={{ opacity: 0.13 }}
        aria-hidden="true"
      />

      {/* vignette keeps the edges cinematic */}
      <div className="pointer-events-none absolute inset-0 cine-vignette" />

      {/* ---------- identity reveal ----------
          SPIDER / MASK REVEAL → NAME → TITLE → tagline → ENTER PORTFOLIO,
          cascading in right as the mask bloom finishes. Each line holds its
          own delay so they stack rather than arrive as one block. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-3 px-6 text-center sm:bottom-12 sm:gap-4">
        <motion.span
          className="rounded-full border border-spider-red/30 bg-black/60 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.32em] text-spider-crimson backdrop-blur-md sm:text-[11px]"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: BEAT.tag, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Mask Reveal — Identity Protocol
        </motion.span>

        <motion.h2
          className="font-display text-3xl font-extrabold uppercase tracking-tight text-white drop-shadow-[0_0_22px_rgba(0,0,0,0.9)] sm:text-5xl"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: BEAT.name, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-gradient-spider glow-red">{PERSONAL_INFO.name}</span>
        </motion.h2>

        <motion.p
          className="font-display text-base font-bold uppercase tracking-[0.14em] text-white/90 sm:text-xl"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: BEAT.title, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          AI Engineer <span className="text-spider-red">&amp;</span> Full Stack Developer 
        </motion.p>

        <motion.p
          className="font-mono text-xs italic tracking-wide text-gray-400 sm:text-sm"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: BEAT.tagline, duration: 0.6 }}
        >
          &ldquo;Building my tech empire.&rdquo;
        </motion.p>

        <motion.a
          href="#home"
          className="pointer-events-auto mt-1 inline-flex items-center gap-2 rounded-full border border-spider-red/40 bg-spider-red/10 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-spider-crimson backdrop-blur-md transition-all hover:border-spider-red hover:bg-spider-red/20 hover:shadow-[0_0_20px_rgba(230,36,41,0.5)]"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: BEAT.cta, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span>Enter Portfolio</span>
          <span aria-hidden="true">↓</span>
        </motion.a>

        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-600">
          {revealed ? 'Move to unmask' : ''}
        </span>
      </div>
    </section>
  );
}

/** Slow-drifting red/blue motes. Pure CSS transforms, ~18 nodes. */
function DustField({ delay }: { delay: number }) {
  const motes = Array.from({ length: 18 }, (_, i) => ({
    left: `${(i * 37) % 100}%`,
    top: `${(i * 53) % 100}%`,
    size: (i % 3) + 2,
    duration: 9 + (i % 5) * 2.5,
    delay: (i % 7) * 0.8,
    blue: i % 4 === 0,
  }));

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 1.4 }}
      aria-hidden="true"
    >
      {motes.map((mote, i) => (
        <span
          key={i}
          className="absolute rounded-full animate-float"
          style={{
            left: mote.left,
            top: mote.top,
            width: mote.size,
            height: mote.size,
            animationDuration: `${mote.duration}s`,
            animationDelay: `${mote.delay}s`,
            background: mote.blue ? 'rgba(43,108,255,0.65)' : 'rgba(230,36,41,0.7)',
            boxShadow: mote.blue
              ? '0 0 8px rgba(43,108,255,0.7)'
              : '0 0 8px rgba(230,36,41,0.8)',
          }}
        />
      ))}
    </motion.div>
  );
}
