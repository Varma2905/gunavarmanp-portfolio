import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { FiSend, FiMail, FiMapPin, FiCheckCircle, FiGithub, FiLinkedin, FiInstagram, FiMessageSquare, FiCode } from 'react-icons/fi';
import { SectionHeading } from '../ui/SectionHeading';
import { GlassCard } from '../ui/GlassCard';
import { GlowButton } from '../ui/GlowButton';
import { PERSONAL_INFO } from '@/lib/constants';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_d6h6xgl';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_swp5um8';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'BNiQ4QpdwAkXIeVbQ';

type SendStatus = 'idle' | 'sending' | 'success' | 'error';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', title: '', message: '' });
  const [status, setStatus] = useState<SendStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validate = () => {
    if (!formData.name.trim()) return 'Please enter your name.';
    if (!formData.email.trim() || !EMAIL_REGEX.test(formData.email)) return 'Please enter a valid email address.';
    if (!formData.message.trim()) return 'Please enter your message.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;

    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      setStatus('error');
      return;
    }

    setStatus('sending');
    setErrorMessage('');

    try {
      // Send with fallback keys and comprehensive field mappings for EmailJS templates
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          name: formData.name,
          user_name: formData.name,
          from_email: formData.email,
          reply_to: formData.email,
          email: formData.email,
          user_email: formData.email,
          title: formData.title,
          subject: formData.title,
          message: formData.message,
        },
        EMAILJS_PUBLIC_KEY
      );
      setStatus('success');
      setFormData({ name: '', email: '', title: '', message: '' });
      if (formRef.current) formRef.current.reset();
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error: any) {
      console.error('EmailJS send failed:', error);
      const detailMsg = error?.text || error?.message || '';
      setErrorMessage(detailMsg ? `TRANSMISSION FAILED: ${detailMsg}` : 'TRANSMISSION FAILED. PLEASE TRY AGAIN.');
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          badge="08 // SEND A SIGNAL"
          title="Initialize Contact"
          subtitle="Have a project in mind, an AI architecture challenge, or a technical consultation inquiry?"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Info Box */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <GlassCard className="h-full border-cyber-cyan/30">
              <h3 className="font-display text-2xl font-bold text-white mb-4">
                Let&apos;s Build Something <span className="text-gradient-cyan">Futuristic</span>
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-8">
                Available for high-impact contract roles, agentic AI consulting, 3D web experiences, and engineering advisory.
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue shadow-[0_0_10px_rgba(230,36,41,0.2)]">
                    <FiMail size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-xs text-gray-400">DIRECT EMAIL</span>
                    <a href={`mailto:${PERSONAL_INFO.email}`} className="font-sans font-bold text-white hover:text-cyber-cyan transition-colors">
                      {PERSONAL_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan shadow-[0_0_10px_rgba(230,36,41,0.2)]">
                    <FiMessageSquare size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-xs text-gray-400">PHONE</span>
                    <a href={`tel:${PERSONAL_INFO.phone}`} className="font-sans font-bold text-white hover:text-cyber-cyan transition-colors">
                      {PERSONAL_INFO.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-cyber-purple/10 border border-cyber-purple/30 text-cyber-purple shadow-[0_0_10px_rgba(43,108,255,0.2)]">
                    <FiCode size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-xs text-gray-400">DIRECT DETAILS</span>
                    <div className="font-sans font-bold text-white">
                      <div>{PERSONAL_INFO.name}</div>
                      <a href={PERSONAL_INFO.leetcode} target="_blank" rel="noopener noreferrer" className="text-cyber-cyan hover:text-red-300 transition-colors">
                        LeetCode profile
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-cyber-purple/10 border border-cyber-purple/30 text-cyber-purple shadow-[0_0_10px_rgba(43,108,255,0.2)]">
                    <FiMapPin size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-xs text-gray-400">LOCATION</span>
                    <span className="font-sans font-bold text-white">
                      {PERSONAL_INFO.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-6 border-t border-cyber-cyan/15">
                <span className="font-mono text-xs text-cyber-cyan uppercase tracking-widest block mb-4">
                  OFFICIAL CHANNELS
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href={PERSONAL_INFO.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-cyber-dark border border-cyber-cyan/20 text-gray-300 hover:text-cyber-cyan hover:border-cyber-cyan transition-all font-mono text-xs flex items-center gap-1.5"
                  >
                    <FiGithub size={18} />
                    <span>GitHub</span>
                  </a>
                  <a
                    href={PERSONAL_INFO.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-cyber-dark border border-cyber-cyan/20 text-gray-300 hover:text-cyber-cyan hover:border-cyber-cyan transition-all font-mono text-xs flex items-center gap-1.5"
                  >
                    <FiLinkedin size={18} />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href={PERSONAL_INFO.leetcode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-cyber-dark border border-cyber-cyan/20 text-gray-300 hover:text-cyber-cyan hover:border-cyber-cyan transition-all font-mono text-xs flex items-center gap-1.5"
                  >
                    <span>LeetCode</span>
                  </a>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <GlassCard className="border-cyber-cyan/30">
              {status === 'success' ? (
                <div className="py-16 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan flex items-center justify-center mb-4 shadow-[0_0_30px_#e62429] animate-pulse">
                    <FiCheckCircle size={32} />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white mb-2">
                    SIGNAL TRANSMITTED SUCCESSFULLY
                  </h3>
                  <p className="text-gray-300 font-mono text-sm">
                    Thank you! Your message has been encrypted and sent to Varma.
                  </p>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-mono text-xs text-cyber-cyan uppercase tracking-wider mb-2">
                        YOUR NAME *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        disabled={status === 'sending'}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 bg-cyber-dark/80 border border-cyber-cyan/20 rounded-xl text-white placeholder-gray-500 font-sans focus:outline-none focus:border-cyber-cyan transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-cyber-cyan uppercase tracking-wider mb-2">
                        YOUR EMAIL *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        disabled={status === 'sending'}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter your Email"
                        className="w-full px-4 py-3 bg-cyber-dark/80 border border-cyber-cyan/20 rounded-xl text-white placeholder-gray-500 font-sans focus:outline-none focus:border-cyber-cyan transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-cyber-cyan uppercase tracking-wider mb-2">
                      SUBJECT
                    </label>
                    <input
                      type="text"
                      name="title"
                      disabled={status === 'sending'}
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Agentic AI Project Inquiry"
                      className="w-full px-4 py-3 bg-cyber-dark/80 border border-cyber-cyan/20 rounded-xl text-white placeholder-gray-500 font-sans focus:outline-none focus:border-cyber-cyan transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-cyber-cyan uppercase tracking-wider mb-2">
                      TRANSMISSION MESSAGE *
                    </label>
                    <textarea
                      required
                      name="message"
                      disabled={status === 'sending'}
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your vision or technical requirements..."
                      className="w-full px-4 py-3 bg-cyber-dark/80 border border-cyber-cyan/20 rounded-xl text-white placeholder-gray-500 font-sans focus:outline-none focus:border-cyber-cyan transition-colors resize-none"
                    />
                  </div>

                  {status === 'error' && errorMessage && (
                    <p className="text-center font-mono text-xs text-spider-crimson">
                      {errorMessage}
                    </p>
                  )}

                  <GlowButton
                    variant="primary"
                    className={`w-full py-4 ${status === 'sending' ? 'opacity-70 pointer-events-none' : ''}`}
                  >
                    <FiSend className="text-lg" />
                    <span>{status === 'sending' ? 'TRANSMITTING...' : 'SEND ENCRYPTED SIGNAL'}</span>
                  </GlowButton>
                </form>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
