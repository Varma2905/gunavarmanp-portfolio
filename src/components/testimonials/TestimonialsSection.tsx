import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaQuoteLeft } from 'react-icons/fa';
import { SectionHeading } from '../ui/SectionHeading';
import { GlassCard } from '../ui/GlassCard';
import { TESTIMONIALS } from '@/lib/constants';

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const item = TESTIMONIALS[currentIndex];

  return (
    <section className="py-24 relative z-10">
      <div className="max-w-4xl mx-auto px-6">
        <SectionHeading
          badge="06 // RECOMMENDATIONS"
          title="Client &amp; Peer Testimonials"
          subtitle="Feedback from engineering leaders, product executives, and startup founders."
        />

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard className="p-8 sm:p-12 border-cyber-cyan/30 text-center flex flex-col items-center">
                <FaQuoteLeft className="text-cyber-cyan/40 text-4xl mb-6" />

                <p className="font-sans text-lg sm:text-xl text-gray-200 leading-relaxed italic max-w-2xl mb-8">
                  &quot;{item.quote}&quot;
                </p>

                {/* Avatar & Author Info */}
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-cyber-cyan shadow-[0_0_15px_#e62429]">
                    <img
                      src={item.avatar}
                      alt={item.author}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  <div className="text-left flex flex-col">
                    <span className="font-display font-bold text-white text-base">
                      {item.author}
                    </span>
                    <span className="font-mono text-xs text-cyber-cyan">
                      {item.role}
                    </span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>

          {/* Nav Buttons */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-cyber-dark/80 border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/20 transition-all shadow-[0_0_10px_rgba(230,36,41,0.2)]"
              aria-label="Previous testimonial"
            >
              <FiChevronLeft size={20} />
            </button>

            {/* Slide Dots */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    currentIndex === idx ? 'w-8 bg-cyber-blue shadow-[0_0_10px_#e62429]' : 'w-2 bg-gray-600'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-cyber-dark/80 border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/20 transition-all shadow-[0_0_10px_rgba(230,36,41,0.2)]"
              aria-label="Next testimonial"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
