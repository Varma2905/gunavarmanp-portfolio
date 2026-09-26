import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiArrowDown, FiDownload, FiSend, FiTerminal, FiCode, FiPhone } from 'react-icons/fi';
import { TypeWriter } from './TypeWriter';
import { SpiderCrest } from './SpiderCrest';
import { GlowButton } from '../ui/GlowButton';
import { SpiderMark } from '../ui/SpiderMark';
import { PERSONAL_INFO, HERO_ROLES } from '@/lib/constants';

const socialLinkStyles =
  "p-2.5 rounded-xl bg-black/60 border border-spider-red/20 text-gray-300 hover:text-spider-crimson hover:border-spider-red hover:shadow-[0_0_18px_rgba(230,36,41,0.5)] transition-all";

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen pt-28 pb-16 flex items-center justify-center overflow-hidden">
      {/* Hero-local web threads + ambient glow */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 web-radial opacity-30 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_25%,transparent_100%)]" />
        <HangingThreads />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">

        {/* Left Headline & Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-7 flex flex-col items-start text-left"
        >
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-spider-red/10 border border-spider-red/30 text-spider-crimson font-mono text-xs mb-6 shadow-[0_0_18px_rgba(230,36,41,0.3)]">
            <SpiderMark className="h-3.5 w-3.5 text-spider-crimson" strokeWidth={9} />
            <span>SPIDER-SENSE ACTIVE — AVAILABLE FOR MISSIONS</span>
          </div>

          {/* Main Greeting */}
          <h1 className="font-display text-4xl sm:text-6xl xl:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-4">
            Hello, I&apos;m <span className="text-gradient-spider glow-red">{PERSONAL_INFO.name}</span>
          </h1>

          {/* Typing Roles */}
          <div className="text-lg sm:text-xl font-mono text-gray-300 mb-6 h-10 flex items-center">
            <span className="text-spider-red mr-3">&gt;</span>
            <TypeWriter roles={HERO_ROLES} />
          </div>

          {/* Bio paragraph */}
          <p className="text-gray-400 text-base sm:text-lg max-w-xl mb-5 leading-relaxed font-sans">
            {PERSONAL_INFO.bio}
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {['Agentic AI', 'Gen AI', 'LLM', 'RAG', 'LangChain', 'LangGraph', 'DevOps', 'MLOps'].map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-full border border-spider-red/25 bg-spider-red/10 text-red-200 text-[11px] font-mono uppercase tracking-widest"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-10">
            <GlowButton href="#projects" variant="primary">
              <FiTerminal className="text-lg" />
              <span>EXPLORE MISSIONS</span>
            </GlowButton>

            <GlowButton href="/Gunavarman_P_AI_Engineer_Resume.pdf" variant="outline" download>
              <FiDownload className="text-lg" />
              <span>RESUME</span>
            </GlowButton>

            <GlowButton href="#contact" variant="secondary">
              <FiSend className="text-lg" />
              <span>CONTACT</span>
            </GlowButton>
          </div>

          {/* Social Icons */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-spider-red/15 w-full max-w-md">
            <span className="font-mono text-xs text-gray-500 uppercase tracking-widest mr-2">
              CONNECT:
            </span>
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className={socialLinkStyles}
              aria-label="GitHub"
            >
              <FiGithub size={18} />
            </a>
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={socialLinkStyles}
              aria-label="LinkedIn"
            >
              <FiLinkedin size={18} />
            </a>
            <a
              href={PERSONAL_INFO.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-black/60 border border-spider-red/20 text-gray-300 hover:text-spider-crimson hover:border-spider-red hover:shadow-[0_0_18px_rgba(230,36,41,0.5)] transition-all font-mono text-xs font-bold flex items-center gap-1.5"
              aria-label="LeetCode"
            >
              <FiCode size={14} />
              <span>LeetCode</span>
            </a>
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className={socialLinkStyles}
              aria-label="Email"
            >
              <FiMail size={18} />
            </a>
            <a
              href={`tel:${PERSONAL_INFO.phone}`}
              className={socialLinkStyles}
              aria-label="Phone"
            >
              <FiPhone size={18} />
            </a>
          </div>
        </motion.div>

        {/* Right Spider Crest visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="lg:col-span-5 h-[380px] sm:h-[520px] w-full"
        >
          <SpiderCrest />
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <a
        href="#about"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-500 hover:text-spider-crimson flex flex-col items-center gap-2 font-mono text-xs transition-colors z-10"
      >
        <span>SCROLL DOWN</span>
        <FiArrowDown className="animate-bounce text-spider-red" size={16} />
      </a>
    </section>
  );
}

/** Thin web strands descending from the top of the hero, gently swaying. */
function HangingThreads() {
  const threads = [
    { left: '12%', height: '30vh', delay: '0s' },
    { left: '28%', height: '18vh', delay: '1.2s' },
    { left: '63%', height: '24vh', delay: '0.6s' },
    { left: '84%', height: '38vh', delay: '1.8s' },
  ];

  return (
    <>
      {threads.map((thread) => (
        <div
          key={thread.left}
          className="absolute top-0 origin-top animate-dangle"
          style={{ left: thread.left, height: thread.height, animationDelay: thread.delay }}
        >
          <div className="h-full w-px bg-gradient-to-b from-spider-red/45 via-spider-red/15 to-transparent" />
          <span className="absolute -bottom-1 -left-[3px] h-[7px] w-[7px] rounded-full bg-spider-red/70 shadow-[0_0_10px_rgba(230,36,41,0.8)]" />
        </div>
      ))}
    </>
  );
}
