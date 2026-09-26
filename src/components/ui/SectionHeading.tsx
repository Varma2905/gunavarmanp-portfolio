import { motion } from 'framer-motion';
import { SpiderMark } from './SpiderMark';

interface SectionHeadingProps {
  badge: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}

export function SectionHeading({ badge, title, subtitle, center = true }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={`flex flex-col mb-16 ${center ? 'items-center text-center' : 'items-start text-left'}`}
    >
      {/* Category Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-spider-red/10 border border-spider-red/30 text-spider-crimson font-mono text-xs tracking-widest uppercase mb-3 shadow-[0_0_14px_rgba(230,36,41,0.28)]">
        <SpiderMark className="h-3 w-3 text-spider-crimson" strokeWidth={9} />
        <span>{badge}</span>
      </div>

      {/* Main Title */}
      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 uppercase">
        {title}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p className="max-w-2xl text-gray-400 text-sm sm:text-base font-sans">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
