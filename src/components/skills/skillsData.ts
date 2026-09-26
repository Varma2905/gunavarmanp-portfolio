import {
  siPython,
  siJavascript,
  siTypescript,
  siReact,
  siNextdotjs,
  siThreedotjs,
  siHtml5,
  siLangchain,
  siLanggraph,
  siGooglecloud,
  siC,
  siCplusplus,
  siOpenjdk,
  siAnthropic,
  siOpenrouter,
  siHuggingface,
  siMysql,
  siMongodb,
  siDocker
} from 'simple-icons';
import { FaAws } from 'react-icons/fa';
import type { IconType } from 'react-icons';

export type SimpleIconLike = {
  svg: string;
  title: string;
  slug: string;
};

/* AWS has no simple-icons entry (Amazon trademarks are excluded from that
   package), so its logo comes from react-icons instead — a component
   rather than an SVG-string object like every other entry here. */
export type SkillIconSource = SimpleIconLike | IconType;

export interface SkillGridItem {
  name: string;
  icon: SkillIconSource;
}

/* Order is preserved when the marquee splits this into 3 rows. */
export const skillGrid: SkillGridItem[] = [
  { name: 'Agentic AI', icon: siOpenrouter },
  { name: 'Gen AI', icon: siAnthropic },
  { name: 'LLM', icon: siHuggingface },
  { name: 'RAG', icon: siGooglecloud },
  { name: 'LangChain', icon: siLangchain },
  { name: 'LangGraph', icon: siLanggraph },
  { name: 'DevOps', icon: siGooglecloud },
  { name: 'MLOps', icon: siGooglecloud },
  { name: 'Python', icon: siPython },
  { name: 'Java', icon: siOpenjdk },
  { name: 'C++', icon: siCplusplus },
  { name: 'C', icon: siC },
  { name: 'JavaScript', icon: siJavascript },
  { name: 'TypeScript', icon: siTypescript },
  { name: 'React', icon: siReact },
  { name: 'Next.js', icon: siNextdotjs },
  { name: 'Three.js', icon: siThreedotjs },
  { name: 'HTML & CSS', icon: siHtml5 },
  { name: 'MySQL', icon: siMysql },
  { name: 'MongoDB', icon: siMongodb },
  { name: 'Docker', icon: siDocker },
  { name: 'AWS', icon: FaAws }
];
