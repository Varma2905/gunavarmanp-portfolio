import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiCode, FiUser, FiBriefcase, FiMail, FiTerminal, FiBookOpen, FiFileText, FiGithub, FiLinkedin } from 'react-icons/fi';
import { PROJECTS, PERSONAL_INFO } from '@/lib/constants';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  /* Lock page scroll behind the modal — html is the actual scroll root here
     (Lenis runs unwrapped), not body. */
  useEffect(() => {
    if (!isOpen) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';

    return () => {
      root.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const items = [
    { type: 'section', title: 'About Varma', href: '#about', icon: FiUser, category: 'Navigation' },
    { type: 'section', title: 'Skills & Tech Stack', href: '#skills', icon: FiCode, category: 'Navigation' },
    { type: 'section', title: 'Projects Showcase', href: '#projects', icon: FiBriefcase, category: 'Navigation' },
    { type: 'section', title: 'Services & AI Solutions', href: '#services', icon: FiTerminal, category: 'Navigation' },
    { type: 'section', title: 'Experience Timeline', href: '#experience', icon: FiBookOpen, category: 'Navigation' },
    { type: 'section', title: 'Contact Form', href: '#contact', icon: FiMail, category: 'Navigation' },
    { type: 'action', title: 'Download Resume (PDF)', href: '/Gunavarman_P_AI_Engineer_Resume.pdf', icon: FiFileText, category: 'Actions', external: true },
    { type: 'action', title: 'GitHub Profile', href: PERSONAL_INFO.github, icon: FiGithub, category: 'Socials', external: true },
    { type: 'action', title: 'LinkedIn Profile', href: PERSONAL_INFO.linkedin, icon: FiLinkedin, category: 'Socials', external: true },
    ...PROJECTS.map((p) => ({
      type: 'project',
      title: p.title,
      href: `#projects`,
      icon: FiBriefcase,
      category: 'Projects',
      external: false
    }))
  ];

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md pointer-events-auto">
          {/* Backdrop click */}
          <div className="absolute inset-0 z-0 pointer-events-auto" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full max-w-xl bg-cyber-dark/95 border border-cyber-cyan/30 rounded-2xl shadow-[0_0_50px_rgba(230,36,41,0.3)] overflow-hidden pointer-events-auto"
          >
            {/* Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-cyber-cyan/15 bg-cyber-dark">
              <FiSearch className="text-cyber-cyan text-lg mr-3" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search section..."
                className="w-full bg-transparent text-white placeholder-gray-500 font-mono text-sm focus:outline-none pointer-events-auto cursor-text"
                autoFocus
              />
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-white rounded-md transition-colors pointer-events-auto cursor-pointer"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Results List */}
            {/* data-lenis-prevent: without it, the page's Lenis smooth-scroll
                grabs every wheel event (even here) and preventDefault()s it,
                so this list's native overflow-y-auto scroll never fires. */}
            <div data-lenis-prevent className="max-h-80 overflow-y-auto pointer-events-auto p-2">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center text-gray-500 font-mono text-xs">
                  NO COMMAND MATCHED &quot;{query}&quot;
                </div>
              ) : (
                filteredItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={`${item.title}-${item.category}`}
                      href={item.href}
                      target={item.external ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      onClick={onClose}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-cyber-cyan/10 transition-colors group cursor-pointer pointer-events-auto"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-cyber-dark border border-cyber-cyan/20 group-hover:border-cyber-cyan/50 text-cyber-blue">
                          <Icon size={16} />
                        </div>
                        <span className="text-sm font-medium text-gray-200 group-hover:text-cyber-cyan transition-colors">
                          {item.title}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20">
                        {item.category}
                      </span>
                    </a>
                  );
                })
              )}
            </div>

            {/* Footer Hint */}
            <div className="px-4 py-2 bg-cyber-dark/80 border-t border-cyber-cyan/10 flex items-center justify-between font-mono text-[10px] text-gray-500">
              <span>Use <kbd className="text-cyber-cyan">ESC</kbd> to exit</span>
              <span>SPIDER OS v1.0</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
