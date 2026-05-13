export type ProjectStatus = 'live' | 'private' | 'preparing';

export interface Project {
  id: string;
  no: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  images?: string[];
  tags: string[];
  period?: string;
  role?: string;
  techStack: string[];
  features: string[];
  contribution: string[];
  siteUrl?: string;
  githubUrl?: string;
  status: ProjectStatus;
}

export interface TechStack {
  name: string;
  icon?: string;
}

export interface ContactInfo {
  email: string;
  github: string;
}
