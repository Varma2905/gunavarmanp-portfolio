import { useEffect, useRef } from "react";

interface GlobalSpiderManProps {
  frontImage: string;
}

// =========================================================
// SPIDER-TOON SIZE
// =========================================================

const SPIDER_WIDTH = 150;
const SPIDER_HEIGHT = 121;

// =========================================================
// HAND / WEB-SHOOTER POSITION
//
// Ratio of the raised hand within the image — this is the point
// that must stay glued to the end of the web.
// =========================================================

const WEB_SHOOTER = {
  x: 0.59,
  y: 0.08,
};

// =========================================================
// WEB (REST) LENGTH
//
// Distance from the fixed navbar anchor down to the hand at
// rest. Clamped so Spider-Toon hangs at a sensible depth on
// very short or very tall viewports.
// =========================================================

const MIN_ARM_LENGTH = 160;
const MAX_ARM_LENGTH = 260;

const getArmLength = () => {
  if (typeof window === "undefined") {
    return 220;
  }

  return Math.min(
    MAX_ARM_LENGTH,
    Math.max(MIN_ARM_LENGTH, window.innerHeight * 0.3)
  );
};

// =========================================================
// DRAG BOUNDS
//
// The navbar anchor only pins the TOP of the web — it does not
// restrict how far Spider-Toon can be dragged. The real
// boundary is the viewport itself: a generous horizontal reach
// (60–80% of viewport width) and the full vertical space, minus
// a small margin so he never gets dragged fully off-screen.
// =========================================================

const HORIZONTAL_REACH_RATIO = 0.7;
const VIEWPORT_MARGIN = 24;

// =========================================================
// PHYSICS CONSTANTS
//
// A Cartesian spring-pendulum: the hand is a point mass
// connected to the fixed anchor by a spring (the web) and
// pulled down by gravity. This single system produces both the
// swinging motion AND the elastic stretch/recoil in one pass —
// no separate angle/length ODEs to keep in sync. This only ever
// runs when NOT actively dragging — while the pointer is down,
// position is pointer position, full stop, no spring/damping
// fighting the user's hand.
// =========================================================

const GRAVITY = 2200; // px/s^2 — pulls the hand straight down
const SPRING_K = 220; // px/s^2 per px of stretch — web stiffness (strong, fast elastic snap)
const DAMPING = 6; // 1/s — velocity-proportional friction, ramped in (see DAMPING_RAMP_MS)
const IDLE_AMPLITUDE = 6; // px/s^2 — tiny perpetual "breeze" so it never looks frozen
const IDLE_FREQUENCY = 0.6; // rad/s

// Damping is applied at 0 strength right at release and ramps linearly up
// to full DAMPING over this window. Without this, friction fights the
// release burst from frame one and the whole thing reads as "smooth and
// slow" instead of "fast snap that gradually loses energy" — the exact
// complaint being fixed here.
const DAMPING_RAMP_MS = 180;

// The drag range is viewport-sized (hundreds of px), but the spring force
// is only ever meant to feel like a SHORT web recoiling — not a
// slingshot. Capping the STRETCH fed into the force calculation (rather
// than the position itself) means a normal-length drag behaves predictably
// while a very long drag still recoils at the same maximum force instead
// of launching Spider-Toon at tens of thousands of px/s.
const SPRING_STRETCH_CAP = 140;

// Release-velocity sampling window, multiplier, and clamp. The multiplier
// is what makes a real flick translate into a fast, energetic snap instead
// of a smooth drift — a slow release still produces a small multiplied
// velocity, so slow-in still means slow-out.
const VELOCITY_WINDOW_MS = 80;
const RELEASE_VELOCITY_MULTIPLIER = 3.2;
const MAX_RELEASE_SPEED = 6500; // px/s — post-multiplier ceiling

// Extra body lean during fast motion, layered on top of the arm angle.
const LEAN_FACTOR = 0.015;
const MAX_LEAN_DEG = 10;

// Web-thread curve: a quadratic Bézier's single control point is offset
// from the straight anchor->hand midpoint by two small, capped amounts —
// SAG (gravity, proportional to length) and WHIP (a trailing lag opposite
// the current horizontal velocity, like real flexible material reacting to
// fast motion). Both are deliberately small so the thread reads as subtly
// organic, never like a rope or a bent rod.
const WEB_SAG_RATIO = 0.05;
const WEB_SAG_MAX = 14;
const WEB_WHIP_FACTOR = 0.01;
const WEB_WHIP_MAX = 14;

// =========================================================
// HELPERS
// =========================================================

type Bounds = { minX: number; maxX: number; minY: number; maxY: number };

const clampToBounds = (x: number, y: number, bounds: Bounds) => ({
  x: Math.min(bounds.maxX, Math.max(bounds.minX, x)),
  y: Math.min(bounds.maxY, Math.max(bounds.minY, y)),
});

// =========================================================
// COMPONENT
//
// Spider-Toon hangs from a web fixed under the navbar. Drag him
// with mouse or touch — he follows the pointer directly and
// continuously, across the whole viewport. On release he keeps
// his momentum and swings like a real spring-pendulum: overshoot,
// decreasing bounces, then a small perpetual idle sway.
//
// All physics state lives in refs and is written straight to the
// DOM every animation frame — React never re-renders for this.
// =========================================================

export function GlobalSpiderMan({ frontImage }: GlobalSpiderManProps) {
  const pivotRef = useRef<HTMLDivElement>(null);
  const webPathRef = useRef<SVGPathElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Anchor (screen px) + rest length + drag bounds. Updated on
  // resize/scroll, written straight to the pivot's transform.
  const anchorRef = useRef({ x: 220, y: 90 });
  const armLengthRef = useRef(getArmLength());
  const boundsRef = useRef<Bounds>({
    minX: -400,
    maxX: 400,
    minY: -100,
    maxY: 500,
  });

  // Hand position (px, py) relative to the anchor, plus velocity.
  const physicsRef = useRef({
    px: 0,
    py: armLengthRef.current,
    vx: 0,
    vy: 0,
  });

  const draggingRef = useRef(false);
  // Preserves wherever on Spider-Toon the user actually grabbed, so the
  // hand doesn't jump to the pointer — the character keeps the same
  // pointer-to-hand offset for the whole drag instead of re-centering.
  const grabOffsetRef = useRef({ x: 0, y: 0 });
  const pointerHistoryRef = useRef<{ x: number; y: number; t: number }[]>([]);
  // rAF timestamp of the most recent release — drives the damping ramp.
  const releaseTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // =========================================================
  // RENDER ONE FRAME (direct DOM writes, no React state)
  // =========================================================

  const renderFrame = () => {
    const { px, py, vx } = physicsRef.current;
    const anchorX = anchorRef.current.x;
    const anchorY = anchorRef.current.y;
    const handX = anchorX + px;
    const handY = anchorY + py;

    const path = webPathRef.current;
    if (path) {
      // Direct world coordinates for both endpoints — no rotation/angle
      // math involved at all for the web anymore, which also means there's
      // no CSS-rotation-handedness class of bug possible here: the curve
      // literally goes from the anchor's real screen position to the
      // hand's real screen position, so it can never end up mirrored.
      const len = Math.hypot(px, py) || 0.0001;
      const sag = Math.min(len * WEB_SAG_RATIO, WEB_SAG_MAX);
      const whip = Math.max(
        -WEB_WHIP_MAX,
        Math.min(WEB_WHIP_MAX, -vx * WEB_WHIP_FACTOR)
      );

      const controlX = (anchorX + handX) / 2 + whip;
      const controlY = (anchorY + handY) / 2 + sag;

      path.setAttribute(
        "d",
        `M ${anchorX} ${anchorY} Q ${controlX} ${controlY} ${handX} ${handY}`
      );
    }

    // CSS `rotate()` is clockwise in screen space, which is the OPPOSITE
    // handedness of the standard atan2(y, x) convention once you account
    // for the screen's Y axis pointing down. Spider-Toon starts from a
    // "pointing down" orientation (rotation pivots on the hand), so plain
    // atan2(px, py) rotates the body toward the WRONG horizontal side —
    // invisible at rest (px=0) but backward for any real drag. atan2(-px,
    // py) is the correct angle for CSS rotate().
    const angleDeg = (Math.atan2(-px, py) * 180) / Math.PI;

    const img = imgRef.current;
    if (img) {
      const lean = Math.max(
        -MAX_LEAN_DEG,
        Math.min(MAX_LEAN_DEG, -vx * LEAN_FACTOR)
      );

      // `translate3d` runs before `rotate` in the transform list is
      // applied right-to-left, so rotation happens first around the hand
      // (transform-origin, at local 0,0) and then the whole rotated body
      // is translated so the hand lands exactly at (px, py). `transform`
      // only — no `left`/`top` writes — keeps every frame compositor-only.
      img.style.transform = `translate3d(${px}px, ${py}px, 0) rotate(${angleDeg + lean}deg)`;
    }
  };

  // =========================================================
  // ANCHOR + BOUNDS TRACKING (navbar position, viewport size)
  // =========================================================

  useEffect(() => {
    const updateAnchor = () => {
      const anchorElement = document.querySelector(
        "[data-spider-anchor]"
      ) as HTMLElement | null;

      if (!anchorElement) {
        return;
      }

      const rect = anchorElement.getBoundingClientRect();

      const navbarElement = document.querySelector(
        "[data-spider-navbar]"
      ) as HTMLElement | null;

      const bottomY = navbarElement
        ? navbarElement.getBoundingClientRect().bottom
        : rect.bottom;

      anchorRef.current = {
        x: rect.left + rect.width / 2,
        y: bottomY,
      };

      armLengthRef.current = getArmLength();

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const horizontalReach = viewportWidth * HORIZONTAL_REACH_RATIO;

      // Two constraints, tightest wins: a generous ratio-based reach, AND
      // never past the actual visible viewport edge (the anchor sits near
      // the left side of the navbar, not centered, so the two aren't the
      // same thing).
      boundsRef.current = {
        minX: Math.max(
          -horizontalReach,
          VIEWPORT_MARGIN - anchorRef.current.x
        ),
        maxX: Math.min(
          horizontalReach,
          viewportWidth - VIEWPORT_MARGIN - anchorRef.current.x
        ),
        minY: VIEWPORT_MARGIN - anchorRef.current.y,
        maxY: viewportHeight - VIEWPORT_MARGIN - anchorRef.current.y,
      };

      if (pivotRef.current) {
        pivotRef.current.style.transform = `translate3d(${anchorRef.current.x}px, ${anchorRef.current.y}px, 0)`;
      }

      // The pivot's own transform above is applied immediately, but the
      // web path is otherwise only touched inside the rAF loop — without
      // this, a resize/scroll would leave the thread stale for up to one
      // frame. Re-rendering here keeps both endpoints in sync the instant
      // the anchor moves, independent of the physics loop's timing.
      renderFrame();
    };

    updateAnchor();

    window.addEventListener("resize", updateAnchor);
    window.addEventListener("scroll", updateAnchor);

    return () => {
      window.removeEventListener("resize", updateAnchor);
      window.removeEventListener("scroll", updateAnchor);
    };
  }, []);

  // =========================================================
  // PHYSICS LOOP — one continuous rAF chain for the whole
  // component's lifetime. While dragging, the pointer drives
  // (px, py) directly and this loop just renders; once released,
  // it integrates the spring-pendulum until it settles into the
  // small idle sway.
  // =========================================================

  useEffect(() => {
    const tick = (now: number) => {
      const last = lastTimeRef.current ?? now;
      const dt = Math.min((now - last) / 1000, 0.032);
      lastTimeRef.current = now;

      if (!draggingRef.current) {
        const state = physicsRef.current;
        const len = Math.hypot(state.px, state.py) || 0.0001;
        const rawStretch = len - armLengthRef.current;
        const stretch = Math.min(rawStretch, SPRING_STRETCH_CAP);
        const dirX = state.px / len;
        const dirY = state.py / len;

        // Damping ramps from 0 to full strength over DAMPING_RAMP_MS,
        // measured from the moment of release — the initial snap plays out
        // essentially unopposed, friction only bites in afterward.
        const msSinceRelease = releaseTimeRef.current
          ? now - releaseTimeRef.current
          : DAMPING_RAMP_MS;
        const dampingFactor = Math.min(1, msSinceRelease / DAMPING_RAMP_MS);
        const effectiveDamping = DAMPING * dampingFactor;

        const ax =
          -SPRING_K * stretch * dirX -
          effectiveDamping * state.vx +
          IDLE_AMPLITUDE * Math.sin(now * 0.001 * IDLE_FREQUENCY);

        const ay =
          -SPRING_K * stretch * dirY - effectiveDamping * state.vy + GRAVITY;

        state.vx += ax * dt;
        state.vy += ay * dt;
        state.px += state.vx * dt;
        state.py += state.vy * dt;

        // Safety net only (keeps things sane across a resize mid-swing) —
        // under normal physics the spring already pulls it back well
        // inside these bounds, this should essentially never trigger.
        const clamped = clampToBounds(state.px, state.py, boundsRef.current);
        state.px = clamped.x;
        state.py = clamped.y;
      }

      renderFrame();

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // =========================================================
  // DRAG — pointer events, works for mouse and touch alike.
  // setPointerCapture keeps pointermove/up routed to this exact
  // element even once the pointer moves outside its bounds, so
  // fast drags never "lose" the character.
  // =========================================================

  const handlePointerDown = (event: React.PointerEvent<HTMLImageElement>) => {
    event.preventDefault();

    draggingRef.current = true;

    try {
      imgRef.current?.setPointerCapture(event.pointerId);
    } catch {
      // Ignore — pointer capture is best-effort.
    }

    document.body.style.userSelect = "none";
    imgRef.current?.classList.add("spider-toon-dragging");

    // Preserve grab offset: wherever on the character was clicked stays
    // under the pointer for the whole drag, instead of the hand snapping
    // to the pointer position.
    const state = physicsRef.current;
    const currentHandX = anchorRef.current.x + state.px;
    const currentHandY = anchorRef.current.y + state.py;
    grabOffsetRef.current = {
      x: event.clientX - currentHandX,
      y: event.clientY - currentHandY,
    };

    state.vx = 0;
    state.vy = 0;

    pointerHistoryRef.current = [
      { x: event.clientX, y: event.clientY, t: performance.now() },
    ];
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLImageElement>) => {
    if (!draggingRef.current) {
      return;
    }

    const desiredHandX = event.clientX - grabOffsetRef.current.x;
    const desiredHandY = event.clientY - grabOffsetRef.current.y;

    const dx = desiredHandX - anchorRef.current.x;
    const dy = desiredHandY - anchorRef.current.y;

    // Only constraint during active drag: stay inside the viewport. No
    // spring, no damping — position IS the pointer (offset-adjusted) every
    // single move event, continuously, for the entire drag.
    const clamped = clampToBounds(dx, dy, boundsRef.current);

    physicsRef.current.px = clamped.x;
    physicsRef.current.py = clamped.y;

    const history = pointerHistoryRef.current;
    history.push({ x: event.clientX, y: event.clientY, t: performance.now() });

    const cutoff = performance.now() - VELOCITY_WINDOW_MS;
    while (history.length > 1 && history[0].t < cutoff) {
      history.shift();
    }
  };

  const releaseDrag = (event: React.PointerEvent<HTMLImageElement>) => {
    if (!draggingRef.current) {
      return;
    }

    draggingRef.current = false;

    try {
      if (imgRef.current?.hasPointerCapture(event.pointerId)) {
        imgRef.current.releasePointerCapture(event.pointerId);
      }
    } catch {
      // Ignore.
    }

    document.body.style.userSelect = "";
    imgRef.current?.classList.remove("spider-toon-dragging");

    const history = pointerHistoryRef.current;
    const newest = history[history.length - 1];
    const oldest = history[0];

    let vx = 0;
    let vy = 0;

    if (newest && oldest && newest.t - oldest.t > 8) {
      const dt = (newest.t - oldest.t) / 1000;
      // Raw pointer velocity — the actual speed of the last flick, not
      // smoothed beyond this short window. Multiplied up so a real throw
      // reads as a fast, energetic snap rather than a gentle drift; a slow
      // release still yields a small multiplied velocity, so the scaling
      // stays proportional to how fast the user actually moved.
      vx = ((newest.x - oldest.x) / dt) * RELEASE_VELOCITY_MULTIPLIER;
      vy = ((newest.y - oldest.y) / dt) * RELEASE_VELOCITY_MULTIPLIER;

      const speed = Math.hypot(vx, vy);
      if (speed > MAX_RELEASE_SPEED) {
        const scale = MAX_RELEASE_SPEED / speed;
        vx *= scale;
        vy *= scale;
      }
    }

    physicsRef.current.vx = vx;
    physicsRef.current.vy = vy;
    releaseTimeRef.current = performance.now();
    pointerHistoryRef.current = [];
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      {/* =====================================================
          WEB THREAD
          A quadratic-Bézier SVG path in real world coordinates —
          M anchor Q control hand — updated every frame. The
          control point is the anchor→hand midpoint nudged by a
          small, capped sag (gravity) and whip (trailing lag on
          fast horizontal motion), so it reads as a thin flexible
          thread instead of a rigid stick. Sized to the full
          viewport so the browser has an exact, cheap paint region
          instead of an unbounded "overflow: visible" guess.
      ===================================================== */}

      <svg
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          overflow: "visible",
          pointerEvents: "none",
          zIndex: 9997,
        }}
      >
        <path
          ref={webPathRef}
          data-spider-web
          d={`M ${anchorRef.current.x} ${anchorRef.current.y} Q ${anchorRef.current.x} ${anchorRef.current.y + armLengthRef.current / 2} ${anchorRef.current.x} ${anchorRef.current.y + armLengthRef.current}`}
          fill="none"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="1"
          strokeLinecap="round"
          style={{
            filter: "drop-shadow(0 0 2px rgba(255,255,255,0.5))",
          }}
        />
      </svg>

      {/* =====================================================
          SPIDER-TOON
          Positioned so its raised hand sits at (px, py); rotated
          around that same point so the body swings naturally.
      ===================================================== */}

      <div
        ref={pivotRef}
        data-spider-pivot
        aria-hidden="true"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          pointerEvents: "none",
          zIndex: 9998,
        }}
      >
        <img
          ref={imgRef}
          src={frontImage}
          alt="Spider-Man"
          draggable={false}
          onDragStart={(event) => event.preventDefault()}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={releaseDrag}
          onPointerCancel={releaseDrag}
          onPointerLeave={(event) => {
            // Defensive only: with setPointerCapture, pointermove/up already
            // keep routing here even once the cursor leaves the element's
            // bounds, so this should rarely fire mid-drag. Kept as a
            // fallback in case a browser/device ever fails to honor capture.
            if (draggingRef.current && !imgRef.current?.hasPointerCapture(event.pointerId)) {
              releaseDrag(event);
            }
          }}
          className="spider-toon-dragging-target"
          style={{
            position: "absolute",
            // Static baseline: places the hand (WEB_SHOOTER ratio) at local
            // (0, 0), i.e. right at the anchor before any transform is
            // applied. All actual movement happens via `transform` in
            // renderFrame(), never by rewriting left/top per frame.
            left: -SPIDER_WIDTH * WEB_SHOOTER.x,
            top: -SPIDER_HEIGHT * WEB_SHOOTER.y,
            width: `${SPIDER_WIDTH}px`,
            height: `${SPIDER_HEIGHT}px`,
            maxWidth: "none",
            objectFit: "contain",
            transformOrigin: `${WEB_SHOOTER.x * 100}% ${WEB_SHOOTER.y * 100}%`,
            // Matches the resting physics state so first paint (before the
            // first rAF tick) already looks correct instead of flashing at
            // the anchor point.
            transform: `translate3d(0px, ${armLengthRef.current}px, 0) rotate(0deg)`,
            pointerEvents: "auto",
            touchAction: "none",
            userSelect: "none",
            WebkitUserSelect: "none",
            display: "block",
            willChange: "transform",
            filter: "drop-shadow(0 4px 10px rgba(255,0,0,0.25))",
          }}
        />
      </div>
    </>
  );
}
