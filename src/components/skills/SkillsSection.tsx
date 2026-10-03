import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { GlassCard } from '../ui/GlassCard';
import { SkillMarqueeRow } from './SkillMarqueeRow';
import { skillGrid } from './skillsData';
import { SKILLS } from '@/lib/constants';

/* 22 skills split into 3 marquee lanes, original order preserved. */
const MARQUEE_ROWS: { skills: typeof skillGrid; direction: 'left' | 'right'; speed: number }[] = [
  { skills: skillGrid.slice(0, 7), direction: 'right', speed: 32 },
  { skills: skillGrid.slice(7, 14), direction: 'left', speed: 38 },
  { skills: skillGrid.slice(14, 22), direction: 'right', speed: 42 },
];

/* Power classes — every entry in SKILLS is surfaced under one of these. */
const POWER_CLASSES: { key: string; label: string; blurb: string; categories: string[] }[] = [
  { key: 'ai', label: 'AI / ML', blurb: 'Agentic reasoning, generative systems, retrieval', categories: ['AI'] },
  { key: 'frontend', label: 'Frontend', blurb: 'Interfaces, 3D web, motion', categories: ['Frontend'] },
  { key: 'backend', label: 'Backend', blurb: 'APIs, services, core languages', categories: ['Backend'] },
  { key: 'database', label: 'Database', blurb: 'Storage, modelling, querying', categories: ['Database'] },
  { key: 'cloud', label: 'Cloud / DevOps', blurb: 'Shipping, containers, pipelines', categories: ['Cloud', 'DevOps'] },
  { key: 'ai-tools', label: 'AI Tools / MLOps', blurb: 'Models, frameworks, deployment', categories: ['AI Tools'] },
];

export function SkillsSection() {
  return (
    <section id="skills" className="py-24 relative z-10 scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          badge="02 // POWER MATRIX"
          title="My Superpowers"
          subtitle="Every ability in the arsenal — grouped by power class, sharpened on production work."
        />

        {/* Power class breakdown */}
        <div className="mb-16 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {POWER_CLASSES.map((power, idx) => {
            const abilities = SKILLS.filter((skill) => power.categories.includes(skill.category));
            if (abilities.length === 0) return null;

            return (
              <motion.div
                key={power.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <GlassCard className="group h-full border-spider-red/20 hover:border-spider-red/55">
                  <div className="mb-4 flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-lg font-bold uppercase tracking-wide text-white">
                      {power.label}
                    </h3>
                    <span className="font-mono text-[11px] text-spider-crimson">
                      {abilities.length} ABILITIES
                    </span>
                  </div>
                  <p className="mb-5 font-mono text-[11px] uppercase tracking-widest text-gray-500">
                    {power.blurb}
                  </p>

                  <ul className="space-y-3">
                    {abilities.map((ability) => (
                      <li key={ability.name}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="text-gray-200">{ability.name}</span>
                          <span className="font-mono text-[11px] text-spider-crimson">{ability.level}%</span>
                        </div>
                        <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-spider-blood via-spider-red to-spider-blue"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${ability.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, ease: 'easeOut' }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Core arsenal marquee */}
        <p className="mb-8 text-center font-mono text-xs uppercase tracking-[0.25em] text-gray-500">
          Core arsenal
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-full overflow-hidden space-y-4 sm:space-y-5"
      >
        {MARQUEE_ROWS.map((row, idx) => (
          <SkillMarqueeRow key={idx} skills={row.skills} direction={row.direction} speed={row.speed} />
        ))}
      </motion.div>
    </section>
  );
}
