import type { IconType } from 'react-icons';
import {
  SiSpring,
  SiKotlin,
  SiPostgresql,
  SiMysql,
  SiRedis,
  SiMongodb,
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiCloudflarepages,
  SiGithub,
  SiGitlab,
  SiJirasoftware,
  SiIntellijidea,
  SiFramer,
} from 'react-icons/si';
import { FaJava, FaAws, FaTheaterMasks, FaDatabase } from 'react-icons/fa';
import { TbBrandCSharp } from 'react-icons/tb';

export interface TechItem {
  name: string;
  icon: IconType;
  color: string;
}

export const techStacks: TechItem[] = [
  { name: 'Java', icon: FaJava, color: '#E76F00' },
  { name: 'Kotlin', icon: SiKotlin, color: '#7F52FF' },
  { name: 'Spring Boot', icon: SiSpring, color: '#6DB33F' },
  { name: 'C#', icon: TbBrandCSharp, color: '#9B4F96' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { name: 'Next.js', icon: SiNextdotjs, color: '#FFFFFF' },
  { name: 'React', icon: SiReact, color: '#61DAFB' },
  { name: 'Tailwind', icon: SiTailwindcss, color: '#38BDF8' },
  { name: 'Framer Motion', icon: SiFramer, color: '#BB4FFF' },
  { name: 'Playwright', icon: FaTheaterMasks, color: '#2EAD33' },
  { name: 'AWS', icon: FaAws, color: '#FF9900' },
  { name: 'Cloudflare', icon: SiCloudflarepages, color: '#F38020' },
  { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
  { name: 'MySQL', icon: SiMysql, color: '#00758F' },
  { name: 'Oracle', icon: FaDatabase, color: '#F80000' },
  { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
  { name: 'Redis', icon: SiRedis, color: '#DC382D' },
  { name: 'GitHub', icon: SiGithub, color: '#FFFFFF' },
  { name: 'GitLab', icon: SiGitlab, color: '#FC6D26' },
  { name: 'Jira', icon: SiJirasoftware, color: '#0052CC' },
  { name: 'IntelliJ', icon: SiIntellijidea, color: '#FE315D' },
];
