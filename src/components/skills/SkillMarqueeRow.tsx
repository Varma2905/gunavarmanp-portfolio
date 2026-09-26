import { SkillIcon } from './SkillIcon';
import type { SkillGridItem } from './skillsData';

interface SkillMarqueeRowProps {
  skills: SkillGridItem[];
  direction: 'left' | 'right';
  /** Seconds for one full loop of the (single) sequence. */
  speed: number;
}

/* Conservative per-card footprint (card + gap, in px) used only to size the
   loop — smaller than the real rendered card at every breakpoint, so the
   estimate always errs toward *more* repeats rather than fewer. */
const CARD_ADVANCE_PX = 128;

/* The sequence half of the track must stay wider than the widest viewport
   it will ever render in, or the -50% translate exposes empty track before
   it wraps (a visible gap/jump on short rows viewed on a wide monitor).
   4200px comfortably covers ultra-wide desktop screens. */
const MIN_SEQUENCE_WIDTH_PX = 4200;

function getRepeatCount(itemCount: number) {
  const singlePassWidth = itemCount * CARD_ADVANCE_PX;
  return Math.max(1, Math.ceil(MIN_SEQUENCE_WIDTH_PX / singlePassWidth));
}

/** One continuously-scrolling lane of skill cards. A "sequence" (the skill
 *  list repeated enough times to outrun any real viewport width) is
 *  rendered twice back to back and animated exactly half the track's own
 *  width — since both halves are identical, the loop point is invisible. */
export function SkillMarqueeRow({ skills, direction, speed }: SkillMarqueeRowProps) {
  const animationName = direction === 'left' ? 'marqueeLeft' : 'marqueeRight';
  const repeatCount = getRepeatCount(skills.length);
  const sequence = Array.from({ length: repeatCount }, () => skills).flat();

  return (
    <div
      className="marquee-row group/row relative w-full overflow-hidden"
      style={{
        maskImage: 'linear-gradient(90deg, transparent, black 6%, black 94%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, black 6%, black 94%, transparent)'
      }}
    >
      <div
        className="marquee-track flex w-max items-stretch gap-4 sm:gap-5"
        style={{ animation: `${animationName} ${speed}s linear infinite` }}
        role="list"
        aria-label="Technology skills"
      >
        {sequence.map((skill, idx) => (
          <SkillMarqueeCard key={`${skill.name}-${idx}`} skill={skill} decorative={idx >= skills.length} />
        ))}
        {sequence.map((skill, idx) => (
          <SkillMarqueeCard key={`${skill.name}-dup-${idx}`} skill={skill} decorative />
        ))}
      </div>
    </div>
  );
}

function SkillMarqueeCard({ skill, decorative = false }: { skill: SkillGridItem; decorative?: boolean }) {
  return (
    <div
      role={decorative ? undefined : 'listitem'}
      aria-hidden={decorative || undefined}
      className="web-mesh group relative flex h-24 w-28 shrink-0 flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-spider-red/25 bg-white/[0.03] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-spider-red/70 hover:bg-spider-red/10 hover:shadow-[0_0_24px_rgba(230,36,41,0.35)] sm:h-28 sm:w-32 md:w-36"
    >
      <span className="web-shot left-0 right-0 top-1/2" />
      <SkillIcon icon={skill.icon} label={skill.name} size="h-8 w-8 sm:h-9 sm:w-9" />
      <span className="px-2 text-center text-[11px] font-semibold leading-tight text-white sm:text-xs md:text-sm">
        {skill.name}
      </span>
    </div>
  );
}
