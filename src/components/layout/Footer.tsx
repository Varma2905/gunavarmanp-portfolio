import { FiArrowUp, FiGithub, FiLinkedin, FiInstagram, FiMail } from 'react-icons/fi';
import { PERSONAL_INFO } from '@/lib/constants';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 border-t border-cyber-cyan/15 bg-cyber-dark/90 backdrop-blur-md py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Logo & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-xl text-white">
              {PERSONAL_INFO.name}<span className="text-cyber-blue">.AI</span>
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-cyber-cyan/10 border border-cyber-cyan/20 text-cyber-cyan">
              SPIDER OS v1.0
            </span>
          </div>
          <p className="font-mono text-xs text-gray-500">
            © {new Date().getFullYear()} Varma. All rights reserved. Designed for 2035.
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-4">
          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-lg bg-cyber-dark border border-cyber-cyan/20 text-gray-400 hover:text-cyber-cyan hover:border-cyber-cyan transition-colors"
            aria-label="GitHub"
          >
            <FiGithub size={18} />
          </a>
          <a
            href={PERSONAL_INFO.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-lg bg-cyber-dark border border-cyber-cyan/20 text-gray-400 hover:text-cyber-cyan hover:border-cyber-cyan transition-colors"
            aria-label="LinkedIn"
          >
            <FiLinkedin size={18} />
          </a>
          <a
            href={PERSONAL_INFO.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-lg bg-cyber-dark border border-cyber-cyan/20 text-gray-400 hover:text-cyber-cyan hover:border-cyber-cyan transition-colors"
            aria-label="Instagram"
          >
            <FiInstagram size={18} />
          </a>
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="p-2.5 rounded-lg bg-cyber-dark border border-cyber-cyan/20 text-gray-400 hover:text-cyber-cyan hover:border-cyber-cyan transition-colors"
            aria-label="Email"
          >
            <FiMail size={18} />
          </a>
        </div>

        {/* Back to Top */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-dark border border-cyber-cyan/30 text-cyber-cyan font-mono text-xs hover:bg-cyber-cyan/20 transition-all shadow-[0_0_10px_rgba(230,36,41,0.2)]"
        >
          <span>BACK TO TOP</span>
          <FiArrowUp size={14} />
        </button>
      </div>
    </footer>
  );
}
