'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { projects } from '@/data/projects';
import { Project } from '@/types/project';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-purple-400 text-sm uppercase tracking-wider mb-4">
            MY PROJECTS
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            프로젝트 한눈에 보기
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            지금까지 만든 서비스와 실험들을 프로젝트 단위로 정리했습니다.
            상세보기에서 기술 스펙과 역할을 확인하고, 운영 중인 사이트는 바로 열어볼 수 있습니다.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProjectCard
                project={project}
                onOpen={() => setSelectedProject(project)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
