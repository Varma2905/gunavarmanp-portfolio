import { motion } from 'framer-motion';
import { FiCpu, FiCode, FiZap, FiBox, FiLayers, FiCheckCircle } from 'react-icons/fi';
import { SectionHeading } from '../ui/SectionHeading';
import { GlassCard } from '../ui/GlassCard';
import { SERVICES } from '@/lib/constants';

export function ServicesSection() {
  const iconMap: Record<string, React.ElementType> = {
    Brain: FiCpu,
    Workflow: FiLayers,
    Layout: FiCode,
    Zap: FiZap,
    Cpu: FiCpu,
    Box: FiBox,
  };

  return (
    <section id="services" className="py-24 relative z-10 scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          badge="04 // FIELD CAPABILITIES"
          title="Architectural Services"
          subtitle="Specialized AI engineering and frontend web architecture solutions designed for high-scale tech enterprises."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, idx) => {
            const Icon = iconMap[service.icon] || FiCpu;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <GlassCard className="group h-full flex flex-col justify-between border-cyber-cyan/15 hover:border-cyber-cyan/60 hover:-translate-y-2 transition-all duration-300">
                  <div>
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 border border-cyber-cyan/30 flex items-center justify-center text-cyber-blue mb-6 group-hover:scale-110 group-hover:border-cyber-cyan transition-all shadow-[0_0_15px_rgba(230,36,41,0.2)]">
                      <Icon size={24} />
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-xl font-bold text-white group-hover:text-cyber-cyan transition-colors mb-3">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-cyber-blue pt-4 border-t border-cyber-cyan/10">
                    <FiCheckCircle />
                    <span>PRODUCTION READY ARCHITECTURE</span>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
