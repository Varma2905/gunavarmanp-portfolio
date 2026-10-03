import { useEffect, ReactNode } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    // Detect touch / coarse pointer devices (mobile phones and touch tablets)
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;

    // On touch devices, prefer native browser touch momentum scrolling for zero-lag 60fps swiping
    if (isTouchDevice) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 0,
      infinite: false,
      lerp: 0.12,
      /* Without this, Lenis never learns an anchor `<a href="#section">`
         click happened, so its own raf loop keeps re-asserting its stale
         target scroll position and cancels out the browser's native jump —
         nav links (mobile and desktop) look like they do nothing. */
      anchors: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
