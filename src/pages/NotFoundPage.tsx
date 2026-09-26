import { motion } from 'framer-motion';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';
import { GlowButton } from '@/components/ui/GlowButton';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Glow ambient circle */}
      <div className="absolute w-[500px] h-[500px] bg-cyber-cyan/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-lg w-full bg-cyber-dark/80 border border-cyber-cyan/30 rounded-2xl p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(230,36,41,0.2)]"
      >
        <div className="w-16 h-16 rounded-full bg-cyber-pink/20 border border-cyber-pink text-cyber-pink flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_#3b82f6] animate-pulse">
          <FiAlertTriangle size={32} />
        </div>

        <h1 className="font-display text-6xl font-extrabold text-white mb-2 tracking-widest glow-cyan">
          404
        </h1>

        <h2 className="font-mono text-lg text-cyber-cyan mb-4">
          SYSTEM ERROR // SIGNAL LOST IN DEEP SPACE
        </h2>

        <p className="text-gray-400 text-sm leading-relaxed mb-8 font-sans">
          The quantum node or page memory sector you requested does not exist or has been relocated to another dimension.
        </p>

        <a href="/">
          <GlowButton variant="primary" className="mx-auto">
            <FiHome className="text-lg" />
            <span>RETURN TO THE WEB</span>
          </GlowButton>
        </a>
      </motion.div>
    </div>
  );
}
