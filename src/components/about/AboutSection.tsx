import { motion } from 'framer-motion';
import { FiCheckCircle, FiCpu, FiGlobe, FiZap, FiTarget } from 'react-icons/fi';
import { SectionHeading } from '../ui/SectionHeading';
import { GlassCard } from '../ui/GlassCard';
import { PERSONAL_INFO, EDUCATION } from '@/lib/constants';

export function AboutSection() {
  const stats = [
    { label: "YEARS EXP", value: `${PERSONAL_INFO.stats.yearsExp}+`, icon: FiZap },
    { label: "PROJECTS BUILT", value: `${PERSONAL_INFO.stats.projectsCompleted}+`, icon: FiCheckCircle },
    { label: "AI AGENTS DEPLOYED", value: `${PERSONAL_INFO.stats.aiAgentsDeployed}+`, icon: FiCpu },
    { label: "GITHUB COMMITS", value: `${PERSONAL_INFO.stats.githubContributions}+`, icon: FiGlobe },
  ];

  return (
    <section id="about" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          badge="01 // IDENTITY FILE"
          title="The Person Behind the Mask"
          subtitle="Combining high-performance machine learning models, multi-agent frameworks, and futuristic spatial 3D web interfaces."
        />

        {/* Top Animated Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <GlassCard className="flex flex-col items-center justify-center p-6 text-center border-cyber-cyan/20 hover:border-cyber-cyan/50">
                  <div className="p-3 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-blue mb-3 shadow-[0_0_15px_rgba(230,36,41,0.2)]">
                    <Icon size={24} />
                  </div>
                  <span className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-1 glow-cyan">
                    {stat.value}
                  </span>
                  <span className="font-mono text-[11px] text-gray-400 tracking-wider">
                    {stat.label}
                  </span>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Bio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Mission & Vision */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            <GlassCard className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/40">
                    <FiTarget size={20} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white">Mission &amp; Philosophy</h3>
                </div>
                <p className="text-gray-300 leading-relaxed mb-4">
                  My mission is to build reliable, production-ready Agentic AI, Gen AI, LLM, RAG, LangChain, and LangGraph systems that turn complex workflows into autonomous products. I combine intelligent orchestration with polished full-stack experiences to deliver tools that feel seamless for both users and developers.
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Every project is built with clean architecture, scalable APIs, thoughtful UI, and production-ready deployment practices.
                </p>

                <div className="mt-6 rounded-2xl border border-cyber-cyan/20 bg-cyber-dark/60 p-4">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-cyber-cyan mb-3">PROFILE SNAPSHOT</p>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div><span className="text-gray-400">Email:</span> <a href={`mailto:${PERSONAL_INFO.email}`} className="text-cyber-cyan hover:text-red-300">{PERSONAL_INFO.email}</a></div>
                    <div><span className="text-gray-400">Phone:</span> <a href={`tel:${PERSONAL_INFO.phone}`} className="text-cyber-cyan hover:text-red-300">{PERSONAL_INFO.phone}</a></div>
                    <div><span className="text-gray-400">LeetCode:</span> <a href={PERSONAL_INFO.leetcode} target="_blank" rel="noopener noreferrer" className="text-cyber-cyan hover:text-red-300">View profile</a></div>
                    <div><span className="text-gray-400">Resume:</span> <a href="/Gunavarman_P_AI_Engineer_Resume.pdf" download className="text-cyber-cyan hover:text-red-300">Download PDF</a></div>
                  </div>
                </div>
              </div>

              {/* Education Box */}
              <div className="mt-8 pt-6 border-t border-cyber-cyan/15">
                <h4 className="font-mono text-xs text-cyber-cyan uppercase tracking-widest mb-3">EDUCATION</h4>
                {EDUCATION.map((edu, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-sm font-bold text-white">
                      <span>{edu.degree}</span>
                      <span className="font-mono text-xs text-cyber-blue">{edu.period}</span>
                    </div>
                    <span className="text-xs text-gray-400">{edu.institution} — <span className="text-cyber-cyan">{edu.honors}</span></span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <GlassCard
              className="group relative h-full min-h-[380px] overflow-hidden border-spider-red/25 p-0 hover:border-spider-red/60"
              web={false}
            >
              <img
                src="/me_456.png"
                alt={PERSONAL_INFO.name}
                draggable={false}
                className="absolute inset-0 h-full w-full select-none object-cover object-[50%_15%] transition-transform duration-700 group-hover:scale-105"
                style={{ filter: 'brightness(0.78) contrast(1.15) saturate(0.95)' }}
              />

              {/* fade the studio backdrop into the dark theme */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse 65% 55% at 50% 22%, rgba(5,6,11,0) 0%, rgba(5,6,11,0.35) 55%, rgba(5,6,11,0.92) 85%, #05060b 100%)',
                }}
              />
              {/* red rim + bottom grade, matching the rest of the site's portrait treatment */}
              <div className="absolute inset-0 mix-blend-soft-light" style={{ background: 'linear-gradient(200deg, rgba(230,36,41,0.35) 0%, transparent 45%)' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

              {/* caption */}
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="font-mono text-[11px] uppercase tracking-widest text-spider-crimson">
                  {PERSONAL_INFO.shortName} // Identity Confirmed
                </p>
                <h3 className="font-display text-xl font-bold text-white">{PERSONAL_INFO.name}</h3>
                <p className="text-xs text-gray-400">{PERSONAL_INFO.title}</p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
