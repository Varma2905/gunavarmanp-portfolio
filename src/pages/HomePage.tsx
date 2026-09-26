import { useState, useEffect, lazy, Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { LoadingScreen } from '@/components/layout/LoadingScreen';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { MaskReveal } from '@/components/mask/MaskReveal';
import { HeroSection } from '@/components/hero/HeroSection';
import { AboutSection } from '@/components/about/AboutSection';
import { SkillsSection } from '@/components/skills/SkillsSection';
import { ProjectsSection } from '@/components/projects/ProjectsSection';
import { ServicesSection } from '@/components/services/ServicesSection';
import { CertificatesSection } from '@/components/certificates/CertificatesSection';
import { BlogSection } from '@/components/blog/BlogSection';
import { TerminalSection } from '@/components/terminal/TerminalSection';
import { ContactSection } from '@/components/contact/ContactSection';
import { Footer } from '@/components/layout/Footer';
import { SpiderDivider } from '@/components/ui/SpiderDivider';

/* The Rapier physics engine (WASM) + three.js this pulls in is heavy —
   several hundred KB gzipped. Splitting it into its own chunk keeps it out
   of the app's critical first-paint bundle; it downloads in the background
   right after the page becomes interactive instead of blocking it. */
const GlobalSpiderMan = lazy(() =>
  import('@/components/layout/GlobalSpiderMan').then((m) => ({ default: m.GlobalSpiderMan }))
);

export function HomePage() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, [showContent]);

  return (
    <main className="min-h-screen relative bg-transparent">
      {/* AI Bootup Loading Screen */}
      <LoadingScreen onComplete={() => setShowContent(true)} />

      {/* Ctrl+K Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Navigation Bar */}
      {showContent && <Navbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />}

      {/* Global draggable Spider-Man — one instance, independent of any
          section, web anchored to the navbar. Lazy-loaded, see import above. */}
      {showContent && (
        <Suspense fallback={null}>
          <GlobalSpiderMan frontImage="/spider-toon.png" />
        </Suspense>
      )}

      {/* Portfolio Sections - Mounted only after welcome screen completes so hero animates in fresh */}
      {showContent && (
        <div>
          {/* Cinematic intro: welcome screen → mask reveal → hero */}
          <MaskReveal />
          <HeroSection />
          <SpiderDivider />
          <AboutSection />
          <SpiderDivider />
          <SkillsSection />
          <SpiderDivider />
          <ProjectsSection />
          <SpiderDivider />
          <ServicesSection />
          <SpiderDivider />
          <CertificatesSection />
          <SpiderDivider />
          <BlogSection />
          <SpiderDivider />
          <TerminalSection />
          <SpiderDivider />
          <ContactSection />

          {/* Footer */}
          <Footer />
        </div>
      )}
    </main>
  );
}
