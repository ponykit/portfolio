'use client';

import { Project } from '@/types/project';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import clsx from 'clsx';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={clsx(
        'group relative cursor-pointer',
        'rounded-2xl overflow-hidden',
        'bg-gray-800/50 backdrop-blur-sm',
        'border border-gray-700/50',
        'hover:border-purple-500/50',
        'transition-all duration-300'
      )}
    >
      {/* 프로젝트 번호 */}
      <div className="absolute top-4 left-4 z-10">
        <span className="text-4xl font-bold text-gray-700/50">{project.id}</span>
      </div>

      {/* 썸네일 이미지 */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-900/50">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl opacity-20">🖼️</div>
        </div>
        {/* 실제 이미지 사용 시 */}
        {/* <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        /> */}
      </div>

      {/* 프로젝트 정보 */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
          {project.title}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* 태그 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-2">
          <button
            className={clsx(
              'flex-1 py-2 px-4 rounded-lg',
              'bg-gray-700/50 text-white text-sm',
              'hover:bg-gray-700 transition-colors'
            )}
          >
            상세보기
          </button>
          {project.demoUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.demoUrl, '_blank');
              }}
              className={clsx(
                'py-2 px-4 rounded-lg',
                'bg-purple-600 text-white text-sm',
                'hover:bg-purple-700 transition-colors',
                'flex items-center gap-2'
              )}
            >
              사이트 보기
              <ExternalLink size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
