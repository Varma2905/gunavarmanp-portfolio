import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAward, FiMaximize2, FiX } from 'react-icons/fi';
import { SectionHeading } from '../ui/SectionHeading';
import { GlassCard } from '../ui/GlassCard';
import { CERTIFICATES } from '@/lib/constants';

export function CertificatesSection() {
  const [lightboxCert, setLightboxCert] = useState<typeof CERTIFICATES[0] | null>(null);

  return (
    <section id="certifications" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          badge="05 // VERIFIED CREDENTIALS"
          title="Certifications &amp; Accreditations"
          subtitle="Industry-verified certifications in deep learning, cloud engineering, and agentic AI systems."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CERTIFICATES.map((cert, idx) => (
            <motion.div
              key={cert.credentialId}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <GlassCard className="group flex flex-col justify-between h-full border-cyber-cyan/20 hover:border-cyber-cyan/60 p-0 overflow-hidden">
                {/* Image overlay */}
                <div
                  className="relative h-48 w-full cursor-pointer overflow-hidden"
                  onClick={() => setLightboxCert(cert)}
                >
                  <img
                    src={cert.file}
                    alt={cert.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-cyber-dark/40 to-transparent" />
                  
                  <button className="absolute top-4 right-4 p-2 rounded-lg bg-cyber-dark/80 text-cyber-cyan border border-cyber-cyan/30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiMaximize2 size={16} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-cyber-blue font-mono text-xs mb-2">
                    <FiAward />
                    <span>{cert.issuer}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-white group-hover:text-cyber-cyan transition-colors mb-2">
                    {cert.title}
                  </h3>
                  <div className="flex justify-between items-center font-mono text-xs text-gray-400 pt-3 border-t border-cyber-cyan/10">
                    <span>ID: {cert.credentialId}</span>
                    <span className="text-cyber-cyan">{cert.date}</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl w-full bg-cyber-dark border border-cyber-cyan/40 rounded-2xl overflow-hidden shadow-[0_0_50px_#e62429]"
            >
              <button
                onClick={() => setLightboxCert(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-cyber-dark text-white border border-cyber-cyan/30"
              >
                <FiX size={20} />
              </button>
              <div className="relative h-[70vh] w-full">
                <img
                  src={lightboxCert.file}
                  alt={lightboxCert.title}
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="p-4 text-center bg-cyber-dark/90 border-t border-cyber-cyan/20">
                <h3 className="font-display text-xl font-bold text-white">{lightboxCert.title}</h3>
                <p className="font-mono text-xs text-cyber-cyan">{lightboxCert.issuer} — Issued {lightboxCert.date}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
