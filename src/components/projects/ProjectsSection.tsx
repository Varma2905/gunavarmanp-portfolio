import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiExternalLink, FiLayers, FiCheck } from 'react-icons/fi';
import { SectionHeading } from '../ui/SectionHeading';
import { GlassCard } from '../ui/GlassCard';
import { GlowButton } from '../ui/GlowButton';
import { PROJECTS } from '@/lib/constants';

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const filters = ['ALL', 'Agentic AI', 'AI & ML', 'Computer Vision', 'Full Stack'];

  const getFilterCount = (filter: string) => {
    if (filter === 'ALL') return PROJECTS.length;
    return PROJECTS.filter(
      p => p.category === filter || (p.secondaryCategories && p.secondaryCategories.includes(filter))
    ).length;
  };

  const filteredProjects = activeFilter === 'ALL'
    ? PROJECTS
    : PROJECTS.filter(
        p => p.category === activeFilter || (p.secondaryCategories && p.secondaryCategories.includes(activeFilter))
      );

  return (
    <section id="projects" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          badge="03 // MISSION LOG"
          title="Missions"
          subtitle="Deployed systems and field work — agentic AI platforms, computer vision, and full stack products."
        />

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {filters.map((filter) => {
            const count = getFilterCount(filter);
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-xl font-mono text-xs transition-all duration-300 border flex items-center gap-2 ${
                  activeFilter === filter
                    ? 'bg-spider-red text-white font-bold border-spider-crimson shadow-[0_0_22px_rgba(230,36,41,0.65)] scale-105'
                    : 'bg-black/70 text-gray-400 border-spider-red/20 hover:text-white hover:border-spider-red/50'
                }`}
              >
                <span>{filter}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  activeFilter === filter ? 'bg-white/20 text-white' : 'bg-spider-red/10 text-spider-crimson'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Missions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, idx) => (
            <MissionCard
              key={project.id}
              project={project}
              index={idx}
              onOpenCaseStudy={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </div>

      {/* Case Study Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0a0c14] border border-spider-red/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(230,36,41,0.4)]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white rounded-lg bg-spider-red/10 border border-spider-red/30"
              >
                ✕
              </button>

              <span className="font-mono text-xs text-spider-crimson tracking-widest uppercase mb-2 block">
                {selectedProject.category} // MISSION BRIEF
              </span>

              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
                {selectedProject.title}
              </h2>

              {/* Modal Image */}
              <div className="relative h-64 w-full rounded-xl overflow-hidden mb-6 border border-spider-red/30">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="object-cover w-full h-full"
                />
              </div>

              <p className="text-gray-300 leading-relaxed mb-6">
                {selectedProject.description}
              </p>

              {/* Features List */}
              <div className="mb-6">
                <h4 className="font-mono text-xs text-spider-crimson tracking-wider uppercase mb-3">KEY INNOVATIONS</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedProject.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <FiCheck className="text-spider-red flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-spider-red/20">
                <GlowButton href={selectedProject.caseStudyUrl || `/projects/${selectedProject.id}`} variant="primary">
                  <FiLayers />
                  <span>FULL CASE STUDY</span>
                </GlowButton>
                {selectedProject.liveDemo && (
                  <GlowButton href={selectedProject.liveDemo} variant="outline">
                    <FiExternalLink />
                    <span>LAUNCH DEMO</span>
                  </GlowButton>
                )}
                {selectedProject.github && (
                  <GlowButton href={selectedProject.github} variant="outline">
                    <FiGithub />
                    <span>SOURCE CODE</span>
                  </GlowButton>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

interface MissionCardProps {
  project: typeof PROJECTS[0];
  index: number;
  onOpenCaseStudy: () => void;
}

/** Mission card with pointer-tracked tilt and a web-shot hover pulse. */
function MissionCard({ project, index, onOpenCaseStudy }: MissionCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const node = cardRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: px * 9, y: py * -9 });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ perspective: 1000 }}
    >
      <motion.div
        animate={{ rotateY: tilt.x, rotateX: tilt.y }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        className="h-full"
      >
        <GlassCard className="group flex flex-col h-full border-spider-red/20 hover:border-spider-red/60 hover:shadow-[0_0_34px_rgba(230,36,41,0.35)] transition-all duration-300 p-0 overflow-hidden">
          {/* Image Container with Hover Zoom */}
          <div className="relative h-52 w-full overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05060b] via-[#05060b]/50 to-transparent" />
            <div className="absolute inset-0 web-radial opacity-0 group-hover:opacity-60 transition-opacity duration-500" />

            {/* web-shooting streaks on hover */}
            <span className="web-shot left-0 right-0 top-1/3" />
            <span className="web-shot left-0 right-0 top-2/3" style={{ animationDelay: '0.12s' }} />

            {/* Category Badge */}
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-spider-red/40 text-spider-crimson font-mono text-[10px] tracking-wider uppercase">
              {project.category}
            </span>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col flex-grow justify-between">
            <div>
              <h3 className="font-display text-xl font-bold text-white group-hover:text-spider-crimson transition-colors mb-2">
                {project.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded bg-spider-red/10 border border-spider-red/25 text-red-200 font-mono text-[10px]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-spider-red/15">
              <button
                onClick={onOpenCaseStudy}
                className="inline-flex items-center gap-1 text-xs font-mono text-spider-red hover:text-spider-crimson transition-colors"
              >
                <FiLayers />
                <span>MISSION BRIEF</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-black/70 border border-spider-red/20 text-gray-300 hover:text-spider-crimson hover:border-spider-red transition-colors"
                  title="View GitHub Source"
                  aria-label={`${project.title} on GitHub`}
                >
                  <FiGithub size={16} />
                </a>
                <a
                  href={project.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-black/70 border border-spider-red/20 text-gray-300 hover:text-spider-crimson hover:border-spider-red transition-colors"
                  title="Live Demo"
                  aria-label={`${project.title} live demo`}
                >
                  <FiExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
