import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiTerminal, FiUser, FiCode, FiBriefcase, FiMail, FiHome, FiSearch, FiAward } from 'react-icons/fi';
import { PERSONAL_INFO } from '@/lib/constants';

interface NavbarProps {
  onOpenCommandPalette: () => void;
}

const navLinks = [
  { name: 'Home', href: '#home', id: 'home', icon: FiHome },
  { name: 'About', href: '#about', id: 'about', icon: FiUser },
  { name: 'Skills', href: '#skills', id: 'skills', icon: FiCode },
  { name: 'Projects', href: '#projects', id: 'projects', icon: FiBriefcase },
  { name: 'Certifications', href: '#certifications', id: 'certifications', icon: FiAward },
  { name: 'Terminal', href: '#terminal', id: 'terminal', icon: FiTerminal },
  { name: 'Contact', href: '#contact', id: 'contact', icon: FiMail },
];

export function Navbar({ onOpenCommandPalette }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Active section indicator — observes each anchored section. */
  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      data-spider-navbar
      /* `header` is `position:fixed` + `z-index`, so it creates its own
         stacking context — anything nested inside it (like the mobile
         drawer below) is capped by THIS z-index no matter what z-index the
         child itself declares. Spider-Toon floats at z-[9997/9998], a
         sibling outside this context, so the drawer needs the header itself
         raised above it while open, or Spider-Toon's default position can
         sit on top of the open menu's links. Restores to z-40 once closed. */
      className={`fixed top-0 left-0 right-0 ${mobileMenuOpen ? 'z-[9999]' : 'z-40'} transition-[background-color,padding,box-shadow,backdrop-filter] duration-300 ${
        scrolled
          ? 'py-3 bg-[#05060b]/95 backdrop-blur-xl shadow-[0_10px_40px_-20px_rgba(230,36,41,0.7)]'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <a href="#home" aria-label="Home" className="flex items-center gap-3 group shrink-0">
          <div
            data-spider-anchor
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-spider-red to-spider-blue p-[1px] shadow-[0_0_18px_rgba(230,36,41,0.5)] outline outline-2 outline-offset-2 outline-spider-red/50 group-hover:scale-105 transition-transform"
          >
            <div className="w-full h-full bg-[#05060b] rounded-xl flex items-center justify-center">
              <img
                src="/spider-logo.png"
                alt=""
                width={24}
                height={24}
                draggable={false}
                className="h-6 w-6 object-contain select-none drop-shadow-[0_0_8px_rgba(230,36,41,0.7)]"
              />
            </div>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-display font-bold text-lg text-white group-hover:text-spider-crimson transition-colors tracking-wide">
              {PERSONAL_INFO.name}<span className="text-spider-red">.AI</span>
            </span>
            <span className="font-mono text-[10px] text-gray-400 tracking-wider">
              AI_ENGINEER // FULL_STACK
            </span>
          </div>
        </a>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-black/50 p-1.5 rounded-full border border-spider-red/15 backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.name}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-gray-300 hover:text-spider-crimson'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full bg-spider-red/20 border border-spider-red/50 shadow-[0_0_18px_rgba(230,36,41,0.45)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCommandPalette}
            className="hidden xl:inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-spider-red/20 bg-black/50 font-mono text-[11px] text-gray-400 hover:text-spider-crimson hover:border-spider-red/50 transition-colors"
            aria-label="Open command palette"
          >
            <span>SEARCH</span>
            <kbd className="rounded bg-spider-red/15 px-1.5 py-0.5 text-spider-crimson">Ctrl K</kbd>
          </button>

          {/* Hire Me CTA Button */}
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-bold font-mono tracking-wider text-white bg-spider-red hover:bg-spider-crimson rounded-lg transition-all shadow-[0_0_18px_rgba(230,36,41,0.5)] hover:shadow-[0_0_28px_rgba(230,36,41,0.85)] hover:scale-105"
          >
            SEND SIGNAL
          </a>

          {/* Mobile/tablet Search Trigger — mirrors the desktop SEARCH/Ctrl-K
              button's breakpoint exactly (xl:hidden vs its xl:inline-flex) so
              there's no dead zone between the hamburger disappearing at lg
              and the desktop button appearing at xl. */}
          <button
            onClick={onOpenCommandPalette}
            className="xl:hidden p-2 text-gray-300 hover:text-spider-crimson focus:outline-none"
            aria-label="Open command palette"
          >
            <FiSearch size={22} />
          </button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-300 hover:text-spider-crimson focus:outline-none"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden bg-[#05060b]/97 border-b border-spider-red/25 backdrop-blur-2xl px-6 py-6"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                      isActive
                        ? 'bg-spider-red/15 border-spider-red/50 text-white'
                        : 'border-transparent text-gray-200 hover:bg-spider-red/10 hover:text-spider-crimson'
                    }`}
                  >
                    <Icon className="text-spider-red" />
                    <span className="font-medium text-base">{link.name}</span>
                  </a>
                );
              })}
              <div className="pt-4 border-t border-spider-red/15 flex flex-col gap-3">
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-3 bg-spider-red text-white font-mono font-bold rounded-xl shadow-[0_0_24px_rgba(230,36,41,0.7)]"
                >
                  SEND SIGNAL
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
