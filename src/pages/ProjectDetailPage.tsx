import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiGithub, FiExternalLink, FiCheck, FiCpu, FiLayers } from 'react-icons/fi';
import { PROJECTS } from '@/lib/constants';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowButton } from '@/components/ui/GlowButton';

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const project = PROJECTS.find((p) => p.id === slug) || PROJECTS[0];

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-28 pb-20 px-6 relative z-10">
      <div className="max-w-5xl mx-auto">

        {/* Back button */}
        <a
          href="/#projects"
          className="inline-flex items-center gap-2 font-mono text-xs text-cyber-cyan hover:text-white mb-8 group transition-colors"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>RETURN TO ALL PROJECTS</span>
        </a>

        {/* Header Title */}
        <div className="mb-8">
          <span className="font-mono text-xs text-cyber-blue uppercase tracking-widest block mb-2">
            {project.category} // CASE STUDY DETAIL
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4">
            {project.title}
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl font-sans">
            {project.tagline}
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative h-96 w-full rounded-2xl overflow-hidden mb-12 border border-cyber-cyan/30 shadow-[0_0_40px_rgba(230,36,41,0.2)]">
          <img
            src={project.image}
            alt={project.title}
            className="object-cover w-full h-full"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-transparent to-transparent" />
        </div>

        {/* Content Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">

          {/* Main Description */}
          <div className="lg:col-span-8 space-y-8">
            <GlassCard>
              <h2 className="font-display text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FiLayers className="text-cyber-cyan" />
                <span>Architecture &amp; System Overview</span>
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                {project.description}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Engineered with high availability, fault tolerance, and modular agent execution graphs. Designed to scale seamlessly across enterprise clusters.
              </p>
            </GlassCard>

            <GlassCard>
              <h2 className="font-display text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FiCpu className="text-cyber-purple" />
                <span>Key Technical Features</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.features.map((feature: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <FiCheck className="text-cyber-blue mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard>
              <h3 className="font-mono text-xs text-cyber-cyan uppercase tracking-widest mb-4">
                TECHNOLOGY STACK
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.techStack.map((tech: string) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-md bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan font-mono text-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-cyber-cyan/15">
                <GlowButton href={project.liveDemo} variant="primary" className="w-full">
                  <FiExternalLink />
                  <span>LAUNCH DEMO</span>
                </GlowButton>
                <GlowButton href={project.github} variant="outline" className="w-full">
                  <FiGithub />
                  <span>GITHUB REPO</span>
                </GlowButton>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
