export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  images: string[];
  tags: string[];
  techStack: string[];
  duration: string;
  client?: string;
  role: string;
  detailDescription: string;
  demoUrl?: string;
  githubUrl?: string;
}

export interface TechStack {
  name: string;
  icon: string;
}

export interface ContactInfo {
  email: string;
  github: string;
}
