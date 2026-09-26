import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlowButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  download?: boolean | string;
}

export function GlowButton({ children, href, onClick, variant = 'primary', className, download }: GlowButtonProps) {
  const baseStyles = "relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-mono text-sm font-bold tracking-wider transition-all duration-300 group overflow-hidden select-none cursor-pointer";

  const variants = {
    primary: "bg-gradient-to-r from-spider-blood via-spider-red to-spider-crimson text-white shadow-[0_0_22px_rgba(230,36,41,0.5)] hover:shadow-[0_0_38px_rgba(230,36,41,0.9)] hover:scale-105",
    secondary: "bg-spider-blue/20 border border-spider-blue/50 text-white shadow-[0_0_16px_rgba(43,108,255,0.35)] hover:shadow-[0_0_30px_rgba(43,108,255,0.7)] hover:border-spider-blue hover:scale-105",
    outline: "bg-black/70 border border-spider-red/35 text-spider-crimson hover:bg-spider-red/10 hover:border-spider-red shadow-[0_0_12px_rgba(230,36,41,0.18)] hover:shadow-[0_0_26px_rgba(230,36,41,0.45)] hover:scale-105"
  };

  const content = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {/* web-thread sheen sweeping across on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 pointer-events-none" />
      <span className="web-shot left-0 right-0 top-1/2" />
    </>
  );

  if (href) {
    return (
      <a href={href} download={download} className={cn(baseStyles, variants[variant], className)}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={cn(baseStyles, variants[variant], className)}>
      {content}
    </button>
  );
}
