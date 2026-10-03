import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, input, textarea, [role="button"], .interactive');
      setIsHovered(!!isInteractive);
    };

    const onMouseDown = () => setIsMouseDown(true);
    const onMouseUp = () => setIsMouseDown(false);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <>
      {/* Outer Glowing Ring */}
      {/* x/y live in `style`, not `animate`, so the ring snaps to the real
          cursor position every frame with zero lag — clicks must always land
          exactly where this is drawn. Only scale/opacity/color stay springy. */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-50 border border-cyber-cyan/60 mix-blend-screen"
        style={{
          x: position.x - 16,
          y: position.y - 16,
          borderColor: isHovered ? '#e62429' : 'rgba(255,59,63,0.6)',
          backgroundColor: isHovered ? 'rgba(230,36,41,0.15)' : 'rgba(0,0,0,0)',
          boxShadow: isHovered ? '0 0 20px rgba(230,36,41,0.6)' : '0 0 10px rgba(255,59,63,0.2)',
        }}
        animate={{
          scale: isMouseDown ? 0.8 : isHovered ? 1.8 : 1,
          opacity: isHovered ? 1 : 0.85,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 250, mass: 0.1 }}
      />
      {/* Core Glowing Dot — same fix: position tracks instantly, only scale eases. */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-cyber-blue pointer-events-none z-50 shadow-[0_0_10px_#e62429]"
        style={{
          x: position.x - 4,
          y: position.y - 4,
        }}
        animate={{
          scale: isMouseDown ? 1.5 : isHovered ? 0.5 : 1,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.05 }}
      />
    </>
  );
}
