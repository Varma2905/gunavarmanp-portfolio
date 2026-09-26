import type { SkillIconSource } from './skillsData';

export function SkillIcon({
  icon,
  label,
  size = 'h-16 w-16'
}: {
  icon: SkillIconSource;
  label: string;
  size?: string;
}) {
  const iconClassName = 'h-full w-full drop-shadow-[0_0_10px_rgba(230,36,41,0.35)]';

  return (
    <div className={`flex ${size} items-center justify-center text-red-300 transition-colors duration-300 group-hover:text-spider-crimson`} aria-label={label}>
      {typeof icon === 'function' ? (
        (() => {
          const Icon = icon;
          return <Icon className={iconClassName} role="img" aria-label={label} />;
        })()
      ) : (
        <svg
          className={iconClassName}
          viewBox="0 0 24 24"
          fill="currentColor"
          role="img"
          aria-label={label}
          dangerouslySetInnerHTML={{ __html: icon.svg }}
        />
      )}
    </div>
  );
}
