import { useState, useEffect } from 'react';

interface TypeWriterProps {
  roles: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export function TypeWriter({
  roles,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 1800,
}: TypeWriterProps) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];

    const handleType = () => {
      if (!isDeleting) {
        setText(currentRole.substring(0, text.length + 1));

        if (text.length + 1 === currentRole.length) {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        setText(currentRole.substring(0, text.length - 1));

        if (text.length - 1 === 0) {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    };

    const timer = setTimeout(handleType, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, roleIndex, roles, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className="inline-flex items-center text-cyber-blue font-mono font-bold tracking-wide">
      <span>{text}</span>
      <span className="w-2 h-6 ml-1 bg-cyber-cyan animate-pulse inline-block shadow-[0_0_8px_#e62429]" />
    </span>
  );
}
