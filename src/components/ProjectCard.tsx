'use client';

import { Project } from '@/types/project';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';

interface ProjectCardProps {
  project: Project;
  onOpen: () => void;
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const [imageError, setImageError] = useState(false);

  const canViewSite = project.status === 'live' && project.siteUrl;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        'group relative',
        'rounded-2xl overflow-hidden',
        'bg-gray-800/50 backdrop-blur-sm',
        'border border-gray-700/50',
        'hover:border-purple-500/50',
        'transition-all duration-300',
        'flex flex-col h-full'
      )}
    >
      {/* 썸네일 이미지 */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-900/50">
        {/* 프로젝트 번호 */}
        <div className="absolute top-4 left-4 z-10">
          <span className="text-4xl font-bold text-white/20 drop-shadow-lg">
            {project.no}
          </span>
        </div>
        {!imageError ? (
          <img
            src={project.thumbnail}
            alt={`${project.title} screenshot`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
            <div className="text-center">
              <div className="text-4xl opacity-20 mb-2">🖼️</div>
              <p className="text-xs text-gray-600">이미지 준비중</p>
            </div>
          </div>
        )}
      </div>

      {/* 프로젝트 정보 */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
          {project.title}
        </h3>

        <p className="text-sm text-purple-300 mb-3">{project.subtitle}</p>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
          {project.description}
        </p>

        {/* 태그 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={onOpen}
            className={clsx(
              'flex-1 py-2 px-4 rounded-lg',
              'bg-gray-700/50 text-white text-sm font-medium',
              'hover:bg-gray-700 transition-colors'
            )}
          >
            상세보기
          </button>
          {canViewSite ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.siteUrl, '_blank');
              }}
              className={clsx(
                'flex-1 sm:flex-initial py-2 px-4 rounded-lg',
                'bg-purple-600 text-white text-sm font-medium',
                'hover:bg-purple-700 transition-colors',
                'flex items-center justify-center gap-2 whitespace-nowrap'
              )}
            >
              사이트 보기
              <ExternalLink size={14} />
            </button>
          ) : (
            <button
              disabled
              className={clsx(
                'flex-1 sm:flex-initial py-2 px-4 rounded-lg',
                'bg-gray-700/30 text-gray-500 text-sm font-medium',
                'cursor-not-allowed',
                'flex items-center justify-center gap-2 whitespace-nowrap'
              )}
            >
              사이트 준비중
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
